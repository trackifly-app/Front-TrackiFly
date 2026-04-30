import { jsPDF } from "jspdf";
import { ShipmentValues } from "@/interfaces/shipment";

const cargarImagenComoDataUrl = async (src: string) => {
  const response = await fetch(src);
  const blob = await response.blob();

  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const dibujarSeccion = (
  doc: jsPDF,
  titulo: string,
  x: number,
  y: number,
  ancho: number,
  alto: number,
) => {
  doc.setDrawColor(220, 224, 230);
  doc.setFillColor(250, 250, 250);
  doc.rect(x, y, ancho, alto, "FD");

  doc.setFillColor(217, 107, 74);
  doc.rect(x, y, ancho, 8, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text(titulo, x + 5, y + 5.7);

  doc.setTextColor(35, 35, 35);
  doc.setFont("helvetica", "normal");
};

const escribirLinea = (
  doc: jsPDF,
  etiqueta: string,
  valor: string,
  x: number,
  y: number,
  maxWidth = 155,
) => {
  doc.setFont("helvetica", "bold");
  doc.text(`${etiqueta}:`, x, y);

  doc.setFont("helvetica", "normal");
  const lineas = doc.splitTextToSize(valor, maxWidth);
  doc.text(lineas, x + 38, y);

  return y + Math.max(lineas.length, 1) * 6;
};

export const descargarReporte = async (
  values: ShipmentValues,
  volumen: number,
  precioBase: number,
  montoRecargo: number,
  descuentoEmpresa: number,
  precioFinal: number,
  pesoNum: number,
) => {
  const doc = new jsPDF();
  const fecha = new Date().toLocaleDateString("es-AR");
  const pageWidth = doc.internal.pageSize.getWidth();
  const marginX = 18;
  const contentWidth = pageWidth - marginX * 2;

  try {
    const logo = await cargarImagenComoDataUrl("/logo-trackifly.png");
    doc.addImage(logo, "PNG", marginX, 9, 46, 18);
  } catch {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(217, 107, 74);
    doc.text("TrackiFly", marginX, 22);
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(35, 35, 35);
  doc.text("Reporte de cotizacion de envio", pageWidth / 2, 35, {
    align: "center",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(90, 90, 90);
  doc.text(`Fecha: ${fecha}`, pageWidth - marginX, 20, { align: "right" });

  doc.setDrawColor(217, 107, 74);
  doc.setLineWidth(0.6);
  doc.line(marginX, 41, pageWidth - marginX, 41);

  dibujarSeccion(doc, "Datos del envio", marginX, 47, contentWidth, 36);
  doc.setFontSize(9.5);
  let y = 61;
  y = escribirLinea(
    doc,
    "Retiro",
    String(values.pickup_direction || "No especificado"),
    marginX + 7,
    y,
    120,
  );
  y = escribirLinea(
    doc,
    "Entrega",
    String(values.delivery_direction || "No especificado"),
    marginX + 7,
    y,
    120,
  );
  escribirLinea(
    doc,
    "Distancia",
    `${values.distance.toFixed(2)} km`,
    marginX + 7,
    y,
  );

  dibujarSeccion(doc, "Datos del paquete", marginX, 89, contentWidth, 42);
  doc.setFontSize(9.5);
  escribirLinea(doc, "Alto", `${values.height || 0} ${values.unit}`, marginX + 7, 103);
  escribirLinea(doc, "Ancho", `${values.width || 0} ${values.unit}`, marginX + 7, 111);
  escribirLinea(doc, "Profundidad", `${values.depth || 0} ${values.unit}`, marginX + 7, 119);
  escribirLinea(doc, "Peso", `${pesoNum} kg`, marginX + 100, 103);
  escribirLinea(doc, "Volumen", `${volumen.toFixed(4)} m3`, marginX + 100, 111);

  const extras: string[] = [];

  if (values.fragile) extras.push("Fragil");
  if (values.dangerous) extras.push("Peligroso");
  if (values.cooled) extras.push("Refrigerado");
  if (values.urgent) extras.push("Urgente");

  dibujarSeccion(doc, "Extras", marginX, 137, contentWidth, 22);
  doc.setFontSize(9.5);
  doc.text(
    extras.length > 0 ? extras.join(", ") : "Sin extras seleccionados",
    marginX + 7,
    152,
  );

  dibujarSeccion(doc, "Presupuesto", marginX, 165, contentWidth, 50);
  if (descuentoEmpresa > 0) {
      escribirLinea(
        doc,
        "Descuento empresa",
        `$${descuentoEmpresa.toLocaleString("es-AR")}`,
        marginX + 7,
        196,
      );
    }
  doc.setFontSize(10);
  escribirLinea(
    doc,
    "Precio base",
    `$${precioBase.toLocaleString("es-AR")}`,
    marginX + 7,
    179,
  );
  escribirLinea(
    doc,
    "Recargos",
    `$${montoRecargo.toLocaleString("es-AR")}`,
    marginX + 7,
    188,
  );

  doc.setDrawColor(220, 224, 230);
  doc.line(marginX + 7, 200, pageWidth - marginX - 7, 200);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(217, 107, 74);
  doc.text(
    `Total: $${precioFinal.toLocaleString("es-AR")}`,
    pageWidth - marginX - 7,
    203,
    { align: "right" },
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text(
    "Documento generado automaticamente por TrackiFly.",
    pageWidth / 2,
    282,
    { align: "center" },
  );

  doc.save("reporte-trackifly.pdf");
};

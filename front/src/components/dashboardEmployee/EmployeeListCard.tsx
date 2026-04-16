'use client';

export default function EmployeeListCard() {
  // Datos de ejemplo - luego los reemplazarás con datos reales de tu API o estado
  const employees = [
    { id: 1, name: 'Juan Pérez García', email: 'juan.perez@trackifly.com', phone: '+51 987 654 321', country: 'Perú', status: 'Activo' },
    { id: 2, name: 'María López Sánchez', email: 'maria.lopez@trackifly.com', phone: '+51 912 345 678', country: 'Perú', status: 'Activo' },
    { id: 3, name: 'Carlos Ramírez Torres', email: 'carlos.ramirez@trackifly.com', phone: '+51 956 789 012', country: 'Chile', status: 'Inactivo' },
    // Agrega más según necesites
  ];

  return (
    <div className="rounded-3xl bg-surface border border-border p-8 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-foreground">Lista de Empleados</h2>
        <p className="text-sm text-muted">
          Total: <span className="font-semibold text-foreground">{employees.length} empleados</span>
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-4 px-4 font-medium text-muted">Nombre</th>
              <th className="text-left py-4 px-4 font-medium text-muted">Email</th>
              <th className="text-left py-4 px-4 font-medium text-muted">Teléfono</th>
              <th className="text-left py-4 px-4 font-medium text-muted">País</th>
              <th className="text-left py-4 px-4 font-medium text-muted">Estado</th>
              <th className="w-24"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {employees.map((employee) => (
              <tr key={employee.id} className="hover:bg-surface-muted/60 transition-colors">
                <td className="py-5 px-4 font-medium text-foreground">{employee.name}</td>
                <td className="py-5 px-4 text-muted">{employee.email}</td>
                <td className="py-5 px-4 text-muted">{employee.phone}</td>
                <td className="py-5 px-4 text-muted">{employee.country}</td>
                <td className="py-5 px-4">
                  <span className={`inline-block px-4 py-1 text-xs font-medium rounded-full ${employee.status === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{employee.status}</span>
                </td>
                <td className="py-5 px-4 text-right">
                  <button className="text-primary hover:text-primary-hover font-medium text-sm transition-colors">Ver</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

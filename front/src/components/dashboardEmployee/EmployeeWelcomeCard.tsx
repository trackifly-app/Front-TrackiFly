'use client';

import { EmployeeWelcomeCardProps } from "@/interfaces/shipment";



export default function EmployeeWelcomeCard({ employeeCount = 24 }: EmployeeWelcomeCardProps) {
  return (
    <div className="rounded-3xl bg-surface border border-border p-8 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div>
          <p className="text-sm text-primary font-medium">Dashboard de Empleado</p>
          <h1 className="text-4xl font-bold text-foreground mt-1">Bienvenido al Equipo</h1>
          <p className="mt-3 text-muted max-w-2xl">Aquí puedes registrar nuevos empleados, gestionar la lista actual del equipo y supervisar la información logística de la empresa.</p>
        </div>

        <div className="bg-surface-muted rounded-2xl px-7 py-5 text-center border border-border min-w-47.5">
          <p className="text-sm text-muted">Empleados registrados</p>
          <p className="text-5xl font-bold text-foreground mt-2">{employeeCount}</p>
        </div>
      </div>
    </div>
  );
}

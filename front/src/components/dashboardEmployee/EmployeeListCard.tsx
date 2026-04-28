'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Employee } from '@/types/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function EmployeeListCard() {
  const { userData, loading: authLoading } = useAuth();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);

  useEffect(() => {
    async function loadEmployees() {
      if (authLoading) return;

      try {
        setLoadingEmployees(true);

        const companyId = userData?.user?.id;

        if (!companyId) {
          setEmployees([]);
          return;
        }

        const response = await fetch(`${API_URL}/users?page=1&limit=100`, {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store',
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Error al obtener empleados');
        }

        const users: Employee[] = Array.isArray(data) ? data : Array.isArray(data.data) ? data.data : Array.isArray(data.users) ? data.users : [];

        console.log('Usuarios recibidos:', users);
        console.log('ID usuario empresa:', companyId);

        const companyEmployees = users.filter((user: Employee) => {
          const roleName = user.role?.name?.toLowerCase?.() || '';

          const isOperator = roleName === 'operator';

          const belongsToCompany = user.parentCompany?.id === companyId;

          return isOperator && belongsToCompany;
        });

        setEmployees(companyEmployees);
      } catch (error) {
        console.error('Error al cargar empleados:', error);
        setEmployees([]);
      } finally {
        setLoadingEmployees(false);
      }
    }

    loadEmployees();
  }, [userData, authLoading]);

  const loading = authLoading || loadingEmployees;

  return (
    <div className="rounded-3xl border border-border bg-surface p-8 shadow-sm">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Lista de Empleados</h2>

        <p className="text-sm text-muted">
          Total:{' '}
          <span className="font-semibold text-foreground">
            {employees.length} empleado{employees.length !== 1 ? 's' : ''}
          </span>
        </p>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-border bg-surface-muted p-6 text-sm text-muted">Cargando empleados...</div>
      ) : employees.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface-muted p-10 text-center text-sm text-muted">No hay empleados registrados para esta empresa.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-4 text-left font-medium text-muted">Nombre</th>
                <th className="px-4 py-4 text-left font-medium text-muted">Email</th>
                <th className="px-4 py-4 text-left font-medium text-muted">Teléfono</th>
                <th className="px-4 py-4 text-left font-medium text-muted">País</th>
                <th className="px-4 py-4 text-left font-medium text-muted">Estado</th>
                <th className="w-24" />
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {employees.map((employee) => {
                const firstName = employee.profile?.first_name || '';
                const lastName = employee.profile?.last_name || '';
                const fullName = `${firstName} ${lastName}`.trim() || 'Sin nombre';

                const isActive = employee.is_active === true;
                const statusLabel = isActive ? 'Activo' : 'Inactivo';

                return (
                  <tr key={employee.id} className="transition-colors hover:bg-surface-muted/60">
                    <td className="px-4 py-5 font-medium text-foreground">{fullName}</td>

                    <td className="px-4 py-5 text-muted">{employee.email || 'Sin email'}</td>

                    <td className="px-4 py-5 text-muted">{employee.profile?.phone || 'Sin teléfono'}</td>

                    <td className="px-4 py-5 text-muted">{employee.profile?.country || 'Sin país'}</td>

                    <td className="px-4 py-5">
                      <span className={`inline-block rounded-full px-4 py-1 text-xs font-medium ${isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{statusLabel}</span>
                    </td>

                    <td className="px-4 py-5 text-right">
                      <button className="text-sm font-medium text-primary transition-colors hover:text-primary-hover">Ver</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

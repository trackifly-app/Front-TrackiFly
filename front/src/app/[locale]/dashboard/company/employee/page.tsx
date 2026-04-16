import EmployeeListCard from '@/components/dashboardEmployee/EmployeeListCard';
import EmployeeRegisterCard from '@/components/dashboardEmployee/EmployeeRegisterCard';
import EmployeeWelcomeCard from '@/components/dashboardEmployee/EmployeeWelcomeCard';

export default function EmployeeDashboard() {
  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="mx-auto max-w-7xl space-y-8">
        <EmployeeWelcomeCard employeeCount={3} />
        <EmployeeRegisterCard />
        <EmployeeListCard />
      </div>
    </div>
  );
}

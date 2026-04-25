import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function BackToAdminDashboard() {
  return (
    <Link href="/dashboard/admin" className="inline-flex w-fit items-center gap-2 rounded-xl border border-border bg-surface-muted px-4 py-2.5 text-sm font-medium text-muted transition-all duration-300 hover:border-primary/40 hover:bg-primary/10 hover:text-primary">
      <ArrowLeft size={16} />
      Volver al dashboard
    </Link>
  );
}

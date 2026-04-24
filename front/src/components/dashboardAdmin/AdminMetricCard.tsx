import { LucideIcon } from 'lucide-react';

interface AdminMetricCardProps {
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
}

export default function AdminMetricCard({ title, value, description, icon: Icon }: AdminMetricCardProps) {
  return (
    <article className="rounded-2xl border border-border bg-surface-muted p-6 shadow-sm">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-surface text-primary">
        <Icon size={24} />
      </div>

      <p className="text-sm font-medium text-muted">{title}</p>

      <h2 className="mt-2 text-4xl font-bold text-foreground">{value}</h2>

      <p className="mt-2 text-sm text-muted">{description}</p>
    </article>
  );
}

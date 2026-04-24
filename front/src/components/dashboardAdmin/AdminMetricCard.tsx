import { LucideIcon } from 'lucide-react';

interface AdminMetricCardProps {
  title: string;
  value: number;
  description?: string;
  icon: LucideIcon;
  compact?: boolean;
}

export default function AdminMetricCard({
  title,
  value,
  description,
  icon: Icon,
  compact = false,
}: AdminMetricCardProps) {
  if (compact) {
    return (
      <article className="flex min-w-47.5 items-center gap-4 rounded-2xl border border-border bg-surface-muted px-5 py-4 shadow-sm">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface text-primary shadow-sm">
          <Icon size={22} />
        </div>

        <div>
          <p className="text-xs font-medium text-muted">
            {title}
          </p>

          <p className="mt-1 text-3xl font-bold leading-none text-foreground">
            {value}
          </p>
        </div>
      </article>
    );
  }

  return (
    <article className="rounded-2xl border border-border bg-surface-muted p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-primary/10">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-surface text-primary shadow-sm">
        <Icon size={24} />
      </div>

      <p className="text-sm font-medium text-muted">
        {title}
      </p>

      <h2 className="mt-2 text-4xl font-bold leading-none text-foreground">
        {value}
      </h2>

      {description && (
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {description}
        </p>
      )}
    </article>
  );
}
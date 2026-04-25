import { AdminMetricCardProps } from '@/interfaces/shipment';

export default function AdminMetricCard({ title, value, description, icon: Icon, compact = false }: AdminMetricCardProps) {
  if (compact) {
    return (
      <article className="w-full max-w-65 rounded-2xl border border-border bg-surface-muted px-5 py-4 shadow-sm">
        <div className="grid grid-cols-[56px_1fr] items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-surface text-primary shadow-sm">
            <Icon size={24} />
          </div>

          <div className="flex min-w-0 flex-col justify-center">
            <p className="text-sm font-semibold leading-none text-muted">{title}</p>

            <p className="mt-2 text-4xl font-bold leading-none text-foreground">{value}</p>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="rounded-2xl border border-border bg-surface-muted p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-primary/10">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-surface text-primary shadow-sm">
        <Icon size={24} />
      </div>

      <p className="text-sm font-medium text-muted">{title}</p>

      <h2 className="mt-2 text-4xl font-bold leading-none text-foreground">{value}</h2>

      {description && <p className="mt-3 text-sm leading-relaxed text-muted">{description}</p>}
    </article>
  );
}

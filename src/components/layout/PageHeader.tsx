import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-forest-dark md:text-3xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-stone-600">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-stone-300 bg-stone-50 py-12 px-4 text-center">
      <p className="font-medium text-forest-dark">{title}</p>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-stone-500">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  subtext,
  icon,
}: {
  label: string;
  value: string;
  subtext?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <p className="text-sm text-stone-500">{label}</p>
        {icon && <span className="text-forest">{icon}</span>}
      </div>
      <p className="mt-1 text-2xl font-semibold text-forest-dark">{value}</p>
      {subtext && <p className="mt-1 text-xs text-stone-500">{subtext}</p>}
    </div>
  );
}

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "h-8 w-8 animate-spin rounded-full border-4 border-forest/20 border-t-forest",
        className
      )}
      role="status"
      aria-label="Loading"
    />
  );
}

import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
  padding = true,
}: {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-stone-200 bg-white shadow-sm",
        padding && "p-4 md:p-6",
        className
      )}
    >
      {children}
    </div>
  );
}

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  className?: string;
}) {
  const variants = {
    default: "bg-stone-100 text-stone-700",
    success: "bg-green-100 text-green-800",
    warning: "bg-amber-100 text-amber-800",
    danger: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded-lg bg-stone-200", className)}
      aria-hidden
    />
  );
}

export function Alert({
  children,
  variant = "info",
}: {
  children: React.ReactNode;
  variant?: "info" | "warning" | "error" | "success";
}) {
  const variants = {
    info: "border-blue-200 bg-blue-50 text-blue-900",
    warning: "border-amber-200 bg-amber-50 text-amber-900",
    error: "border-red-200 bg-red-50 text-red-900",
    success: "border-green-200 bg-green-50 text-green-900",
  };
  return (
    <div className={cn("rounded-lg border p-4 text-sm", variants[variant])}>
      {children}
    </div>
  );
}

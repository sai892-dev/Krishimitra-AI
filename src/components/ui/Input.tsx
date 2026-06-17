import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & { error?: string }
>(({ className, error, ...props }, ref) => (
  <div className="w-full">
    <input
      ref={ref}
      className={cn(
        "w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-forest-dark placeholder:text-stone-400 focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20",
        error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
        className
      )}
      {...props}
    />
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
));
Input.displayName = "Input";

export const Label = ({
  children,
  htmlFor,
  required,
}: {
  children: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
}) => (
  <label
    htmlFor={htmlFor}
    className="mb-1 block text-sm font-medium text-forest-dark"
  >
    {children}
    {required && <span className="text-red-500"> *</span>}
  </label>
);

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string }
>(({ className, error, ...props }, ref) => (
  <div className="w-full">
    <textarea
      ref={ref}
      className={cn(
        "w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-forest-dark placeholder:text-stone-400 focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20 min-h-[100px]",
        error && "border-red-500",
        className
      )}
      {...props}
    />
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
));
Textarea.displayName = "Textarea";

export const Select = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & { error?: string }
>(({ className, error, children, ...props }, ref) => (
  <div className="w-full">
    <select
      ref={ref}
      className={cn(
        "w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-forest-dark focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20",
        error && "border-red-500",
        className
      )}
      {...props}
    >
      {children}
    </select>
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
));
Select.displayName = "Select";

import React from "react";

function cx(...values: Array<string | undefined | false | null>) {
  return values.filter(Boolean).join(" ");
}

// Design tokens
export const tokens = {
  color: {
    brand: "#2F919C",
    brandStrong: "#1F7074",
    surface: "#FFFFFF",
    surfaceMuted: "#DCE8E9",
    border: "#E5E7EB",
    text: "#111827",
    textMuted: "#4B5563",
    danger: "#EF4444",
    warning: "#F59E0B",
    success: "#10B981",
  },
  radius: {
    sm: "0.5rem",
    md: "0.75rem",
    lg: "1.25rem",
    xl: "1.75rem",
  },
  shadow: {
    card: "0 8px 24px rgba(0,0,0,0.08)",
  },
  spacing: {
    sm: "0.5rem",
    md: "0.75rem",
    lg: "1rem",
    xl: "1.5rem",
    xxl: "2rem",
  },
  font: {
    heading: "Inter, system-ui, -apple-system, sans-serif",
    body: "Inter, system-ui, -apple-system, sans-serif",
  },
};

type BoxProps = React.HTMLAttributes<HTMLDivElement>;

export function PageShell({ className, ...props }: BoxProps) {
  return (
    <div
      className={cx(
        "min-h-screen bg-surface-muted text-slate-900",
        "flex flex-col items-stretch",
        className
      )}
      {...props}
    />
  );
}

export function Card({
  title,
  action,
  className,
  children,
  padding = "md",
}: {
  title?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
  padding?: "sm" | "md" | "lg";
}) {
  const paddingClass =
    padding === "sm"
      ? "p-4"
      : padding === "lg"
        ? "p-8"
        : "p-6";

  return (
    <div
      className={cx(
        "bg-white rounded-2xl border border-slate-200 shadow-sm",
        paddingClass,
        className
      )}
      style={{ boxShadow: tokens.shadow.card }}
    >
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-4">
          {title && <h2 className="text-xl font-semibold text-slate-900">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

export function SectionHeading({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        {description && (
          <p className="text-sm text-slate-600 mt-1">{description}</p>
        )}
      </div>
      {actions}
    </div>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "back";
  size?: "sm" | "md" | "lg";
}) {
  const base =
    "inline-flex items-center justify-center font-semibold rounded-xl transition focus:outline-none focus:ring-2 focus:ring-offset-2";
  const sizeClass =
    size === "sm"
      ? "px-3 py-1.5 text-sm"
      : size === "lg"
        ? "px-5 py-3 text-base"
        : "px-4 py-2 text-sm";

  const variantClass = {
    primary:
      "bg-brand text-white hover:bg-brand-strong focus:ring-brand-strong",
    secondary:
      "bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 focus:ring-brand",
    ghost:
      "text-slate-800 hover:bg-slate-100 focus:ring-brand",
    danger:
      "bg-danger text-white hover:bg-red-600 focus:ring-red-600",
    back:
      "bg-gray-500 text-white hover:bg-gray-600 focus:ring-brand"
  }[variant];

  return (
    <button
      className={cx(base, sizeClass, variantClass, className)}
      {...props}
    >
      {children}
    </button>
  );
}

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function Input({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cx(
        "w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900",
        "placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/40 focus:outline-none",
        className
      )}
      {...props}
    />
  );
});

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(function Select({ className, children, ...props }, ref) {
  return (
    <select
      ref={ref}
      className={cx(
        "w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900",
        "focus:border-brand focus:ring-2 focus:ring-brand/40 focus:outline-none",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
});

export function FormField({
  label,
  children,
  message,
}: {
  label: string;
  children: React.ReactNode;
  message?: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-base font-semibold text-slate-800">
        {label}
      </span>

      <div className="mt-1">{children}</div>

      {message && (
        <p className="text-sm text-red-600 leading-relaxed">
          {message}
        </p>
      )}
    </label>
  );
}


export function Badge({
  children,
  color = "brand",
}: {
  children: React.ReactNode;
  color?: "brand" | "success" | "warning" | "danger" | "neutral";
}) {
  const colors: Record<string, string> = {
    brand: "bg-brand/10 text-brand",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-red-100 text-red-700",
    neutral: "bg-slate-100 text-slate-700",
  };
  return (
    <span className={cx("px-3 py-1 rounded-full text-xs font-semibold", colors[color])}>
      {children}
    </span>
  );
}

export function Table({
  headers,
  children,
}: {
  headers: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm fade-in">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">{children}</tbody>
      </table>
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
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-10 text-center">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      {description && <p className="text-sm text-slate-600 max-w-md">{description}</p>}
      {action}
    </div>
  );
}

export function InfoList({
  items,
}: {
  items: { label: string; value: React.ReactNode }[];
}) {
  return (
    <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm"
        >
          <dt className="text-sm font-medium tracking-wide text-slate-500">
            {item.label}
          </dt>

          <dd className="mt-2 text-lg font-semibold text-slate-900">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}


export function InlineLink({
  children,
  className,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={cx(
        "text-brand hover:text-brand-strong font-semibold underline underline-offset-2",
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
}

export function Modal({
  isOpen,
  onClose,
  children,
  className,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={cx(
          "bg-white rounded-lg p-5 shadow-lg max-w-sm w-full mx-4",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export function ModalHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cx("pb-2.5", className)}>
      {children}
    </div>
  );
}

export function ModalTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2 className={cx("text-2xl font-semibold m-0", className)}>
      {children}
    </h2>
  );
}

export function ModalBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cx("py-5 px-0 border-t border-b border-slate-200", className)}>
      {children}
    </div>
  );
}

export function ModalFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cx("pt-2.5 flex gap-2.5 justify-end", className)}>
      {children}
    </div>
  );
}



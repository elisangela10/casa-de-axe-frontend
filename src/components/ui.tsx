import type { ButtonHTMLAttributes, ReactNode } from "react";

export function Button({ variant = "primary", className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "danger" }) {
  const variants = {
    primary: "bg-amber-700 text-white hover:bg-amber-800",
    secondary: "border border-gray-300 text-gray-700 hover:bg-gray-50",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };
  return <button {...props} className={`rounded-lg px-4 py-2 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`} />;
}

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h1 className="text-2xl font-bold text-gray-900">{title}</h1>{description && <p className="mt-1 text-sm text-gray-600">{description}</p>}</div>{action}</div>;
}

export function LoadingState({ label = "Carregando..." }: { label?: string }) {
  return <div className="py-16 text-center text-gray-500" role="status"><i className="bi-arrow-repeat mr-2 animate-spin" />{label}</div>;
}

export function EmptyState({ icon = "bi-inbox", title, description, action }: { icon?: string; title: string; description?: string; action?: ReactNode }) {
  return <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center"><i className={`${icon} mb-3 block text-5xl text-gray-300`} /><h2 className="font-semibold text-gray-800">{title}</h2>{description && <p className="mt-1 text-sm text-gray-500">{description}</p>}{action && <div className="mt-5">{action}</div>}</div>;
}

export function Modal({ title, children, footer, onClose }: { title: string; children: ReactNode; footer?: ReactNode; onClose: () => void }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="shared-modal-title"><div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl"><div className="flex items-center justify-between border-b border-gray-200 p-5"><h2 id="shared-modal-title" className="font-bold text-gray-900">{title}</h2><button type="button" onClick={onClose} aria-label="Fechar" className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"><i className="bi-x-lg" /></button></div><div className="p-5">{children}</div>{footer && <div className="border-t border-gray-200 p-5">{footer}</div>}</div></div>;
}

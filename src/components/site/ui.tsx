import type { ReactNode } from "react";
import { intlPhone, phoneParts } from "@/lib/phones";

export function Crumbs({ items }: { items: { href: string; label: string }[] }) {
  return (
    <nav aria-label="breadcrumb" className="mb-4 text-sm text-muted">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => (
          <li key={item.href} className="inline-flex items-center gap-2">
            {index > 0 ? <span aria-hidden>/</span> : null}
            {index === items.length - 1 ? <span className="text-ink">{item.label}</span> : <a href={item.href} className="hover:text-primary">{item.label}</a>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageIntro({
  kicker,
  title,
  body,
  crumbs,
}: {
  kicker: string;
  title: string;
  body?: string;
  crumbs?: { href: string; label: string }[];
}) {
  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-12">
        {crumbs?.length ? <Crumbs items={crumbs} /> : null}
        <p className="text-sm text-gold">{kicker}</p>
        <h1 className="mt-2 font-display text-4xl text-ink md:text-5xl">{title}</h1>
        {body ? <p className="mt-4 max-w-2xl text-muted">{body}</p> : null}
      </div>
    </header>
  );
}

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`soft-card p-5 ${className}`}>{children}</section>;
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="text-muted">{label}</span>
      {children}
    </label>
  );
}

export const inputClass =
  "min-h-11 w-full rounded-xl border border-line bg-paper px-3 text-ink outline-none transition-colors duration-150 focus:border-primary focus:bg-surface";

export function PrimaryButton({
  children,
  type = "button",
  disabled,
  onClick,
}: {
  children: ReactNode;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm text-surface shadow-soft transition-colors duration-150 hover:bg-primary-mid active:scale-[0.96] disabled:cursor-wait disabled:opacity-60"
    >
      {children}
    </button>
  );
}

export function DemoMark({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex rounded-full border border-gold bg-gold-soft/40 px-2 py-0.5 text-xs text-primary-deep">
      {children}
    </span>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-paper px-4 py-8 text-center">
      <p className="font-medium">{title}</p>
      <p className="mt-2 text-sm text-muted">{body}</p>
    </div>
  );
}

export function ErrorNote({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="rounded-xl border border-down/40 bg-down/10 px-3 py-2 text-sm text-down">
      {children}
    </p>
  );
}

export function PhoneLines({ value }: { value: string }) {
  const parts = phoneParts(value);
  if (!parts.length) return null;
  return (
    <ul className="grid gap-1">
      {parts.map((part) => (
        <li key={part}>
          <a href={`tel:${intlPhone(part)}`} className="tabular-nums text-primary underline-offset-4 hover:underline">
            {intlPhone(part)}
          </a>
        </li>
      ))}
    </ul>
  );
}

import React, { useId } from "react";
import { Search } from "lucide-react";

// Label, hint and error wrapper shared by every input type.
function Field({ id, label, hint, error, required, children, className = "" }) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
          {label}{required && <span className="text-clay-600"> *</span>}
        </label>
      )}
      {children}
      {error ? <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-clay-600">{error}</p>
        : hint ? <p className="mt-1.5 text-xs text-muted">{hint}</p> : null}
    </div>
  );
}

const describe = (id, error) => ({ id, "aria-invalid": Boolean(error), "aria-describedby": error ? `${id}-error` : undefined });

export function Input({ label, hint, error, className, required, ...props }) {
  const id = useId();
  return (
    <Field id={id} label={label} hint={hint} error={error} required={required} className={className}>
      <input className={`input ${error ? "input-error" : ""}`} required={required} {...describe(id, error)} {...props} />
    </Field>
  );
}

// options: [{ value, label }]
export function Select({ label, hint, error, className, required, options = [], placeholder, ...props }) {
  const id = useId();
  return (
    <Field id={id} label={label} hint={hint} error={error} required={required} className={className}>
      <select className={`input ${error ? "input-error" : ""}`} required={required} {...describe(id, error)} {...props}>
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map(({ value, label: text }) => <option key={value} value={value}>{text}</option>)}
      </select>
    </Field>
  );
}

export function Checkbox({ label, hint, checked, onChange, name, required }) {
  const id = useId();
  return (
    <label htmlFor={id} className="flex items-start gap-3 text-sm">
      <input id={id} name={name} type="checkbox" required={required} checked={Boolean(checked)} onChange={onChange} className="mt-0.5 size-4 rounded accent-forest-700" />
      <span><span className="font-medium">{label}</span>{hint && <span className="block text-xs text-muted">{hint}</span>}</span>
    </label>
  );
}

export function SearchInput({ value, onChange, placeholder = "Search", className = "" }) {
  return (
    <div className={`relative ${className}`}>
      <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" />
      <input type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-label={placeholder} className="input pl-10" />
    </div>
  );
}

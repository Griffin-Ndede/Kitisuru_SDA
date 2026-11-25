import React, { useState, useId } from "react";
import { downloadImportTemplate, importMembers } from "../../Api";
import { errorMessage } from "../../Api/client";
import { Download, FileCheck, LoaderCircle, CircleAlert } from "lucide-react";
import { useToast } from "../../Context/ToastContext";
import { Link } from "react-router";

// Add many members from a CSV or Excel file. The file is checked first and
// nothing is saved until the admin has read the result and confirmed.
export default function ImportDialog({ onClose, onDone }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [added, setAdded] = useState(null);
  const toast = useToast();
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const choose = (e) => {
    setFile(e.target.files[0] || null);
    setPreview(null);
    setAdded(null);
    setError("");
  };

  const run = async (options) => {
    setError("");
    setBusy(true);
    try {
      return await importMembers(file, options);
    } catch (err) {
      setError(errorMessage(err));
      return null;
    } finally {
      setBusy(false);
    }
  };

  const check = async () => setPreview(await run({ dryRun: true }));

  const save = async () => {
    const result = await run({ dryRun: false, confirmPermission: true });
    if (result) {
      setAdded(result);
      toast.success(`${result.count} members added`);
      setPreview(null);
      onDone();
    }
  };

  return (
    <div className="space-y-4 text-sm">
      <p className="text-muted">
        Upload a <strong className="text-ink">.csv</strong> or <strong className="text-ink">.xlsx</strong> file with one member per row. A file with just a
        <em> Name</em> column works too. People already in the register are skipped, never doubled.
      </p>
      <Button variant="ghost" size="sm" icon={Download} onClick={() => downloadImportTemplate().catch((e) => setError(errorMessage(e)))}>
        Download the template with the column names
      </Button>

      <input type="file" accept=".csv,.xlsx,.txt" onChange={choose} aria-label="Member file"
        className="block w-full rounded-xl border border-dashed border-line bg-paper p-4 file:mr-4 file:rounded-full file:border-0 file:bg-forest-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-paper" />

      {file && !preview && !added && (
        <Button onClick={check} loading={busy} icon={FileCheck}>Check the file</Button>
      )}

      <FormError>{error}</FormError>

      {preview && (
        <div className="space-y-3 rounded-xl border border-line bg-paper p-4" aria-live="polite">
          <p>
            <strong>{preview.count}</strong> of {preview.total} rows will be added
            {preview.names.length > 0 && <> (for example: {preview.names.join(", ")}{preview.count > preview.names.length ? "…" : ""})</>}.
          </p>
          {preview.skipped.length > 0 && (
            <details>
              <summary className="cursor-pointer">{preview.skipped.length} skipped (already in the register)</summary>
              <ul className="mt-2 max-h-40 list-disc overflow-y-auto pl-5">
                {preview.skipped.slice(0, 50).map((s) => <li key={s.row}>Row {s.row}, {s.name}: {s.reason}</li>)}
              </ul>
            </details>
          )}
          {preview.errors.length > 0 && (
            <details open>
              <summary className="cursor-pointer text-clay-700">{preview.errors.length} rows have a problem and will not be added</summary>
              <ul className="mt-2 max-h-40 list-disc overflow-y-auto pl-5 text-clay-700">
                {preview.errors.slice(0, 50).map((x) => <li key={x.row}>Row {x.row}: {x.message}</li>)}
              </ul>
              <p className="mt-2 text-muted">Fix these in your file and check it again, or import the rest now.</p>
            </details>
          )}
          {preview.count > 0 && (
            <>
              <Checkbox
                checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)}
                label="I confirm the church has these members' permission to keep their details."
                hint={<a href="/privacy" target="_blank" rel="noreferrer" className="text-forest-700 underline">Privacy notice</a>}
              />
              <Button onClick={save} disabled={!confirmed} loading={busy}>Import {preview.count} members</Button>
            </>
          )}
        </div>
      )}

      {added && (
        <p role="status" className="font-semibold text-forest-700">
          {added.count} members added. They can claim their record by signing up with the same email.
        </p>
      )}

      <div className="text-right"><Button variant="secondary" onClick={onClose}>Close</Button></div>
    </div>
  );
}

// ---- Small UI pieces used only on this page ----

const VARIANTS = {
  primary: "bg-forest-900 text-paper hover:bg-forest-800 shadow-card",
  accent: "bg-marigold-500 text-forest-950 hover:bg-marigold-400 shadow-card",
  secondary: "border border-line bg-white text-ink hover:border-forest-600 hover:text-forest-800",
  ghost: "text-forest-800 hover:bg-forest-50",
  danger: "bg-clay-600 text-white hover:bg-clay-700",
};

const SIZES = { sm: "px-3 py-1.5 text-sm", md: "px-4 py-2.5 text-sm", lg: "px-6 py-3.5 text-base" };

// Renders a <button>, a router <Link> (`to`) or an <a> (`href`) with one look.
function Button({ variant = "primary", size = "md", to, href, loading, icon: Icon, className = "", children, ...props }) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full font-semibold transition
    active:translate-y-px disabled:opacity-60 ${VARIANTS[variant]} ${SIZES[size]} ${className}`;
  const content = (
    <>
      {loading ? <LoaderCircle className="size-4 animate-spin" /> : Icon ? <Icon className="size-4" /> : null}
      {children}
    </>
  );
  if (to) return <Link to={to} className={classes} {...props}>{content}</Link>;
  if (href) return <a href={href} className={classes} {...props}>{content}</a>;
  return <button type="button" className={classes} disabled={loading || props.disabled} {...props}>{content}</button>;
}

function Checkbox({ label, hint, checked, onChange, name, required }) {
  const id = useId();
  return (
    <label htmlFor={id} className="flex items-start gap-3 text-sm">
      <input id={id} name={name} type="checkbox" required={required} checked={Boolean(checked)} onChange={onChange} className="mt-0.5 size-4 rounded accent-forest-700" />
      <span><span className="font-medium">{label}</span>{hint && <span className="block text-xs text-muted">{hint}</span>}</span>
    </label>
  );
}

// A banner for an error next to a form.
function FormError({ children }) {
  if (!children) return null;
  return (
    <p role="alert" className="flex items-start gap-2 rounded-xl bg-clay-100 px-3.5 py-2.5 text-sm text-clay-700">
      <CircleAlert className="mt-0.5 size-4 shrink-0" />{children}
    </p>
  );
}

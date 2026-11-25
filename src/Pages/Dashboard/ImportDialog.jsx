import React, { useState } from "react";
import { downloadImportTemplate, importMembers } from "../../Api";
import { errorMessage } from "../../Api/client";
import { Download, FileCheck, LoaderCircle, CircleAlert } from "lucide-react";
import { useToast } from "../../Context/ToastContext";

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
        Upload a <strong className="text-ink">.csv</strong> or <strong className="text-ink">.xlsx</strong> file with one
        member per row. A file with just a<em> Name</em> column works too. People already in the register are skipped,
        never doubled.
      </p>
      <button
        type="button"
        className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition active:translate-y-px disabled:opacity-60 text-forest-800 hover:bg-forest-50 px-3 py-1.5 text-sm"
        onClick={() => downloadImportTemplate().catch((e) => setError(errorMessage(e)))}
      >
        <Download className="size-4" />
        Download the template with the column names
      </button>

      <input
        type="file"
        accept=".csv,.xlsx,.txt"
        onChange={choose}
        aria-label="Member file"
        className="block w-full rounded-3xl border border-dashed border-line bg-paper p-4 file:mr-4 file:rounded-full file:border-0 file:bg-forest-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-paper"
      />

      {file && !preview && !added && (
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition active:translate-y-px disabled:opacity-60 bg-forest-900 text-paper hover:bg-forest-800 shadow-card px-4 py-2.5 text-sm"
          disabled={busy}
          onClick={check}
        >
          {busy ? <LoaderCircle className="size-4 animate-spin" /> : <FileCheck className="size-4" />}
          Check the file
        </button>
      )}

      {error && (
        <p role="alert" className="flex items-start gap-2 rounded-3xl bg-clay-100 px-3.5 py-2.5 text-sm text-clay-700">
          <CircleAlert className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      )}

      {preview && (
        <div className="space-y-3 rounded-3xl border border-line bg-paper p-4" aria-live="polite">
          <p>
            <strong>{preview.count}</strong> of {preview.total} rows will be added
            {preview.names.length > 0 && (
              <>
                {" "}
                (for example: {preview.names.join(", ")}
                {preview.count > preview.names.length ? "…" : ""})
              </>
            )}
            .
          </p>
          {preview.skipped.length > 0 && (
            <details>
              <summary className="cursor-pointer">{preview.skipped.length} skipped (already in the register)</summary>
              <ul className="mt-2 max-h-40 list-disc overflow-y-auto pl-5">
                {preview.skipped.slice(0, 50).map((s) => (
                  <li key={s.row}>
                    Row {s.row}, {s.name}: {s.reason}
                  </li>
                ))}
              </ul>
            </details>
          )}
          {preview.errors.length > 0 && (
            <details open>
              <summary className="cursor-pointer text-clay-700">
                {preview.errors.length} rows have a problem and will not be added
              </summary>
              <ul className="mt-2 max-h-40 list-disc overflow-y-auto pl-5 text-clay-700">
                {preview.errors.slice(0, 50).map((x) => (
                  <li key={x.row}>
                    Row {x.row}: {x.message}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-muted">Fix these in your file and check it again, or import the rest now.</p>
            </details>
          )}
          {preview.count > 0 && (
            <>
              <label className="flex items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={Boolean(confirmed)}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="mt-0.5 size-4 rounded accent-forest-700"
                />
                <span>
                  <span className="font-medium">
                    {"I confirm the church has these members' permission to keep their details."}
                  </span>
                  <span className="block text-xs text-muted">
                    {
                      <a href="/privacy" target="_blank" rel="noreferrer" className="text-forest-700 underline">
                        Privacy notice
                      </a>
                    }
                  </span>
                </span>
              </label>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition active:translate-y-px disabled:opacity-60 bg-forest-900 text-paper hover:bg-forest-800 shadow-card px-4 py-2.5 text-sm"
                disabled={busy || !confirmed}
                onClick={save}
              >
                {busy && <LoaderCircle className="size-4 animate-spin" />}
                Import {preview.count} members
              </button>
            </>
          )}
        </div>
      )}

      {added && (
        <p role="status" className="font-semibold text-forest-700">
          {added.count} members added. They can claim their record by signing up with the same email.
        </p>
      )}

      <div className="text-right">
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition active:translate-y-px disabled:opacity-60 border border-line bg-white text-ink hover:border-forest-600 hover:text-forest-800 px-4 py-2.5 text-sm"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}

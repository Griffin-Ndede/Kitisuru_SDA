import React, { useState } from "react";
import { downloadImportTemplate, importMembers } from "../../Api";
import { errorMessage } from "../../Api/client";

// Add many members from a CSV or Excel file. The file is checked first and
// nothing is saved until the admin has read the result and confirmed.
export default function ImportDialog({ onClose, onDone }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [added, setAdded] = useState(null);
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
      setPreview(null);
      onDone();
    }
  };

  return (
    <div className="space-y-4 text-sm">
      <p className="text-gray-600">
        Upload a <strong>.csv</strong> or <strong>.xlsx</strong> file with one member per row. A file with just a
        <em> Name</em> column works too. People already in the register are skipped, never doubled.
      </p>
      <button type="button" onClick={() => downloadImportTemplate().catch((e) => setError(errorMessage(e)))}
        className="text-custom-blue underline cursor-pointer">
        Download the template with the column names
      </button>

      <input type="file" accept=".csv,.xlsx,.txt" onChange={choose} aria-label="Member file" className="block w-full" />

      {file && !preview && !added && (
        <button type="button" onClick={check} disabled={busy}
          className="px-5 py-2 rounded-full bg-custom-blue text-white cursor-pointer disabled:opacity-60">
          {busy ? "Checking…" : "Check the file"}
        </button>
      )}

      {error && <p role="alert" className="text-red-600">{error}</p>}

      {preview && (
        <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 space-y-3" aria-live="polite">
          <p>
            <strong>{preview.count}</strong> of {preview.total} rows will be added
            {preview.names.length > 0 && <> (for example: {preview.names.join(", ")}{preview.count > preview.names.length ? "…" : ""})</>}.
          </p>
          {preview.skipped.length > 0 && (
            <details>
              <summary className="cursor-pointer">{preview.skipped.length} skipped (already in the register)</summary>
              <ul className="list-disc pl-5 mt-2 max-h-40 overflow-y-auto">
                {preview.skipped.slice(0, 50).map((s) => <li key={s.row}>Row {s.row}, {s.name}: {s.reason}</li>)}
              </ul>
            </details>
          )}
          {preview.errors.length > 0 && (
            <details open>
              <summary className="cursor-pointer text-red-700">{preview.errors.length} rows have a problem and will not be added</summary>
              <ul className="list-disc pl-5 mt-2 max-h-40 overflow-y-auto text-red-700">
                {preview.errors.slice(0, 50).map((x) => <li key={x.row}>Row {x.row}: {x.message}</li>)}
              </ul>
              <p className="text-gray-600 mt-2">Fix these in your file and check it again, or import the rest now.</p>
            </details>
          )}
          {preview.count > 0 && (
            <>
              <label className="flex items-start gap-2">
                <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="mt-1" />
                <span>
                  I confirm the church has these members&apos; permission to keep their details.{" "}
                  <a href="/privacy" target="_blank" rel="noreferrer" className="text-custom-blue underline">Privacy notice</a>
                </span>
              </label>
              <button type="button" onClick={save} disabled={!confirmed || busy}
                className="px-5 py-2 rounded-full bg-custom-blue text-white cursor-pointer disabled:opacity-50">
                {busy ? "Importing…" : `Import ${preview.count} members`}
              </button>
            </>
          )}
        </div>
      )}

      {added && (
        <p role="status" className="text-green-700 font-semibold">
          {added.count} members added. They can claim their record by signing up with the same email.
        </p>
      )}

      <div className="text-right">
        <button type="button" onClick={onClose} className="px-5 py-2 rounded-full border border-gray-300 cursor-pointer">Close</button>
      </div>
    </div>
  );
}

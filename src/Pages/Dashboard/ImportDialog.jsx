import React, { useState } from "react";
import { downloadImportTemplate, importMembers } from "../../Api";
import { errorMessage } from "../../Api/client";
import { Download, FileCheck } from "lucide-react";
import Button from "../../Components/ui/Button";
import { Checkbox } from "../../Components/ui/Fields";
import { FormError } from "../../Components/ui/States";
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

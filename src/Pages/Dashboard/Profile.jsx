import React, { useState } from "react";
import { useNavigate } from "react-router";
import { deleteMyAccount, downloadMyData, updateMe } from "../../Api";
import { errorMessage } from "../../Api/client";
import { useUser } from "../../Context/UserContext";
import { Download, Save, Trash2, LoaderCircle, CircleAlert } from "lucide-react";
import { useToast } from "../../Context/ToastContext";

// Members add and correct their own details here. The email is their sign-in
// name, so it is shown but not editable.
export default function Profile() {
  const { user, refreshUser, signOut } = useUser();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: user.first_name,
    last_name: user.last_name,
    phone: user.phone || "",
    gender: user.gender || "",
    date_of_birth: user.date_of_birth || "",
    address: user.address || "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await updateMe({ ...form, date_of_birth: form.date_of_birth || null });
      toast.success("Your details are saved");
      await refreshUser(); // the menu, overview and every other page now show the new details
    } catch (err) {
      setError(errorMessage(err));
    }
    setBusy(false);
  };

  const handleDownload = async () => {
    setError("");
    try {
      await downloadMyData();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    setDeleteError("");
    try {
      await deleteMyAccount(confirmEmail);
      await signOut();
      navigate("/");
    } catch (err) {
      setDeleteError(errorMessage(err));
    }
  };

  return (
    <div>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold sm:text-4xl">My profile</h1>
          <p className="mt-1.5 max-w-2xl text-muted">
            Keep your details up to date so the church office can reach you. Only you and the church admins can see
            them.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {
            <a
              href="/privacy"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-forest-700 underline"
            >
              How we use your details
            </a>
          }
        </div>
      </header>

      <form
        className="rounded-card border border-line bg-white shadow-card p-5 sm:p-6 grid gap-4 sm:grid-cols-2"
        onSubmit={handleSave}
      >
        <div>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">
              First name <span className="text-clay-600">*</span>
            </span>
            <input className="input" required name="first_name" value={form.first_name} onChange={change} />
          </label>
        </div>
        <div>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">
              Last name <span className="text-clay-600">*</span>
            </span>
            <input className="input" required name="last_name" value={form.last_name} onChange={change} />
          </label>
        </div>
        <div>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Email (your sign-in name)</span>
            <input className="input" value={user.email || "—"} readOnly disabled />
          </label>
        </div>
        <div>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Phone number</span>
            <input className="input" type="tel" name="phone" value={form.phone} onChange={change} />
          </label>
        </div>
        <div>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Gender</span>
            <select className="input" name="gender" value={form.gender} onChange={change}>
              <option value="">Choose…</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </label>
        </div>
        <div>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Date of birth</span>
            <input
              className="input"
              type="date"
              name="date_of_birth"
              value={form.date_of_birth}
              onChange={change}
              max={new Date().toISOString().slice(0, 10)}
            />
          </label>
        </div>
        <div className="sm:col-span-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Address</span>
            <input className="input" name="address" value={form.address} onChange={change} />
          </label>
          <p className="mt-1.5 text-xs text-muted">The estate or area where you live</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition active:translate-y-px disabled:opacity-60 bg-forest-900 text-paper hover:bg-forest-800 shadow-card px-4 py-2.5 text-sm"
            disabled={busy}
          >
            {busy ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />}
            Save my details
          </button>
          {error && (
            <p
              role="alert"
              className="flex items-start gap-2 rounded-xl bg-clay-100 px-3.5 py-2.5 text-sm text-clay-700"
            >
              <CircleAlert className="mt-0.5 size-4 shrink-0" />
              {error}
            </p>
          )}
        </div>
      </form>

      {(user.clusters.length > 0 || user.ministries.length > 0) && (
        <div className="rounded-card border border-line bg-white shadow-card p-5 sm:p-6 mt-6">
          <h2 className="text-xl font-semibold">Your groups and ministries</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {user.ministries.map((m) => (
              <span
                className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-marigold-100 text-marigold-600"
                key={`m${m.id}`}
              >
                {m.title}
              </span>
            ))}
            {user.clusters.map((c) => (
              <span
                className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-forest-100 text-forest-800"
                key={`c${c.id}`}
              >
                {c.name}
              </span>
            ))}
          </div>
          <p className="mt-3 text-sm text-muted">The church office adds you to groups and ministries.</p>
        </div>
      )}

      <div className="rounded-card border border-line bg-white shadow-card p-5 sm:p-6 mt-6">
        <h2 className="text-xl font-semibold">Your data</h2>
        <p className="mt-1 mb-4 text-sm text-muted">
          You can keep a copy of everything the church holds about you, or have it removed.
        </p>
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition active:translate-y-px disabled:opacity-60 border border-line bg-white text-ink hover:border-forest-600 hover:text-forest-800 px-4 py-2.5 text-sm"
          onClick={handleDownload}
        >
          <Download className="size-4" />
          Download my details
        </button>

        <form onSubmit={handleDelete} className="mt-6 border-t border-line pt-5">
          <h3 className="text-lg font-semibold text-clay-700">Delete my account</h3>
          <p className="mt-1 mb-3 text-sm text-muted">
            This removes your account and details from the church dashboard. It cannot be undone. Type your email
            address ({user.email || user.first_name}) to confirm.
          </p>
          <div className="flex flex-wrap items-end gap-3">
            <input
              className="input min-w-60 flex-1"
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              placeholder="Your email address"
              aria-label="Type your email to confirm"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-full font-semibold transition active:translate-y-px disabled:opacity-60 bg-clay-600 text-white hover:bg-clay-700 px-4 py-2.5 text-sm"
              disabled={!confirmEmail}
            >
              <Trash2 className="size-4" />
              Delete my account
            </button>
          </div>
          {deleteError && (
            <div className="mt-3">
              {deleteError && (
                <p
                  role="alert"
                  className="flex items-start gap-2 rounded-xl bg-clay-100 px-3.5 py-2.5 text-sm text-clay-700"
                >
                  <CircleAlert className="mt-0.5 size-4 shrink-0" />
                  {deleteError}
                </p>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

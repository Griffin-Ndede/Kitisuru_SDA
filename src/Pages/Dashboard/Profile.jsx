import React, { useState } from "react";
import { useNavigate, useRevalidator, useRouteLoaderData } from "react-router";
import { deleteMyAccount, downloadMyData, updateMe } from "../../Api";
import { clearSession, errorMessage } from "../../Api/client";
import { inputClass } from "../../Components/AuthCard";
import { googleSignOut } from "../../firebase";

// Members add and correct their own details here. The email is their sign-in
// name, so it is shown but not editable.
export default function Profile() {
  const { user } = useRouteLoaderData("dashboard");
  const revalidator = useRevalidator();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: user.first_name,
    last_name: user.last_name,
    phone: user.phone || "",
    gender: user.gender || "",
    date_of_birth: user.date_of_birth || "",
    address: user.address || "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setBusy(true);
    try {
      await updateMe({ ...form, date_of_birth: form.date_of_birth || null });
      setMessage("Your details are saved.");
      revalidator.revalidate();
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
      clearSession();
      await googleSignOut();
      navigate("/");
    } catch (err) {
      setDeleteError(errorMessage(err));
    }
  };

  const label = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-custom-blue mb-2">My profile</h1>
      <p className="text-gray-600 mb-6">
        Keep your details up to date so the church office can reach you. Only you and the church admins can see them.{" "}
        <a href="/privacy" target="_blank" rel="noreferrer" className="text-custom-blue underline">How we use your details</a>
      </p>

      <form onSubmit={handleSave} className="rounded-2xl bg-white border border-gray-200 p-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="first_name">First name</label>
          <input id="first_name" className={inputClass} name="first_name" value={form.first_name} onChange={change} required />
        </div>
        <div>
          <label className={label} htmlFor="last_name">Last name</label>
          <input id="last_name" className={inputClass} name="last_name" value={form.last_name} onChange={change} required />
        </div>
        <div>
          <label className={label} htmlFor="email">Email (your sign-in name)</label>
          <input id="email" className={`${inputClass} bg-gray-100`} value={user.email || "—"} readOnly />
        </div>
        <div>
          <label className={label} htmlFor="phone">Phone number</label>
          <input id="phone" className={inputClass} type="tel" name="phone" value={form.phone} onChange={change} placeholder="0712 345 678" />
        </div>
        <div>
          <label className={label} htmlFor="gender">Gender</label>
          <select id="gender" className={inputClass} name="gender" value={form.gender} onChange={change}>
            <option value="">Choose…</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label className={label} htmlFor="date_of_birth">Date of birth</label>
          <input id="date_of_birth" className={inputClass} type="date" name="date_of_birth" value={form.date_of_birth}
            onChange={change} max={new Date().toISOString().slice(0, 10)} />
        </div>
        <div className="sm:col-span-2">
          <label className={label} htmlFor="address">Address (estate or area where you live)</label>
          <input id="address" className={inputClass} name="address" value={form.address} onChange={change} />
        </div>
        <div className="sm:col-span-2 flex flex-wrap items-center gap-4">
          <button type="submit" disabled={busy} className="px-6 py-3 rounded-full bg-custom-blue text-white font-semibold cursor-pointer disabled:opacity-60">
            {busy ? "Saving…" : "Save my details"}
          </button>
          {message && <span role="status" className="text-green-700 text-sm">{message}</span>}
          {error && <span role="alert" className="text-red-600 text-sm">{error}</span>}
        </div>
      </form>

      {user.clusters.length > 0 && (
        <section className="mt-6 rounded-2xl bg-white border border-gray-200 p-6">
          <h2 className="font-bold text-lg mb-2">Your groups</h2>
          <p className="text-gray-700">{user.clusters.map((c) => c.name).join(", ")}</p>
          <p className="text-gray-500 text-sm mt-1">The church office adds you to groups.</p>
        </section>
      )}

      <section className="mt-6 rounded-2xl bg-white border border-gray-200 p-6">
        <h2 className="font-bold text-lg mb-2">Your data</h2>
        <p className="text-gray-600 text-sm mb-4">You can keep a copy of everything the church holds about you, or have it removed.</p>
        <button type="button" onClick={handleDownload} className="px-5 py-2 rounded-full border border-custom-blue text-custom-blue cursor-pointer">
          Download my details
        </button>

        <form onSubmit={handleDelete} className="mt-6 border-t border-gray-200 pt-4">
          <h3 className="font-semibold text-red-700">Delete my account</h3>
          <p className="text-gray-600 text-sm mb-3">
            This removes your account and details from the church dashboard. It cannot be undone.
            Type your email address ({user.email || user.first_name}) to confirm.
          </p>
          <div className="flex flex-wrap gap-3">
            <input className={`${inputClass} flex-1 min-w-60`} value={confirmEmail} onChange={(e) => setConfirmEmail(e.target.value)}
              placeholder="Your email address" aria-label="Type your email to confirm" />
            <button type="submit" disabled={!confirmEmail} className="px-5 py-2 rounded-full bg-red-600 text-white cursor-pointer disabled:opacity-50">
              Delete my account
            </button>
          </div>
          {deleteError && <p role="alert" className="text-red-600 text-sm mt-2">{deleteError}</p>}
        </form>
      </section>
    </div>
  );
}

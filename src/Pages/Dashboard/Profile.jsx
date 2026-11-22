import React, { useState } from "react";
import { useNavigate, useRevalidator, useRouteLoaderData } from "react-router";
import { deleteMyAccount, downloadMyData, updateMe } from "../../Api";
import { clearSession, errorMessage } from "../../Api/client";
import { Download, Save, Trash2 } from "lucide-react";
import Card from "../../Components/ui/Card";
import PageHeader from "../../Components/ui/PageHeader";
import Button from "../../Components/ui/Button";
import Badge from "../../Components/ui/Badge";
import { Input, Select } from "../../Components/ui/Fields";
import { FormError } from "../../Components/ui/States";
import { useToast } from "../../Context/ToastContext";
import { googleSignOut } from "../../firebase";

// Members add and correct their own details here. The email is their sign-in
// name, so it is shown but not editable.
export default function Profile() {
  const { user } = useRouteLoaderData("dashboard");
  const revalidator = useRevalidator();
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

  return (
    <div>
      <PageHeader
        title="My profile"
        description="Keep your details up to date so the church office can reach you. Only you and the church admins can see them."
        actions={<a href="/privacy" target="_blank" rel="noreferrer" className="text-sm font-medium text-forest-700 underline">How we use your details</a>}
      />

      <Card as="form" onSubmit={handleSave} className="grid gap-4 sm:grid-cols-2">
        <Input label="First name" name="first_name" value={form.first_name} onChange={change} required />
        <Input label="Last name" name="last_name" value={form.last_name} onChange={change} required />
        <Input label="Email (your sign-in name)" value={user.email || "—"} readOnly disabled />
        <Input label="Phone number" type="tel" name="phone" value={form.phone} onChange={change} placeholder="0712 345 678" />
        <Select label="Gender" name="gender" value={form.gender} onChange={change} placeholder="Choose…"
          options={[{ value: "male", label: "Male" }, { value: "female", label: "Female" }]} />
        <Input label="Date of birth" type="date" name="date_of_birth" value={form.date_of_birth}
          onChange={change} max={new Date().toISOString().slice(0, 10)} />
        <Input className="sm:col-span-2" label="Address" hint="The estate or area where you live" name="address" value={form.address} onChange={change} />
        <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
          <Button type="submit" icon={Save} loading={busy}>Save my details</Button>
          <FormError>{error}</FormError>
        </div>
      </Card>

      {(user.clusters.length > 0 || user.ministries.length > 0) && (
        <Card className="mt-6">
          <h2 className="text-xl font-semibold">Your groups and ministries</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {user.ministries.map((m) => <Badge key={`m${m.id}`} tone="gold">{m.title}</Badge>)}
            {user.clusters.map((c) => <Badge key={`c${c.id}`} tone="green">{c.name}</Badge>)}
          </div>
          <p className="mt-3 text-sm text-muted">The church office adds you to groups and ministries.</p>
        </Card>
      )}

      <Card className="mt-6">
        <h2 className="text-xl font-semibold">Your data</h2>
        <p className="mt-1 mb-4 text-sm text-muted">You can keep a copy of everything the church holds about you, or have it removed.</p>
        <Button variant="secondary" icon={Download} onClick={handleDownload}>Download my details</Button>

        <form onSubmit={handleDelete} className="mt-6 border-t border-line pt-5">
          <h3 className="text-lg font-semibold text-clay-700">Delete my account</h3>
          <p className="mt-1 mb-3 text-sm text-muted">
            This removes your account and details from the church dashboard. It cannot be undone.
            Type your email address ({user.email || user.first_name}) to confirm.
          </p>
          <div className="flex flex-wrap items-end gap-3">
            <input className="input min-w-60 flex-1" value={confirmEmail} onChange={(e) => setConfirmEmail(e.target.value)}
              placeholder="Your email address" aria-label="Type your email to confirm" />
            <Button type="submit" variant="danger" icon={Trash2} disabled={!confirmEmail}>Delete my account</Button>
          </div>
          {deleteError && <div className="mt-3"><FormError>{deleteError}</FormError></div>}
        </form>
      </Card>
    </div>
  );
}

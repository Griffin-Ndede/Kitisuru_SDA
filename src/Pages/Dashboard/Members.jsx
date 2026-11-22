import React, { useMemo, useState } from "react";
import { useLoaderData, useRevalidator, useRouteLoaderData } from "react-router";
import { exportMembers } from "../../Api";
import { errorMessage } from "../../Api/client";
import { inputClass } from "../../Components/AuthCard";
import ImportDialog from "./ImportDialog";
import MemberDialog from "./MemberDialog";
import Modal from "./Modal";
import { fullName, genderLabels, matchesSearch, statusLabels, statusOf } from "./memberHelpers";

// Admin only: the member register.
export default function Members() {
  const { members, clusters } = useLoaderData();
  const { user: me } = useRouteLoaderData("dashboard");
  const revalidator = useRevalidator();
  const [search, setSearch] = useState("");
  const [cluster, setCluster] = useState("");
  const [gender, setGender] = useState("");
  const [status, setStatus] = useState("");
  const [dialog, setDialog] = useState(null); // "add", "import", or a member's id
  const [error, setError] = useState("");

  const clusterNames = useMemo(() => Object.fromEntries(clusters.map((c) => [c.id, c.name])), [clusters]);
  const shown = useMemo(
    () =>
      members.filter(
        (m) =>
          matchesSearch(m, search) &&
          (!cluster || m.clusters.includes(Number(cluster))) &&
          (!gender || m.gender === gender) &&
          (!status || statusOf(m) === status)
      ),
    [members, search, cluster, gender, status]
  );
  const editing = typeof dialog === "number" ? members.find((m) => m.id === dialog) : null;
  const refresh = () => revalidator.revalidate();

  const handleExport = async () => {
    setError("");
    try {
      await exportMembers();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  const button = "px-4 py-2 rounded-full cursor-pointer text-sm";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-3xl font-extrabold text-custom-blue">Members</h1>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setDialog("add")} className={`${button} bg-custom-blue text-white`}>Add member</button>
          <button onClick={() => setDialog("import")} className={`${button} border border-custom-blue text-custom-blue`}>Import</button>
          <button onClick={handleExport} className={`${button} border border-custom-blue text-custom-blue`}>Export CSV</button>
        </div>
      </div>
      {error && <p role="alert" className="text-red-600 text-sm mb-3">{error}</p>}

      <div className="grid gap-3 sm:grid-cols-4 mb-3">
        <input className={`${inputClass} sm:col-span-1`} type="search" placeholder="Search name, email, phone" aria-label="Search members"
          value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className={inputClass} aria-label="Filter by cluster" value={cluster} onChange={(e) => setCluster(e.target.value)}>
          <option value="">All clusters</option>
          {clusters.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select className={inputClass} aria-label="Filter by gender" value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="">All genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <select className={inputClass} aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Any status</option>
          {Object.entries(statusLabels).map(([value, text]) => <option key={value} value={value}>{text}</option>)}
        </select>
      </div>
      <p className="text-sm text-gray-500 mb-3" aria-live="polite">Showing {shown.length} of {members.length}</p>

      <div className="overflow-x-auto bg-white rounded-2xl border border-gray-200">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-300 text-gray-600">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 pr-4">Phone</th>
              <th className="py-3 pr-4">Gender</th>
              <th className="py-3 pr-4">Clusters</th>
              <th className="py-3 pr-4">Status</th>
              <th className="py-3 pr-4" />
            </tr>
          </thead>
          <tbody>
            {shown.map((m) => (
              <tr key={m.id} className="border-b border-gray-100">
                <td className="py-2 px-4">
                  <span className="font-medium">{fullName(m)}</span>
                  <span className="block text-gray-500">{m.email || "no email"}</span>
                </td>
                <td className="py-2 pr-4">{m.phone || "—"}</td>
                <td className="py-2 pr-4">{genderLabels[m.gender]}</td>
                <td className="py-2 pr-4">{m.clusters.map((id) => clusterNames[id]).join(", ") || "—"}</td>
                <td className="py-2 pr-4">{statusLabels[statusOf(m)]}</td>
                <td className="py-2 pr-4 text-right">
                  <button onClick={() => setDialog(m.id)} className="text-custom-blue underline cursor-pointer" aria-label={`Edit ${fullName(m)}`}>Edit</button>
                </td>
              </tr>
            ))}
            {shown.length === 0 && (
              <tr><td colSpan="6" className="py-8 text-center text-gray-500">No one matches. Try clearing a filter.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {dialog === "add" && (
        <Modal title="Add a member" onClose={() => setDialog(null)}>
          <MemberDialog member={null} clusters={clusters} me={me} onSaved={refresh} onClose={() => setDialog(null)} />
        </Modal>
      )}
      {dialog === "import" && (
        <Modal title="Import members" onClose={() => setDialog(null)}>
          <ImportDialog onDone={refresh} onClose={() => setDialog(null)} />
        </Modal>
      )}
      {editing && (
        <Modal title={fullName(editing)} onClose={() => setDialog(null)}>
          <MemberDialog key={editing.id} member={editing} clusters={clusters} me={me} onSaved={refresh} onClose={() => setDialog(null)} />
        </Modal>
      )}
    </div>
  );
}

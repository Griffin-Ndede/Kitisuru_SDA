import React, { useMemo, useState } from "react";
import { useLoaderData, useRevalidator, useRouteLoaderData } from "react-router";
import { exportMembers } from "../../Api";
import { errorMessage } from "../../Api/client";
import { Download, Pencil, Plus, Upload, Users } from "lucide-react";
import Button from "../../Components/ui/Button";
import Badge from "../../Components/ui/Badge";
import Avatar from "../../Components/ui/Avatar";
import DataTable from "../../Components/ui/DataTable";
import PageHeader from "../../Components/ui/PageHeader";
import { Select, SearchInput } from "../../Components/ui/Fields";
import { EmptyState, FormError } from "../../Components/ui/States";
import ImportDialog from "./ImportDialog";
import MemberDialog from "./MemberDialog";
import Modal from "../../Components/ui/Modal";
import { fullName, genderLabels, matchesSearch, statusLabels, statusOf } from "./memberHelpers";

// Admin only: the member register.
export default function Members() {
  const { members, clusters, ministries } = useLoaderData();
  const { user: me } = useRouteLoaderData("dashboard");
  const revalidator = useRevalidator();
  const [search, setSearch] = useState("");
  const [cluster, setCluster] = useState("");
  const [ministry, setMinistry] = useState("");
  const [gender, setGender] = useState("");
  const [status, setStatus] = useState("");
  const [dialog, setDialog] = useState(null); // "add", "import", or a member's id
  const [error, setError] = useState("");

  const clusterNames = useMemo(() => Object.fromEntries(clusters.map((c) => [c.id, c.name])), [clusters]);
  const ministryNames = useMemo(() => Object.fromEntries(ministries.map((m) => [m.id, m.title])), [ministries]);
  const shown = useMemo(
    () =>
      members.filter(
        (m) =>
          matchesSearch(m, search) &&
          (!cluster || m.clusters.includes(Number(cluster))) &&
          (!ministry || m.ministries.includes(Number(ministry))) &&
          (!gender || m.gender === gender) &&
          (!status || statusOf(m) === status)
      ),
    [members, search, cluster, ministry, gender, status]
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

  const statusTone = { active: "green", waiting: "gold", record: "grey", off: "clay" };

  const columns = [
    {
      key: "name", header: "Name",
      render: (m) => (
        <div className="flex items-center gap-3">
          <Avatar name={fullName(m)} size="sm" />
          <div className="min-w-0">
            <p className="truncate font-medium">{fullName(m)}</p>
            <p className="truncate text-xs text-muted">{m.email || "no email"}</p>
          </div>
        </div>
      ),
    },
    { key: "phone", header: "Phone", hideOnMobile: true },
    { key: "gender", header: "Gender", hideOnMobile: true, render: (m) => genderLabels[m.gender] },
    { key: "clusters", header: "Clusters", hideOnMobile: true, render: (m) => m.clusters.map((id) => clusterNames[id]).join(", ") || "—" },
    { key: "ministries", header: "Ministries", hideOnMobile: true, render: (m) => m.ministries.map((id) => ministryNames[id]).join(", ") || "—" },
    { key: "status", header: "Status", render: (m) => <Badge tone={statusTone[statusOf(m)]}>{statusLabels[statusOf(m)]}</Badge> },
    {
      key: "edit", header: <span className="sr-only">Edit</span>, className: "text-right",
      render: (m) => (
        <Button variant="ghost" size="sm" icon={Pencil} onClick={() => setDialog(m.id)} aria-label={`Edit ${fullName(m)}`}>Edit</Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Members"
        description="The church register. Only admins can see this page."
        actions={
          <>
            <Button icon={Plus} onClick={() => setDialog("add")}>Add member</Button>
            <Button variant="secondary" icon={Upload} onClick={() => setDialog("import")}>Import</Button>
            <Button variant="secondary" icon={Download} onClick={handleExport}>Export CSV</Button>
          </>
        }
      />
      <div className="mb-4"><FormError>{error}</FormError></div>

      <div className="mb-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search name, email, phone" />
        <Select aria-label="Filter by cluster" value={cluster} onChange={(e) => setCluster(e.target.value)}
          placeholder="All clusters" options={clusters.map((c) => ({ value: c.id, label: c.name }))} />
        <Select aria-label="Filter by ministry" value={ministry} onChange={(e) => setMinistry(e.target.value)}
          placeholder="All ministries" options={ministries.map((m) => ({ value: m.id, label: m.title }))} />
        <Select aria-label="Filter by gender" value={gender} onChange={(e) => setGender(e.target.value)}
          placeholder="All genders" options={[{ value: "male", label: "Male" }, { value: "female", label: "Female" }]} />
        <Select aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value)}
          placeholder="Any status" options={Object.entries(statusLabels).map(([value, label]) => ({ value, label }))} />
      </div>
      <p className="mb-3 text-sm text-muted" aria-live="polite">Showing {shown.length} of {members.length}</p>

      <DataTable
        columns={columns}
        rows={shown}
        empty={<EmptyState icon={Users} title="No one matches">Try clearing a filter or the search.</EmptyState>}
      />

      {dialog === "add" && (
        <Modal title="Add a member" onClose={() => setDialog(null)}>
          <MemberDialog member={null} clusters={clusters} ministries={ministries} me={me} onSaved={refresh} onClose={() => setDialog(null)} />
        </Modal>
      )}
      {dialog === "import" && (
        <Modal title="Import members" onClose={() => setDialog(null)}>
          <ImportDialog onDone={refresh} onClose={() => setDialog(null)} />
        </Modal>
      )}
      {editing && (
        <Modal title={fullName(editing)} onClose={() => setDialog(null)}>
          <MemberDialog key={editing.id} member={editing} clusters={clusters} ministries={ministries} me={me} onSaved={refresh} onClose={() => setDialog(null)} />
        </Modal>
      )}
    </div>
  );
}

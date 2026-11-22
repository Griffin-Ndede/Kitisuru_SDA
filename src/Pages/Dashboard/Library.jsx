import React, { useMemo, useState } from "react";
import { useLoaderData } from "react-router";
import { BookOpenText, FileText } from "lucide-react";
import { getDocumentFileUrl } from "../../Api";
import { errorMessage } from "../../Api/client";
import Card from "../../Components/ui/Card";
import Badge from "../../Components/ui/Badge";
import Button from "../../Components/ui/Button";
import Modal from "../../Components/ui/Modal";
import PageHeader from "../../Components/ui/PageHeader";
import Spinner from "../../Components/ui/Spinner";
import { Select, SearchInput } from "../../Components/ui/Fields";
import { EmptyState, FormError } from "../../Components/ui/States";
import { formatDate } from "./ministryHelpers";

// The church's study materials (PDFs), for every approved member.
export default function Library() {
  const { documents } = useLoaderData();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [open, setOpen] = useState(null); // { doc, url, error }

  const categories = useMemo(
    () => [...new Set(documents.map((d) => d.category?.name).filter(Boolean))].sort(),
    [documents]
  );
  const shown = useMemo(() => {
    const words = search.toLowerCase().split(/\s+/).filter(Boolean);
    return documents
      .filter((d) => !category || d.category?.name === category)
      .filter((d) => words.every((w) => `${d.title} ${d.description}`.toLowerCase().includes(w)))
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [documents, search, category]);

  // The PDF needs the sign-in token, so it is fetched when someone opens it.
  const handleOpen = async (doc) => {
    setOpen({ doc, url: null, error: "" });
    try {
      setOpen({ doc, url: await getDocumentFileUrl(doc.slug), error: "" });
    } catch (err) {
      setOpen({ doc, url: null, error: errorMessage(err, "Could not open this document.") });
    }
  };

  const handleClose = () => {
    if (open?.url) URL.revokeObjectURL(open.url);
    setOpen(null);
  };

  return (
    <div>
      <PageHeader title="Library" description="Study materials and documents from the church." />

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <SearchInput className="sm:col-span-2" value={search} onChange={setSearch} placeholder="Search the library" />
        <Select aria-label="Filter by category" value={category} onChange={(e) => setCategory(e.target.value)}
          placeholder="All categories" options={categories.map((c) => ({ value: c, label: c }))} />
      </div>
      <p className="mb-4 text-sm text-muted" aria-live="polite">Showing {shown.length} of {documents.length}</p>

      {shown.length === 0 ? (
        <Card><EmptyState icon={BookOpenText} title="Nothing found">Try a different search or category.</EmptyState></Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((doc) => (
            <Card key={doc.id} className="flex flex-col">
              <span className="grid size-10 place-items-center rounded-full bg-forest-50 text-forest-700"><FileText className="size-5" /></span>
              <h2 className="mt-3 text-lg font-semibold">{doc.title}</h2>
              <p className="mt-1 line-clamp-3 flex-1 text-sm text-muted">{doc.description}</p>
              <div className="mt-4 flex items-center justify-between gap-2">
                <span className="flex flex-wrap items-center gap-2 text-xs text-muted">
                  {doc.category?.name && <Badge tone="green">{doc.category.name}</Badge>}
                  {doc.publish_date && formatDate(doc.publish_date)}
                </span>
                <Button size="sm" onClick={() => handleOpen(doc)}>Read</Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {open && (
        <Modal title={open.doc.title} size="xl" onClose={handleClose}>
          {open.error ? <FormError>{open.error}</FormError>
            : !open.url ? <Spinner label="Opening" />
            : <iframe src={`${open.url}#toolbar=1&navpanes=0&zoom=page-width`} title={open.doc.title} className="h-[70vh] w-full rounded-xl border border-line" />}
        </Modal>
      )}
    </div>
  );
}

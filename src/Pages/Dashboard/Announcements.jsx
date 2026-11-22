import React, { useState } from "react";
import { useLoaderData, useRevalidator, useRouteLoaderData } from "react-router";
import { Megaphone, Pencil, Pin, Plus, Trash2 } from "lucide-react";
import { deleteAnnouncement } from "../../Api";
import { errorMessage } from "../../Api/client";
import Card from "../../Components/ui/Card";
import Button from "../../Components/ui/Button";
import Badge from "../../Components/ui/Badge";
import Modal from "../../Components/ui/Modal";
import PageHeader from "../../Components/ui/PageHeader";
import { EmptyState, FormError } from "../../Components/ui/States";
import { useToast } from "../../Context/ToastContext";
import AnnouncementForm from "./AnnouncementForm";
import { formatDate } from "./ministryHelpers";

// What the church office wants every member to know. Everyone approved reads;
// admins post, edit and remove.
export default function Announcements() {
  const { announcements } = useLoaderData();
  const { user } = useRouteLoaderData("dashboard");
  const revalidator = useRevalidator();
  const toast = useToast();
  const [dialog, setDialog] = useState(null); // "new" or an announcement
  const [error, setError] = useState("");

  const isAdmin = user.role === "admin";

  const handleDelete = async (item) => {
    if (!window.confirm(`Remove "${item.title}"?`)) return;
    setError("");
    try {
      await deleteAnnouncement(item.id);
      toast.success("Announcement removed");
      revalidator.revalidate();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  const saved = () => {
    setDialog(null);
    revalidator.revalidate();
  };

  return (
    <div>
      <PageHeader
        title="Announcements"
        description="News and notices from the church office."
        actions={isAdmin && <Button icon={Plus} onClick={() => setDialog("new")}>New announcement</Button>}
      />
      <div className="mb-4"><FormError>{error}</FormError></div>

      {announcements.length === 0 ? (
        <Card><EmptyState icon={Megaphone} title="No announcements right now">Check back soon.</EmptyState></Card>
      ) : (
        <ul className="space-y-4">
          {announcements.map((item) => (
            <li key={item.id}>
              <Card className={item.pinned ? "!border-marigold-400" : ""}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-semibold">{item.title}</h2>
                      {item.pinned && <Badge tone="gold"><Pin className="mr-1 size-3" />Pinned</Badge>}
                      {item.is_expired && <Badge tone="grey">Expired</Badge>}
                    </div>
                    <p className="mt-1 text-xs text-muted">
                      {formatDate(item.created_at)}{item.author_name && ` · ${item.author_name}`}
                      {item.expires_on && ` · shown until ${formatDate(item.expires_on)}`}
                    </p>
                  </div>
                  {isAdmin && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary" icon={Pencil} onClick={() => setDialog(item)} aria-label={`Edit ${item.title}`}>Edit</Button>
                      <Button size="sm" variant="ghost" icon={Trash2} onClick={() => handleDelete(item)} aria-label={`Remove ${item.title}`} />
                    </div>
                  )}
                </div>
                <p className="mt-3 whitespace-pre-line leading-relaxed text-ink/90">{item.body}</p>
              </Card>
            </li>
          ))}
        </ul>
      )}

      {dialog && (
        <Modal title={dialog === "new" ? "New announcement" : "Edit announcement"} onClose={() => setDialog(null)}>
          <AnnouncementForm announcement={dialog === "new" ? null : dialog} onSaved={saved} onClose={() => setDialog(null)} />
        </Modal>
      )}
    </div>
  );
}

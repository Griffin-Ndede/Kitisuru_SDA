import React, { useState } from "react";
import { Link, useLoaderData, useNavigate, useRouteLoaderData } from "react-router";
import { HeartHandshake, Plus, Users } from "lucide-react";
import Card from "../../Components/ui/Card";
import Button from "../../Components/ui/Button";
import Badge from "../../Components/ui/Badge";
import Modal from "../../Components/ui/Modal";
import PageHeader from "../../Components/ui/PageHeader";
import { EmptyState } from "../../Components/ui/States";
import MinistryForm from "./MinistryForm";
import { photoUrl } from "./ministryHelpers";

// Every approved member can browse the ministries (Youth, Children, Women...).
// Admins can add new ones; each ministry's own page has the details.
export default function Ministries() {
  const { ministries } = useLoaderData();
  const { user } = useRouteLoaderData("dashboard");
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);

  const isAdmin = user.role === "admin";
  const mine = new Set(user.ministries.map((m) => m.id));

  return (
    <div>
      <PageHeader
        title="Ministries"
        description="The church's ministries. Find where you can serve and who to talk to."
        actions={isAdmin && <Button icon={Plus} onClick={() => setAdding(true)}>Add ministry</Button>}
      />

      {ministries.length === 0 ? (
        <Card>
          <EmptyState icon={HeartHandshake} title="No ministries yet">
            {isAdmin ? "Add the first one with the button above." : "The church office has not added any yet."}
          </EmptyState>
        </Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ministries.map((m) => (
            <Link key={m.id} to={`/dashboard/ministries/${m.id}`} className="group block">
              <Card padded={false} className="h-full overflow-hidden transition group-hover:-translate-y-0.5 group-hover:shadow-lift">
                <div className="relative h-36 bg-forest-50">
                  {photoUrl(m.image) ? (
                    <img src={photoUrl(m.image)} alt="" loading="lazy" className="size-full object-cover" />
                  ) : (
                    <span className="grid size-full place-items-center text-forest-600"><HeartHandshake className="size-10" /></span>
                  )}
                  {mine.has(m.id) && <span className="absolute top-3 left-3"><Badge tone="gold">You belong</Badge></span>}
                </div>
                <div className="p-5">
                  <h2 className="text-xl font-semibold">{m.title}</h2>
                  <p className="mt-1 line-clamp-2 text-sm text-muted">{m.mission || m.description || "No description yet."}</p>
                  <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted"><Users className="size-3.5" />{m.member_count} members</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {adding && (
        <Modal title="Add a ministry" onClose={() => setAdding(false)}>
          <MinistryForm ministry={null} onClose={() => setAdding(false)} onSaved={(saved) => navigate(`/dashboard/ministries/${saved.id}`)} />
        </Modal>
      )}
    </div>
  );
}

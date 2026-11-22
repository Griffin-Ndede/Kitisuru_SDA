import React from "react";
import { Link, useRouteLoaderData } from "react-router";
import { ArrowRight, Clock, Link2, UserPen, Users, UsersRound } from "lucide-react";
import { roleLabels } from "./roles";
import Card from "../../Components/ui/Card";
import PageHeader from "../../Components/ui/PageHeader";
import { Notice } from "../../Components/ui/States";
import Badge from "../../Components/ui/Badge";

// Which details a member is still asked to add on "My profile".
const missingDetails = (user) =>
  [
    !user.phone && "phone number",
    !user.gender && "gender",
    !user.date_of_birth && "date of birth",
    !user.address && "address",
  ].filter(Boolean);

const cards = [
  { to: "/dashboard/members", title: "Members", text: "The register: search, add, edit, import and export.", icon: Users },
  { to: "/dashboard/clusters", title: "Clusters", text: "Prayer cells and departments, and who belongs to each.", icon: UsersRound },
  { to: "/dashboard/sign-up", title: "Sign-up & invitations", text: "The church's sign-up link, approvals and invitations.", icon: Link2 },
];

export default function Overview() {
  const { user } = useRouteLoaderData("dashboard");
  const missing = missingDetails(user);

  return (
    <div>
      <PageHeader
        title={`Welcome${user.first_name ? `, ${user.first_name}` : ""}`}
        description={`You are signed in as ${roleLabels[user.role]}${user.email ? ` (${user.email})` : ""}.`}
      />

      {!user.approved && (
        <Notice icon={Clock} tone="warm" title="Thank you for signing up">
          The church office will approve your account shortly. Once they do, your member tools will appear here.
        </Notice>
      )}

      {missing.length > 0 && (
        <Notice icon={UserPen} title="Complete your profile">
          The church office still needs your {missing.join(", ")}.{" "}
          <Link to="/dashboard/profile" className="font-medium text-forest-700 underline">Add them on My profile</Link>.
        </Notice>
      )}

      {user.clusters.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted">Your groups</span>
          {user.clusters.map((c) => <Badge key={c.id} tone="green">{c.name}</Badge>)}
        </div>
      )}

      {user.approved && user.role === "admin" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map(({ to, title, text, icon: Icon }) => (
            <Link key={to} to={to} className="group block">
              <Card className="h-full transition group-hover:-translate-y-0.5 group-hover:shadow-lift">
                <span className="grid size-11 place-items-center rounded-full bg-forest-50 text-forest-700"><Icon className="size-5" /></span>
                <h2 className="mt-4 text-xl font-semibold">{title}</h2>
                <p className="mt-1 text-sm text-muted">{text}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-forest-700">
                  Open <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
                </span>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {user.approved && user.role !== "admin" && (
        <p className="text-muted">Your member tools will appear here as the church dashboard grows.</p>
      )}
    </div>
  );
}

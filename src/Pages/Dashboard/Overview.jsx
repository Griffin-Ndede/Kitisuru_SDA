import React from "react";
import { Link, useLoaderData, useRouteLoaderData } from "react-router";
import {
  ArrowRight,
  BookOpenText,
  HandHeart,
  Megaphone,
  Clock,
  HeartHandshake,
  Link2,
  UserPen,
  Users,
  UsersRound,
} from "lucide-react";
import { roleLabels } from "./roles";
import { formatDate } from "./ministryHelpers";

// Which details a member is still asked to add on "My profile".
const missingDetails = (user) =>
  [
    !user.phone && "phone number",
    !user.gender && "gender",
    !user.date_of_birth && "date of birth",
    !user.address && "address",
  ].filter(Boolean);

const churchCards = [
  {
    to: "/dashboard/ministries",
    title: "Ministries",
    text: "Youth, children, women and the rest: who to talk to and what is on.",
    icon: HeartHandshake,
  },
  {
    to: "/dashboard/library",
    title: "Library",
    text: "Study materials and documents from the church.",
    icon: BookOpenText,
  },
];

const adminCards = [
  {
    to: "/dashboard/members",
    title: "Members",
    text: "The register: search, add, edit, import and export.",
    icon: Users,
  },
  {
    to: "/dashboard/requests",
    title: "Get involved requests",
    text: "Add people who filled in a form to the register, ministries and clusters.",
    icon: HandHeart,
  },
  {
    to: "/dashboard/clusters",
    title: "Clusters",
    text: "Location and fundraising groups, and who belongs to each.",
    icon: UsersRound,
  },
  {
    to: "/dashboard/sign-up",
    title: "Sign-up & invitations",
    text: "The church's sign-up link, approvals and invitations.",
    icon: Link2,
  },
];

export default function Overview() {
  const { user } = useRouteLoaderData("dashboard");
  const { announcements, newRequests } = useLoaderData();
  const missing = missingDetails(user);

  return (
    <div>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold sm:text-4xl">{`Welcome${user.first_name ? `, ${user.first_name}` : ""}`}</h1>
          <p className="mt-1.5 max-w-2xl text-muted">{`You are signed in as ${roleLabels[user.role]}${user.email ? ` (${user.email})` : ""}.`}</p>
        </div>
      </header>

      {!user.approved && (
        <div
          role="status"
          className="mb-6 flex gap-4 rounded-card border p-5 border-marigold-100 bg-marigold-100/60 text-ink"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-forest-700">
            <Clock className="size-5" />
          </span>
          <div>
            <h2 className="font-display text-lg font-semibold">Thank you for signing up</h2>
            <div className="mt-0.5 text-sm text-muted">
              The church office will approve your account shortly. Once they do, your member tools will appear here.
            </div>
          </div>
        </div>
      )}

      {newRequests > 0 && (
        <div
          role="status"
          className="mb-6 flex gap-4 rounded-card border p-5 border-marigold-100 bg-marigold-100/60 text-ink"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-forest-700">
            <HandHeart className="size-5" />
          </span>
          <div>
            <h2 className="font-display text-lg font-semibold">{`${newRequests} new Get involved ${newRequests === 1 ? "request" : "requests"}`}</h2>
            <div className="mt-0.5 text-sm text-muted">
              People are waiting to hear from the church.{" "}
              <Link to="/dashboard/requests" className="font-medium text-forest-700 underline">
                Review them
              </Link>
              .
            </div>
          </div>
        </div>
      )}

      {missing.length > 0 && (
        <div
          role="status"
          className="mb-6 flex gap-4 rounded-card border p-5 border-forest-100 bg-forest-50 text-forest-900"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-forest-700">
            <UserPen className="size-5" />
          </span>
          <div>
            <h2 className="font-display text-lg font-semibold">Complete your profile</h2>
            <div className="mt-0.5 text-sm text-muted">
              The church office still needs your {missing.join(", ")}.{" "}
              <Link to="/dashboard/profile" className="font-medium text-forest-700 underline">
                Add them on My profile
              </Link>
              .
            </div>
          </div>
        </div>
      )}

      {(user.clusters.length > 0 || user.ministries.length > 0) && (
        <div className="mb-6 space-y-2">
          {user.ministries.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted">Your ministries</span>
              {user.ministries.map((m) => (
                <Link key={m.id} to={`/dashboard/ministries/${m.id}`}>
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-marigold-100 text-marigold-600">
                    {m.title}
                  </span>
                </Link>
              ))}
            </div>
          )}
          {user.clusters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted">Your groups</span>
              {user.clusters.map((c) => (
                <span
                  className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-forest-100 text-forest-800"
                  key={c.id}
                >
                  {c.name}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {announcements.length > 0 && (
        <section className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="inline-flex items-center gap-2 text-xl font-semibold">
              <Megaphone className="size-5 text-forest-700" />
              Latest announcements
            </h2>
            <Link to="/dashboard/announcements" className="text-sm font-semibold text-forest-700 hover:underline">
              See all
            </Link>
          </div>
          <ul className="space-y-3">
            {announcements.map((a) => (
              <li key={a.id}>
                <Link to="/dashboard/announcements" className="block">
                  <div className="rounded-card border border-line bg-white shadow-card p-5 sm:p-6 transition hover:shadow-lift">
                    <h3 className="font-semibold">{a.title}</h3>
                    <p className="mt-0.5 line-clamp-2 text-sm text-muted">{a.body}</p>
                    <p className="mt-2 text-xs text-muted">{formatDate(a.created_at)}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {user.approved && (
        <>
          <CardGrid cards={churchCards} />
          {user.role === "admin" && (
            <>
              <h2 className="mt-8 mb-3 text-xl font-semibold">Administration</h2>
              <CardGrid cards={adminCards} />
            </>
          )}
        </>
      )}
    </div>
  );
}

function CardGrid({ cards }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map(({ to, title, text, icon: Icon }) => (
        <Link key={to} to={to} className="group block">
          <div className="rounded-card border border-line bg-white shadow-card p-5 sm:p-6 h-full transition group-hover:-translate-y-0.5 group-hover:shadow-lift">
            <span className="grid size-11 place-items-center rounded-full bg-forest-50 text-forest-700">
              <Icon className="size-5" />
            </span>
            <h2 className="mt-4 text-xl font-semibold">{title}</h2>
            <p className="mt-1 text-sm text-muted">{text}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-forest-700">
              Open <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

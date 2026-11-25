import React from "react";
import { Link, useLoaderData } from "react-router";
import { Award, UserRound } from "lucide-react";
import { formatDate } from "./ministryHelpers";

// The serving leaders, for every approved member. Names and terms only: no phone
// numbers or emails here. Admins appoint leaders under Administration > Leadership.
export default function Leaders() {
  const { leaders } = useLoaderData();

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-semibold sm:text-4xl">Our leaders</h1>
        <p className="mt-1.5 max-w-2xl text-muted">
          The members the church has elected to serve. Appointments are made every two years.
        </p>
      </header>

      {leaders.length === 0 ? (
        <div className="rounded-3xl border border-line bg-white p-6 shadow-card">
          <div className="flex flex-col items-center px-6 py-10 text-center">
            <span className="grid size-12 place-items-center rounded-full bg-forest-50 text-forest-900">
              <Award className="size-6" />
            </span>
            <h2 className="mt-3 text-xl font-semibold">No leaders listed yet</h2>
            <p className="mt-1 max-w-sm text-sm text-muted">The church office will add the serving leaders here.</p>
          </div>
        </div>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {leaders.map((position) => (
            <li key={position.id} className="rounded-3xl border border-line bg-white p-5 shadow-card">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold">{position.title}</h2>
                {position.ministry && (
                  <Link
                    to={`/dashboard/ministries/${position.ministry.id}`}
                    className="inline-flex items-center rounded-full bg-marigold-100 px-2.5 py-0.5 text-xs font-semibold text-marigold-600 hover:bg-marigold-200"
                  >
                    {position.ministry.title}
                  </Link>
                )}
              </div>
              <ul className="mt-3 space-y-2.5">
                {position.holders.map((holder) => (
                  <li key={holder.assignment} className="flex items-center gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-forest-50 text-forest-900">
                      <UserRound className="size-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-medium">{holder.name}</span>
                      <span className="block text-xs text-muted">Serving until {formatDate(holder.term_end)}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

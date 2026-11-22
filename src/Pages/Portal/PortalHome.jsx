import React from "react";
import { Link, useRouteLoaderData } from "react-router";
import { roleLabels } from "./roles";

export default function PortalHome() {
  const { user } = useRouteLoaderData("portal");

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-custom-blue mb-2">
        Welcome{user.first_name ? `, ${user.first_name}` : ""}
      </h1>
      <p className="text-gray-600 mb-8">
        You are signed in as <strong>{roleLabels[user.role]}</strong> ({user.email}).
      </p>

      {user.role === "admin" ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <Link to="/app/people" className="block rounded-2xl border border-gray-200 p-6 hover:shadow">
            <h2 className="font-bold text-lg text-custom-blue">People</h2>
            <p className="text-gray-600 text-sm mt-1">Invite members, change roles and switch accounts on or off.</p>
          </Link>
        </div>
      ) : (
        <p className="text-gray-600">
          Your member tools will appear here as the church portal grows.
        </p>
      )}
    </div>
  );
}

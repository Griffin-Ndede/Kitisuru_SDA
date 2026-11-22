import React from "react";
import { Link, useRouteLoaderData } from "react-router";
import { roleLabels } from "./roles";

// Which details a member is still asked to add on "My profile".
const missingDetails = (user) =>
  [
    !user.phone && "phone number",
    !user.gender && "gender",
    !user.date_of_birth && "date of birth",
    !user.address && "address",
  ].filter(Boolean);

const cards = [
  { to: "/dashboard/members", title: "Members", text: "The register: search, add, edit, import and export." },
  { to: "/dashboard/clusters", title: "Clusters", text: "Prayer cells and departments, and who belongs to each." },
  { to: "/dashboard/sign-up", title: "Sign-up & invitations", text: "The church's sign-up link, approvals and invitations." },
];

export default function Overview() {
  const { user } = useRouteLoaderData("dashboard");
  const missing = missingDetails(user);

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-custom-blue mb-2">
        Welcome{user.first_name ? `, ${user.first_name}` : ""}
      </h1>
      <p className="text-gray-600 mb-8">
        You are signed in as <strong>{roleLabels[user.role]}</strong>
        {user.email ? ` (${user.email})` : ""}.
      </p>

      {!user.approved && (
        <div role="status" className="rounded-2xl bg-yellow-50 border border-yellow-200 p-6 mb-6">
          <h2 className="font-bold text-lg">Thank you for signing up</h2>
          <p className="text-gray-700 mt-1">
            The church office will approve your account shortly. Once they do, your member tools will appear here.
          </p>
        </div>
      )}

      {missing.length > 0 && (
        <div role="status" className="rounded-2xl bg-blue-50 border border-blue-200 p-6 mb-6">
          <h2 className="font-bold text-lg">Complete your profile</h2>
          <p className="text-gray-700 mt-1">
            The church office still needs your {missing.join(", ")}.{" "}
            <Link to="/dashboard/profile" className="text-custom-blue underline">Add them on My profile</Link>.
          </p>
        </div>
      )}

      {user.clusters.length > 0 && (
        <p className="mb-6 text-gray-700">
          Your groups: <strong>{user.clusters.map((c) => c.name).join(", ")}</strong>
        </p>
      )}

      {user.approved && user.role === "admin" && (
        <div className="grid gap-4 sm:grid-cols-2">
          {cards.map((card) => (
            <Link key={card.to} to={card.to} className="block rounded-2xl bg-white border border-gray-200 p-6 hover:shadow">
              <h2 className="font-bold text-lg text-custom-blue">{card.title}</h2>
              <p className="text-gray-600 text-sm mt-1">{card.text}</p>
            </Link>
          ))}
        </div>
      )}

      {user.approved && user.role !== "admin" && (
        <p className="text-gray-600">Your member tools will appear here as the church dashboard grows.</p>
      )}
    </div>
  );
}

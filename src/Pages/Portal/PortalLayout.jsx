import React from "react";
import { Link, Outlet, useLoaderData, useNavigate } from "react-router";
import { clearSession } from "../../Api/client";
import { googleSignOut } from "../../firebase";
import { roleLabels } from "./roles";

// The frame around every page under /app. Its loader (portalLoader) has
// already checked that someone is signed in.
export default function PortalLayout() {
  const { user } = useLoaderData();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    clearSession();
    await googleSignOut();
    navigate("/");
  };

  return (
    <>
      <meta name="robots" content="noindex" />
      <header className="bg-custom-blue text-white">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-3">
          <Link to="/app" className="font-bold text-lg">Kitisuru SDA Portal</Link>
          <nav className="flex flex-wrap items-center gap-4 text-sm">
            {user.approved && user.role === "admin" && <Link to="/app/people" className="hover:underline">People</Link>}
            <Link to="/" className="hover:underline">Church website</Link>
            <span className="opacity-80">
              {user.first_name || user.email} · {roleLabels[user.role]}
            </span>
            <button onClick={handleSignOut} className="bg-white text-custom-blue px-4 py-1 rounded-full cursor-pointer">
              Sign out
            </button>
          </nav>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </>
  );
}

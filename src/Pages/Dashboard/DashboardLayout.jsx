import React, { useState } from "react";
import { Link, NavLink, Outlet, useLoaderData, useNavigate } from "react-router";
import { Menu, X } from "lucide-react";
import { clearSession } from "../../Api/client";
import { googleSignOut } from "../../firebase";
import { roleLabels } from "./roles";

// The frame around every page under /dashboard: a menu on the left (a drawer on
// phones) and the page on the right. Its loader (dashboardLoader) has already
// checked that someone is signed in.
export default function DashboardLayout() {
  const { user } = useLoaderData();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const isAdmin = user.approved && user.role === "admin";
  const links = [
    { to: "/dashboard", label: "Overview", end: true },
    { to: "/dashboard/profile", label: "My profile" },
    ...(isAdmin
      ? [
          { to: "/dashboard/members", label: "Members" },
          { to: "/dashboard/clusters", label: "Clusters" },
          { to: "/dashboard/sign-up", label: "Sign-up & invitations" },
        ]
      : []),
  ];

  const handleSignOut = async () => {
    clearSession();
    await googleSignOut();
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `block rounded-lg px-4 py-2 text-sm ${
      isActive ? "bg-white text-custom-blue font-semibold" : "text-white hover:bg-white/15"
    }`;

  return (
    <div className="min-h-screen bg-gray-50 md:flex">
      <meta name="robots" content="noindex" />

      {/* Top bar on phones */}
      <div className="md:hidden bg-custom-blue text-white flex items-center justify-between px-4 py-3">
        <Link to="/dashboard" className="font-bold">Kitisuru SDA Dashboard</Link>
        <button aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)} className="cursor-pointer">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <aside
        className={`${open ? "block" : "hidden"} md:flex md:flex-col md:w-64 md:min-h-screen bg-custom-blue text-white p-4 md:sticky md:top-0 md:h-screen`}
      >
        <Link to="/dashboard" className="hidden md:block font-bold text-lg px-4 py-3">
          Kitisuru SDA Dashboard
        </Link>
        <nav className="space-y-1 mt-2 flex-1" onClick={() => setOpen(false)}>
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-white/30 pt-4 mt-4 text-sm space-y-2" onClick={() => setOpen(false)}>
          <p className="px-4">
            <span className="block font-semibold truncate">
              {`${user.first_name} ${user.last_name}`.trim() || user.email || user.username}
            </span>
            <span className="opacity-80">{roleLabels[user.role]}</span>
          </p>
          <Link to="/" className="block px-4 py-1 hover:underline">Church website</Link>
          <Link to="/privacy" className="block px-4 py-1 hover:underline">Privacy</Link>
          <button onClick={handleSignOut} className="mx-4 mt-2 bg-white text-custom-blue px-4 py-1 rounded-full cursor-pointer">
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

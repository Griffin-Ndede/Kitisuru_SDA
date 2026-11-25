import React, { useEffect, useState, useRef } from "react";
import { NavLink, Outlet, useLoaderData, useLocation, useNavigate, Link } from "react-router";
import {
  LayoutDashboard, UserRound, Users, UsersRound, Link2, HeartHandshake, BookOpenText, Megaphone, HandHeart, Globe, ShieldCheck, LogOut, Menu, X, ChevronDown,
} from "lucide-react";
import { clearSession } from "../../Api/client";
import { googleSignOut } from "../../firebase";
import { roleLabels } from "./roles";
import { fullName } from "./memberHelpers";

// The frame around every page under /dashboard: a dark menu on the left (a drawer
// on phones), a top bar with the account menu, and the page itself. Its loader
// (dashboardLoader) has already checked that someone is signed in.
export default function DashboardLayout() {
  const { user } = useLoaderData();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  // Close the drawer when moving to another page
  useEffect(() => setOpen(false), [pathname]);

  const isAdmin = user.approved && user.role === "admin";
  const sections = [
    {
      label: "Home",
      items: [
        { to: "/dashboard", label: "Overview", icon: LayoutDashboard, end: true },
        { to: "/dashboard/profile", label: "My profile", icon: UserRound },
      ],
    },
    ...(user.approved
      ? [{
          label: "Church",
          items: [
            { to: "/dashboard/announcements", label: "Announcements", icon: Megaphone },
            { to: "/dashboard/ministries", label: "Ministries", icon: HeartHandshake },
            { to: "/dashboard/library", label: "Library", icon: BookOpenText },
          ],
        }]
      : []),
    ...(isAdmin
      ? [{
          label: "Administration",
          items: [
            { to: "/dashboard/members", label: "Members", icon: Users },
            { to: "/dashboard/clusters", label: "Clusters", icon: UsersRound },
            { to: "/dashboard/requests", label: "Get involved requests", icon: HandHeart },
            { to: "/dashboard/sign-up", label: "Sign-up & invitations", icon: Link2 },
          ],
        }]
      : []),
  ];

  const name = fullName(user);

  const handleSignOut = async () => {
    clearSession();
    await googleSignOut();
    navigate("/");
  };

  const itemClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
      isActive ? "bg-marigold-500 text-forest-950" : "text-forest-100 hover:bg-white/10"
    }`;

  const menu = (
    <nav aria-label="Dashboard" className="flex-1 space-y-6 overflow-y-auto px-4 py-6">
      {sections.map((section) => (
        <div key={section.label}>
          <p className="mb-2 px-3 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-forest-200/70">{section.label}</p>
          <div className="space-y-1">
            {section.items.map(({ to, label, icon: Icon, end }) => (
              <NavLink key={to} to={to} end={end} className={itemClass}>
                <Icon className="size-[1.1rem]" />{label}
              </NavLink>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );

  return (
    <div className="app-theme min-h-screen">
      <meta name="robots" content="noindex" />

      {/* Fixed menu on large screens */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-forest-950 lg:flex">
        <div className="px-6 pt-6"><Logo to="/dashboard" tone="light" /></div>
        {menu}
      </aside>

      {/* Drawer on phones */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-forest-950/60" onClick={() => setOpen(false)} aria-hidden="true" />
          <aside className="rise relative flex h-full w-72 max-w-[85vw] flex-col bg-forest-950">
            <div className="flex items-center justify-between px-6 pt-6">
              <Logo to="/dashboard" tone="light" />
              <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="rounded-full p-1.5 text-forest-100 hover:bg-white/10">
                <X className="size-5" />
              </button>
            </div>
            {menu}
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-line bg-paper/90 px-4 py-3 backdrop-blur sm:px-8">
          <button type="button" onClick={() => setOpen(true)} aria-label="Open menu" className="rounded-full p-2 hover:bg-paper-deep lg:hidden">
            <Menu className="size-5" />
          </button>
          <div className="lg:hidden"><Logo to="/dashboard" compact /></div>
          <p className="eyebrow hidden lg:block">{roleLabels[user.role]} dashboard</p>

          <Dropdown
            label="Account menu"
            buttonClassName="flex items-center gap-2.5 rounded-full py-1 pr-2 pl-1 hover:bg-paper-deep"
            trigger={
              <>
                <Avatar name={name} size="sm" />
                <span className="hidden max-w-40 truncate text-sm font-medium sm:block">{name}</span>
                <ChevronDown className="size-4 text-muted" />
              </>
            }
          >
            {(close) => (
              <>
                <div className="border-b border-line px-4 pb-3 pt-2">
                  <p className="truncate text-sm font-semibold">{name}</p>
                  <p className="truncate text-xs text-muted">{user.email || user.username}</p>
                  <p className="mt-1 text-xs text-forest-700">{roleLabels[user.role]}</p>
                </div>
                <DropdownItem icon={UserRound} onClick={() => { close(); navigate("/dashboard/profile"); }}>My profile</DropdownItem>
                <DropdownItem icon={Globe} onClick={() => { close(); navigate("/"); }}>Church website</DropdownItem>
                <DropdownItem icon={ShieldCheck} onClick={() => { close(); navigate("/privacy"); }}>Privacy</DropdownItem>
                <DropdownItem icon={LogOut} danger onClick={handleSignOut}>Sign out</DropdownItem>
              </>
            )}
          </Dropdown>
        </header>

        <main className="px-4 py-8 sm:px-8">
          <div className="mx-auto max-w-5xl"><Outlet /></div>
        </main>
      </div>
    </div>
  );
}

// ---- Small UI pieces used only on this page ----

// The arch-and-sunrise mark with the church name. `tone` flips it for dark backgrounds.
function Logo({ to = "/", tone = "dark", compact = false }) {
  const text = tone === "light" ? "text-paper" : "text-forest-900";
  return (
    <Link to={to} className={`inline-flex items-center gap-2.5 ${text}`} aria-label="Kitisuru SDA Church, home">
      <svg viewBox="0 0 32 32" className="size-9 shrink-0" aria-hidden="true">
        <rect width="32" height="32" rx="9" className={tone === "light" ? "fill-paper/10" : "fill-forest-900"} />
        <path d="M9 25V15a7 7 0 0 1 14 0v10" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="16" cy="19" r="3.4" fill="#FFC700" />
      </svg>
      {!compact && (
        <span className="leading-none">
          <span className="block font-display text-lg font-semibold tracking-tight">Kitisuru</span>
          <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.2em] opacity-70">SDA Church</span>
        </span>
      )}
    </Link>
  );
}

const initials = (name = "") =>
  name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "?";

function Avatar({ name, size = "md" }) {
  const sizes = { sm: "size-8 text-xs", md: "size-10 text-sm", lg: "size-16 text-xl" };
  return (
    <span className={`${sizes[size]} grid shrink-0 place-items-center rounded-full bg-forest-100 font-semibold text-forest-800`} aria-hidden="true">
      {initials(name)}
    </span>
  );
}

// A button that opens a small menu. `trigger` is the button's content; children get `close`.
function Dropdown({ trigger, label, align = "right", width = "w-56", buttonClassName = "", children }) {
  const [open, setOpen] = useState(false);
  const root = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onClick = (event) => !root.current?.contains(event.target) && setOpen(false);
    const onKey = (event) => event.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={root} className="relative">
      <button type="button" aria-haspopup="menu" aria-expanded={open} aria-label={label} onClick={() => setOpen((o) => !o)} className={buttonClassName}>
        {trigger}
      </button>
      {open && (
        <div role="menu" className={`rise absolute z-40 mt-2 ${width} max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-line bg-white py-1.5 shadow-lift ${align === "right" ? "right-0" : "left-0"}`}>
          {typeof children === "function" ? children(() => setOpen(false)) : children}
        </div>
      )}
    </div>
  );
}

function DropdownItem({ icon: Icon, danger, children, ...props }) {
  return (
    <button
      type="button" role="menuitem"
      className={`flex w-full items-center gap-2.5 px-4 py-2 text-left text-sm hover:bg-paper ${danger ? "text-clay-600" : "text-ink"}`}
      {...props}
    >
      {Icon && <Icon className="size-4 opacity-70" />}{children}
    </button>
  );
}

import React, { useState } from 'react';
import { LayoutDashboard, LogIn, Menu, X } from 'lucide-react';
import { Link, NavLink } from 'react-router';
import { useUser } from '../Context/UserContext';

// The top bar of every public page: cream, with a small yellow marker over the
// page you are on.
function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isSignedIn } = useUser();

  const links = [
    { to: '/', label: 'Home', end: true },
    { to: '/about', label: 'About' },
    { to: '/giving', label: 'Giving' },
    { to: '/contact', label: 'Contact' },
  ];
  // Signed-in people see a link to the dashboard instead of "Sign in".
  const account = isSignedIn
    ? { to: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard }
    : { to: '/signin', label: 'Sign in', Icon: LogIn };

  const handleToggle = () => setIsOpen((open) => !open);
  const handleClose = () => setIsOpen(false);

  return (
    <header className="site-theme sticky top-0 z-50 border-b border-cream-deep bg-cream/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-3.5 sm:px-8" aria-label="Main">
        <Link to="/" className="flex items-center gap-3" onClick={handleClose}>
          <img src="/logo-icon.png" alt="" className="size-11 rounded-xl" />
          <span className="leading-tight">
            <span className="block font-display text-xl font-semibold text-forest-950">Kitisuru</span>
            <span className="block text-[0.7rem] font-semibold tracking-[0.2em] text-muted uppercase">SDA Church</span>
          </span>
        </Link>

        <div className="hidden items-center gap-9 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `relative py-1 text-[0.95rem] font-medium transition hover:text-forest-900 ${isActive ? 'text-forest-950' : 'text-ink/70'}`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute -top-[15px] left-1/2 h-1.5 w-10 -translate-x-1/2 rounded-b-full bg-marigold-500" />
                  )}
                  {link.label}
                </>
              )}
            </NavLink>
          ))}
          <span className="h-7 w-px bg-ink/20" aria-hidden="true" />
          <Link
            to={account.to}
            className="inline-flex items-center gap-2 text-[0.95rem] font-medium text-ink/70 transition hover:text-forest-900"
          >
            <account.Icon className="size-4" />
            {account.label}
          </Link>
          <Link
            to="/getinvolved"
            className="rounded-full bg-marigold-500 px-5 py-2.5 text-[0.95rem] font-semibold text-forest-950 shadow-card transition hover:bg-marigold-400 active:translate-y-px"
          >
            Get involved
          </Link>
        </div>

        <button
          type="button"
          className="grid size-11 place-items-center rounded-full border border-cream-deep bg-white text-forest-950 md:hidden"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
          onClick={handleToggle}
        >
          {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {isOpen && (
        <div className="border-t border-cream-deep bg-cream px-5 pt-3 pb-6 md:hidden">
          <ul className="space-y-1">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.end}
                  onClick={handleClose}
                  className={({ isActive }) =>
                    `block rounded-3xl px-4 py-3 font-medium ${isActive ? 'bg-marigold-100 text-forest-950' : 'text-ink/80'}`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
            <li>
              <Link to={account.to} onClick={handleClose} className="block rounded-3xl px-4 py-3 font-medium text-ink/80">
                {account.label}
              </Link>
            </li>
          </ul>
          <Link
            to="/getinvolved"
            onClick={handleClose}
            className="mt-3 block rounded-full bg-marigold-500 px-5 py-3 text-center font-semibold text-forest-950"
          >
            Get involved
          </Link>
        </div>
      )}
    </header>
  );
}

export default Navbar;

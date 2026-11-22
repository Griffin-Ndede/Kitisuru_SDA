import React from "react";
import { Link } from "react-router";
import Logo from "./Logo";

// Sign-in pages: the form on paper, with a green brand panel beside it on large screens.
export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="app-theme grid min-h-screen lg:grid-cols-2">
      <main className="flex flex-col px-6 py-8 sm:px-12">
        <Logo />
        <div className="rise mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          <h1 className="text-4xl font-semibold">{title}</h1>
          {subtitle && <p className="mt-2 text-muted">{subtitle}</p>}
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-6 text-center text-sm text-muted">{footer}</div>}
        </div>
        <p className="text-center text-xs text-muted">
          <Link to="/privacy" className="underline hover:text-ink">Privacy</Link> · <Link to="/" className="underline hover:text-ink">Back to the church website</Link>
        </p>
      </main>

      <aside className="relative hidden overflow-hidden bg-forest-900 lg:block" aria-hidden="true">
        <div className="absolute -top-24 -right-24 size-96 rounded-full bg-marigold-500/90 blur-[2px]" />
        <div className="arch absolute bottom-0 left-1/2 h-[28rem] w-80 -translate-x-1/2 border border-paper/20 bg-forest-800" />
        <div className="arch absolute bottom-0 left-1/2 h-80 w-56 -translate-x-1/2 border border-paper/20 bg-forest-700" />
        <div className="arch absolute bottom-0 left-1/2 h-48 w-32 -translate-x-1/2 bg-forest-950" />
        <div className="absolute inset-x-12 top-1/3 text-paper">
          <p className="eyebrow !text-marigold-400">Kitisuru SDA Church</p>
          <p className="mt-3 max-w-sm font-display text-3xl leading-snug">One family, one register, one place to stay connected.</p>
        </div>
      </aside>
    </div>
  );
}

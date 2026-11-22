import React from "react";
import { Link } from "react-router";
import Navbar from "./Navbar";

// The centred card the sign-in, forgot-password and choose-password pages share.
export default function AuthCard({ title, intro, children, footer }) {
  return (
    <>
      <meta name="robots" content="noindex" />
      <Navbar />
      <section className="min-h-screen pt-32 pb-16 px-4 bg-gray-50">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow p-8">
          <h1 className="text-2xl font-extrabold text-custom-blue mb-2">{title}</h1>
          {intro && <p className="text-gray-600 mb-6">{intro}</p>}
          {children}
          {footer && <div className="mt-6 text-sm text-center text-gray-600">{footer}</div>}
        </div>
        <p className="text-center text-sm text-gray-500 mt-6">
          <Link to="/" className="underline">Back to the church website</Link>
        </p>
      </section>
    </>
  );
}

export const inputClass =
  "w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 ring-custom-blue";
export const buttonClass =
  "w-full px-6 py-3 rounded-full bg-custom-blue text-white font-semibold cursor-pointer disabled:opacity-60";

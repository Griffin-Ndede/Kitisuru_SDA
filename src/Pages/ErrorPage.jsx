import React from "react";
import { isRouteErrorResponse, Link, useRevalidator, useRouteError } from "react-router";
import Navbar from "../Components/Navbar";

// Shown whenever a page can't load (errorElement in App.jsx):
// - an address that doesn't exist, or a ministry the API doesn't have (404)
// - the API is down, slow or returns an error
// Instead of a blank crash screen, visitors get a way back home.
export default function ErrorPage() {
  const error = useRouteError();
  const revalidator = useRevalidator();

  // Unknown addresses come from the router; a missing ministry comes from the API.
  const status = isRouteErrorResponse(error)
    ? error.status
    : error?.response?.status;
  const notFound = status === 404;
  const forbidden = status === 403;

  if (!notFound && !forbidden) console.error(error);

  return (
    <>
      <meta name="robots" content="noindex" />
      <Navbar />
      <section className="min-h-screen pt-32 px-6 text-center">
        <h1 className="text-3xl md:text-5xl font-extrabold text-custom-blue mb-4">
          {notFound
            ? "We couldn't find that page"
            : forbidden
              ? "You don't have access to this page"
              : "This page didn't load"}
        </h1>
        <p className="text-lg max-w-xl mx-auto text-gray-700 mb-8">
          {notFound
            ? "The address may have changed or the page may no longer exist."
            : forbidden
              ? "This page is for church admins. If you think you should have access, please ask the church office."
              : "We could not reach the church server. Please check your internet connection and try again."}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {!notFound && !forbidden && (
            <button
              onClick={() => revalidator.revalidate()}
              className="px-6 py-3 rounded-full bg-custom-blue text-white font-semibold cursor-pointer"
            >
              Try again
            </button>
          )}
          <Link to="/" className="px-6 py-3 rounded-full border border-custom-blue text-custom-blue font-semibold">
            Go to Home
          </Link>
          <Link to="/contact" className="px-6 py-3 rounded-full border border-custom-blue text-custom-blue font-semibold">
            Contact us
          </Link>
        </div>
      </section>
    </>
  );
}

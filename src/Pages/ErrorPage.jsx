import React from 'react';
import { isRouteErrorResponse, Link, useRevalidator, useRouteError } from 'react-router';
import Navbar from '../Components/Navbar';

// Shown by the router for any loader or render failure.
// Two cases: the page does not exist (404), or the data did not load.
const ErrorPage = () => {
  const error = useRouteError();
  const revalidator = useRevalidator();
  const notFound = isRouteErrorResponse(error) && error.status === 404;

  if (!notFound) console.error('Page failed to load:', error);

  return (
    <>
      <meta name="robots" content="noindex" />
      <Navbar />
      <section className="min-h-screen pt-32 px-6 text-center">
        <h1 className="text-3xl md:text-5xl font-extrabold text-custom-blue mb-4">
          {notFound ? "We couldn't find that page" : "This page didn't load"}
        </h1>
        <p className="text-lg max-w-xl mx-auto text-gray-700 mb-8">
          {notFound
            ? 'The address may have changed or the page may no longer exist.'
            : 'We could not reach the church server. Please check your internet connection and try again.'}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {!notFound && (
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
};

export default ErrorPage;

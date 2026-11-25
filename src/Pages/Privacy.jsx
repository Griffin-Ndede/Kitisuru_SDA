import React from "react";
import { Link } from "react-router";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";

// What the church does with members' details. A plain-language notice; the
// church's leadership should read it and adjust it to how the church works.
const sections = [
  {
    title: "What we keep",
    body: [
      "Your name, email address and phone number.",
      "Your gender, date of birth and address, once you add them on My profile.",
      "The groups (prayer cells and departments) you belong to, and your role on the dashboard.",
      "When you signed up and when you agreed to us keeping your details.",
      "If you fill in a form on the Get involved page: what you write in it (for example the ministries you want to join, or your child's details for a dedication). The church office reads it, follows up, and may add you to the register.",
      "Your password is stored scrambled, so nobody can read it, not even the church admins. If you sign in with Google, we receive only your email address from Google.",
    ],
  },
  {
    title: "Why we keep it",
    body: [
      "To keep the church's member register, to reach you about church life, and to organise groups and ministries. We do not use your details for anything else.",
    ],
  },
  {
    title: "Who can see it",
    body: [
      "You can see your own details. The church admins can see and correct everyone's details so the register stays accurate. Other members cannot see your details.",
      "We do not sell your details or share them outside the church. Invitation and password emails are sent from the church's email address.",
    ],
  },
  {
    title: "How long we keep it",
    body: [
      "We keep your details while you are part of the church family on this dashboard, and remove them when you ask us to.",
    ],
  },
  {
    title: "Your choices",
    body: [
      "You can change your details at any time on My profile.",
      "You can download a copy of everything we hold about you from My profile.",
      "You can delete your account and details yourself from My profile, or ask the church office to do it for you.",
      "If the church office added you to the register before you signed up, they should have your permission to do so. If they did not, tell the office and we will remove you.",
    ],
  },
];

export default function Privacy() {
  return (
    <div className="site-theme min-h-screen overflow-x-clip">
      <meta name="robots" content="noindex" />
      <Navbar />

      <section>
        <div className="mx-auto max-w-4xl px-5 pt-12 pb-20 sm:px-8 lg:pt-20 lg:pb-28">
          <p className="text-xs font-semibold tracking-[0.22em] text-clay-600 uppercase">Privacy</p>
          <h1 className="mt-4 text-5xl leading-[1.05] font-semibold text-forest-950 sm:text-6xl">
            How we use{' '}
            <span className="relative inline-block text-forest-900">
              your details
              <svg
                className="absolute -bottom-2 left-0 h-3 w-full"
                viewBox="0 0 240 14"
                fill="none"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M2 9 C 40 2, 80 13, 125 6 S 205 9, 238 4"
                  stroke="#ffc700"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink/70">
            Seventh Day Adventist Church Kitisuru keeps a register of its members on this website. This page explains what is kept and who can see it.
          </p>

          <div className="mt-12 space-y-6">
            {sections.map((section) => (
              <div key={section.title} className="rounded-3xl bg-white p-7 shadow-card sm:p-9">
                <h2 className="text-2xl font-semibold text-forest-950">{section.title}</h2>
                <ul className="mt-4 space-y-3 text-ink/75">
                  {section.body.map((line) => (
                    <li key={line} className="flex items-start gap-3 leading-relaxed">
                      <span className="mt-2.5 size-2 shrink-0 rotate-45 rounded-sm bg-marigold-500" aria-hidden="true" />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="mt-10 text-lg text-ink/80">
            Questions about your details?{" "}
            <Link to="/contact" className="font-semibold text-forest-900 underline">
              Contact the church office
            </Link>
            .
          </p>
          <p className="mt-4 text-sm text-ink/50">Last updated 22 November 2026.</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}

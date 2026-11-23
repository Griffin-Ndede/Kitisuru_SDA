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
    <>
      <meta name="robots" content="noindex" />
      <Navbar />
      <section className="min-h-screen pt-32 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-extrabold text-custom-blue mb-4">How we use your details</h1>
          <p className="text-gray-600 mb-8">
            Seventh Day Adventist Church Kitisuru keeps a register of its members on this website. This page explains what is kept and who can see it.
          </p>
          {sections.map((section) => (
            <div key={section.title} className="mb-8">
              <h2 className="text-xl font-bold mb-2">{section.title}</h2>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                {section.body.map((line) => <li key={line}>{line}</li>)}
              </ul>
            </div>
          ))}
          <p className="text-gray-700">
            Questions about your details? <Link to="/contact" className="text-custom-blue underline">Contact the church office</Link>.
          </p>
          <p className="text-gray-500 text-sm mt-6">Last updated 22 November 2026.</p>
        </div>
      </section>
      <Footer />
    </>
  );
}

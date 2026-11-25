import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Building2, CreditCard, Phone, Building, ChevronDown } from 'lucide-react';
import Footer from '../Components/Footer';
import Navbar from '../Components/Navbar';

function Giving() {
  const [expandedOption, setExpandedOption] = useState(null);
  const [openFAQ, setOpenFAQ] = useState(null);

  const givingOptions = [
    {
      icon: Wallet,
      title: "Tithes & Offerings",
      description: "Return your tithe and give offerings to support God's work worldwide.",
      methods: [
        { name: "M-PESA", details: "Church Paybill: 406 894 9" },
        { name: "Adventist Giving", details: "Give securely through the official Adventist Giving platform" },
      ],
    },
    {
      icon: Building2,
      title: "Local Church Projects",
      description: "Support our local initiatives and community outreach programs.",
      methods: [
        { name: "Church development", details: "Help us maintain and improve our church facilities" },
        { name: "Welfare", details: "Support our local charity and outreach programs" },
        { name: "Youth Ministry", details: "Invest in our youth programs and activities" },
      ],
    },
  ];

  const faqs = [
    {
      question: "How is my tithe used?",
      answer: "Your tithe supports the worldwide mission of the Seventh-day Adventist Church, including pastoral ministry, evangelism, and education.",
    },
    {
      question: "What's the difference between tithe and offerings?",
      answer: "Tithe is 10% of your income returned to God, while offerings are additional voluntary gifts for specific purposes or projects.",
    },
  ];

  const handleToggleOption = (index) => setExpandedOption(expandedOption === index ? null : index);
  const handleToggleFAQ = (index) => setOpenFAQ(openFAQ === index ? null : index);

  return (
    <div className="site-theme min-h-screen overflow-x-clip">
      <Navbar />

      {/* Header */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-5 pt-12 pb-16 sm:px-8 lg:pt-20 lg:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="grid items-end gap-10 lg:grid-cols-2"
          >
            <div>
              <p className="text-xs font-semibold tracking-[0.22em] text-clay-600 uppercase">Giving</p>
              <h1 className="mt-4 text-5xl leading-[1.05] font-semibold text-forest-950 sm:text-6xl">
                Supporting God&apos;s work through{' '}
                <span className="relative inline-block text-forest-900">
                  giving
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
            </div>
            <figure className="relative rounded-3xl bg-white p-7 shadow-card">
              <span className="absolute -top-3 left-7 h-1.5 w-12 rounded-b-full bg-marigold-500" aria-hidden="true" />
              <blockquote className="font-display text-xl leading-relaxed text-forest-950 italic">
                &ldquo;Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.&rdquo;
              </blockquote>
              <figcaption className="mt-3 text-sm font-semibold tracking-wide text-ink/50">2 Corinthians 9:7</figcaption>
            </figure>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 pb-20 sm:px-8">
        {/* Giving options */}
        <section className="grid gap-6 lg:grid-cols-2">
          {givingOptions.map((option, index) => {
            const isExpanded = expandedOption === index;
            return (
              <div key={option.title} className="rounded-3xl bg-white p-7 shadow-card">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 text-left"
                  aria-expanded={isExpanded}
                  onClick={() => handleToggleOption(index)}
                >
                  <span className="flex items-center gap-4">
                    <span className="grid size-12 shrink-0 place-items-center rounded-3xl bg-forest-50 text-forest-900">
                      <option.icon className="size-6" strokeWidth={1.6} />
                    </span>
                    <span className="font-display text-2xl font-semibold text-forest-950">{option.title}</span>
                  </span>
                  <ChevronDown
                    className={`size-5 shrink-0 text-forest-900 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </button>
                <p className="mt-4 leading-relaxed text-ink/70">{option.description}</p>
                {isExpanded && (
                  <div className="mt-5 space-y-3 border-t border-forest-950/10 pt-5">
                    {option.methods.map((method) => (
                      <div key={method.name} className="rounded-3xl bg-cream p-4">
                        <h4 className="font-semibold text-forest-950">{method.name}</h4>
                        <p className="mt-1 text-sm text-ink/70">{method.details}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </section>

        {/* Payment methods */}
        <section className="mt-16">
          <p className="text-xs font-semibold tracking-[0.22em] text-clay-600 uppercase">How to give</p>
          <h2 className="mt-3 text-4xl font-semibold text-forest-950">Payment methods</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl bg-white p-7 shadow-card">
              <span className="grid size-12 place-items-center rounded-3xl bg-marigold-100 text-marigold-600">
                <Phone className="size-6" strokeWidth={1.6} />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-forest-950">M-PESA</h3>
              <p className="mt-3 text-sm text-ink/70">
                Church Paybill
                <span className="mt-0.5 block font-display text-2xl font-semibold text-forest-900">406 894 9</span>
              </p>
              <p className="mt-3 text-sm text-ink/70">
                Account name
                <span className="mt-0.5 block font-semibold text-forest-900">LCB, Tithe or Offering</span>
              </p>
            </div>

            <div className="rounded-3xl bg-white p-7 shadow-card">
              <span className="grid size-12 place-items-center rounded-3xl bg-marigold-100 text-marigold-600">
                <Building className="size-6" strokeWidth={1.6} />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-forest-950">Bank transfer (ABSA bank)</h3>
              <p className="mt-3 text-sm text-ink/70">
                Kshs account
                <span className="mt-0.5 block font-display text-2xl font-semibold text-forest-900">204 532 686 6</span>
              </p>
              <p className="mt-3 text-sm text-ink/70">
                USD account
                <span className="mt-0.5 block font-display text-2xl font-semibold text-forest-900">204 532 684 8</span>
              </p>
            </div>

            <div className="rounded-3xl bg-white p-7 shadow-card">
              <span className="grid size-12 place-items-center rounded-3xl bg-marigold-100 text-marigold-600">
                <CreditCard className="size-6" strokeWidth={1.6} />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-forest-950">Development account</h3>
              <p className="mt-1 text-sm font-semibold text-ink/80">ABSA Account</p>
              <p className="mt-3 text-sm text-ink/70">
                M-pesa Paybill
                <span className="mt-0.5 block font-display text-2xl font-semibold text-forest-900">303030</span>
              </p>
              <p className="mt-3 text-sm text-ink/70">
                Account number
                <span className="mt-0.5 block font-display text-2xl font-semibold text-forest-900">204 532 6813</span>
              </p>
            </div>

            <div className="rounded-3xl bg-white p-7 shadow-card">
              <span className="grid size-12 place-items-center rounded-3xl bg-marigold-100 text-marigold-600">
                <CreditCard className="size-6" strokeWidth={1.6} />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-forest-950">Development account</h3>
              <p className="mt-1 text-sm font-semibold text-ink/80">Unaitas Sacco</p>
              <p className="mt-3 text-sm text-ink/70">
                M-pesa Paybill
                <span className="mt-0.5 block font-display text-2xl font-semibold text-forest-900">544600</span>
              </p>
              <p className="mt-3 text-sm text-ink/70">
                Account number
                <span className="mt-0.5 block font-display text-2xl font-semibold text-forest-900">863441#your name</span>
              </p>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="mt-16 rounded-3xl bg-cream-deep/70 p-7 sm:p-10">
          <h2 className="text-3xl font-semibold text-forest-950">Frequently asked questions</h2>
          <div className="mt-6 divide-y divide-forest-950/10">
            {faqs.map((faq, index) => {
              const isOpen = openFAQ === index;
              return (
                <div key={faq.question} className="py-5">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 text-left"
                    aria-expanded={isOpen}
                    onClick={() => handleToggleFAQ(index)}
                  >
                    <span className="font-semibold text-forest-950">{faq.question}</span>
                    <ChevronDown
                      className={`size-5 shrink-0 text-forest-900 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {isOpen && <p className="mt-3 max-w-2xl leading-relaxed text-ink/70">{faq.answer}</p>}
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Closing verse, on navy */}
      <section className="bg-forest-950 text-white">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center sm:px-8">
          <p className="font-display text-2xl leading-relaxed text-white/90 italic sm:text-3xl">
            &ldquo;Bring the whole tithe into the storehouse...&rdquo;
          </p>
          <p className="mt-3 text-sm font-semibold tracking-[0.18em] text-marigold-400 uppercase">Malachi 3:10</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Giving;

import React, { useEffect, useState } from 'react';
import { Link, useLoaderData } from 'react-router';
import { motion } from 'framer-motion';
import { UserPlus, HandHeart, ChevronRight, X, Baby, Group } from 'lucide-react';
import ActivityForm from '../Components/ActivityForm';
import Footer from '../Components/Footer';
import Navbar from '../Components/Navbar';

function GetInvolved() {
    const { ministries } = useLoaderData()
    const [selectedActivity, setSelectedActivity] = useState(null)

    const activities = [
        {
            key: "Child_dedication",
            title: "Child dedication",
            description:
                "If you would like to have your child dedicated at Kitisuru Seventh-day Adventist Church please submit one form per child.",
            buttonText: "Fill out the form",
            icon: Baby,
        },
        {
            key: "commitment_form",
            title: "Commitment & Spiritual Support",
            description:
                "Let us know how you would like to take your next step in your faith journey or how we can support you spiritually.",
            buttonText: "Express commitment",
            icon: HandHeart,
        },
        {
            key: "membership_transfer",
            title: "Membership Transfer",
            description:
                "Moving from another Adventist church? We'll help you transfer your membership to our congregation.",
            buttonText: "Start Transfer",
            icon: UserPlus,
        },
        {
            key: "ministry_membership",
            title: "Join a ministry",
            description: "If you would like to join a ministry and volunteer, let us know. The church office will add you.",
            buttonText: "Join a ministry",
            icon: Group,
        },
    ];

    const handleClose = () => setSelectedActivity(null)

    // Close the form with Escape and stop the page behind it from scrolling
    useEffect(() => {
        if (!selectedActivity) return undefined
        const handleKey = (e) => {
            if (e.key === 'Escape') setSelectedActivity(null)
        }
        document.addEventListener('keydown', handleKey)
        document.body.style.overflow = 'hidden'
        return () => {
            document.removeEventListener('keydown', handleKey)
            document.body.style.overflow = ''
        }
    }, [selectedActivity])

    return (
        <div className="site-theme min-h-screen overflow-x-clip">
            <Navbar />

            {/* Header */}
            <section className="relative">
                <div className="mx-auto max-w-7xl px-5 pt-12 pb-16 sm:px-8 lg:pt-20 lg:pb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="max-w-3xl"
                    >
                        <p className="text-xs font-semibold tracking-[0.22em] text-clay-600 uppercase">Get involved</p>
                        <h1 className="mt-4 text-4xl leading-tight font-semibold text-forest-950 sm:text-5xl">
                            Find your place at{' '}
                            <span className="relative inline-block text-forest-900">
                                Kitisuru
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
                            We&apos;re glad you&apos;re here. Whether you&apos;re interested in serving, learning, or taking the next step in your faith journey, please complete one of the forms below and our team will be in touch.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* The four forms */}
            <section>
                <div className="mx-auto grid max-w-7xl gap-6 px-5 pb-24 sm:px-8 md:grid-cols-2 lg:pb-36">
                    {activities.map((activity) => (
                        <div
                            key={activity.key}
                            className="flex flex-col rounded-3xl bg-white p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-card sm:p-7"
                        >
                            <span className="grid size-14 place-items-center rounded-3xl bg-forest-50 text-forest-900">
                                <activity.icon className="size-7" strokeWidth={1.5} />
                            </span>
                            <h2 className="mt-6 text-2xl font-semibold text-forest-950">{activity.title}</h2>
                            <p className="mt-3 leading-relaxed text-ink/70">{activity.description}</p>
                            <button
                                type="button"
                                onClick={() => setSelectedActivity(activity)}
                                className="mt-7 inline-flex w-fit items-center gap-1.5 rounded-full bg-forest-900 px-5 py-3 font-semibold text-white shadow-card transition hover:bg-forest-800 active:translate-y-px"
                            >
                                {activity.buttonText}
                                <ChevronRight className="size-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Need more information */}
            <section className="bg-cream-deep/70">
                <div className="mx-auto max-w-3xl px-5 py-24 text-center sm:px-8">
                    <h2 className="text-3xl font-semibold text-forest-950">Need more information?</h2>
                    <p className="mt-4 text-lg text-ink/70">
                        Our pastoral team is here to help you find your place in our church family.
                    </p>
                    <Link
                        to="/contact"
                        className="mt-8 inline-flex rounded-full bg-marigold-500 px-8 py-3.5 font-semibold text-forest-950 shadow-card transition hover:bg-marigold-400 active:translate-y-px"
                    >
                        Contact us
                    </Link>
                </div>
            </section>

            {/* Closing verse, on navy */}
            <section className="bg-forest-950 text-white">
                <div className="mx-auto max-w-3xl px-5 py-20 text-center sm:px-8">
                    <p className="font-display text-2xl leading-relaxed text-white/90 italic sm:text-3xl">
                        &ldquo;For where two or three gather in my name, there am I with them.&rdquo;
                    </p>
                    <p className="mt-3 text-sm font-semibold tracking-[0.18em] text-marigold-400 uppercase">Matthew 18:20</p>
                </div>
            </section>

            <Footer />

            {/* The form, in a pop-up */}
            {selectedActivity && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-forest-950/60 p-4 backdrop-blur-xs"
                    onClick={handleClose}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-label={selectedActivity.title}
                        className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-cream p-6 shadow-card"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            aria-label="Close"
                            className="absolute top-4 right-4 grid size-9 place-items-center rounded-full bg-white text-ink/60 shadow-card transition hover:text-ink"
                            onClick={handleClose}
                        >
                            <X className="size-5" />
                        </button>
                        <ActivityForm activity={selectedActivity} ministries={ministries} onClose={handleClose} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default GetInvolved;

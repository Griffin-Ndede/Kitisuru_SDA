import React from 'react'
import { Link } from 'react-router'
import { motion } from 'framer-motion'
import {
    ArrowRight,
    Book,
    Church,
    CloudSun,
    Cross,
    Globe,
    Heart,
    History,
    MapPin,
    Moon,
    Sun,
    Target,
    Users,
} from 'lucide-react'
import Footer from '../Components/Footer'
import Navbar from '../Components/Navbar'

function About() {
    const coreBeliefs = [
        {
            title: "The Bible",
            description: "The inspired, infallible Word of God and our ultimate authority for faith and life.",
            icon: Book,
        },
        {
            title: "The Trinity",
            description: "One God in three co-eternal persons: Father, Son, and Holy Spirit.",
            icon: Users,
        },
        {
            title: "Jesus Christ",
            description: "Fully God and fully man — the eternal Son who became our Savior.",
            icon: Cross,
        },
        {
            title: "Salvation",
            description: "A free gift of grace received through faith in Jesus Christ.",
            icon: Heart,
        },
        {
            title: "The Sabbath",
            description: "The seventh day, Saturday — a memorial of creation and rest in God.",
            icon: Sun,
        },
        {
            title: "Second Coming",
            description: "We eagerly await the imminent return of Jesus Christ to Earth.",
            icon: CloudSun,
        },
        {
            title: "State of the Dead",
            description: "The dead rest unconsciously until the resurrection at Christ’s return.",
            icon: Moon,
        },
    ]

    const ministries = [
        "Children & Youth Ministries",
        "Women's and Men's Ministries",
        "Health and Wellness Outreach",
        "Evangelism and Bible Study",
        "Music and Worship Programs",
        "Community Development Initiatives",
    ]

    const serviceTimes = [
        { name: "Sabbath School", time: "9:00 AM" },
        { name: "Divine Service", time: "10:45 AM" },
        { name: "Afternoon Programs", time: "2:00 PM" },
    ]

    return (
        <div className="site-theme min-h-screen overflow-x-clip">
            <Navbar />

            {/* Header */}
            <section className="relative">
                <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pt-12 pb-20 sm:px-8 lg:grid-cols-2 lg:pt-20 lg:pb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        <p className="text-xs font-semibold tracking-[0.22em] text-clay-600 uppercase">About us</p>
                        <h1 className="mt-4 text-5xl leading-[1.05] font-semibold text-forest-950 sm:text-6xl">
                            Welcome to{' '}
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
                        <p className="mt-8 max-w-lg text-lg leading-relaxed text-ink/70">
                            A community rooted in Christ, devoted to truth, and driven by service.
                        </p>
                        <div className="mt-9 flex flex-wrap gap-3">
                            <Link
                                to="/getinvolved"
                                className="inline-flex items-center gap-2 rounded-full bg-marigold-500 px-6 py-3.5 font-semibold text-forest-950 shadow-card transition hover:bg-marigold-400 active:translate-y-px"
                            >
                                Get involved
                            </Link>
                            <Link
                                to="/contact"
                                className="inline-flex items-center gap-2 rounded-full border border-forest-950/15 bg-white px-6 py-3.5 font-semibold text-forest-950 transition hover:border-forest-900 active:translate-y-px"
                            >
                                Contact us
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="relative mx-auto w-full max-w-md"
                    >
                        <div className="absolute -inset-3 -rotate-6 rounded-3xl bg-marigold-500" aria-hidden="true" />
                        <div className="absolute inset-0 rotate-3 rounded-3xl bg-forest-900/90" aria-hidden="true" />
                        <div className="relative aspect-4/5 overflow-hidden rounded-3xl bg-forest-950 shadow-lift">
                            <img
                                src="https://www.briellemag.com/wp-content/uploads/2021/11/gracious-adebayo-AWIyDHiNKk-unsplash-1600x1067.jpg"
                                alt="A person in prayer"
                                className="size-full object-cover"
                            />
                        </div>
                        <svg
                            className="absolute -top-8 -left-6 hidden h-8 w-28 sm:block"
                            viewBox="0 0 110 30"
                            fill="none"
                            aria-hidden="true"
                        >
                            <path
                                d="M3 22 Q 14 2 25 22 T 47 22 T 69 22 T 91 22 T 107 14"
                                stroke="#2e8eb4"
                                strokeWidth="5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </motion.div>
                </div>
            </section>

            {/* Mission and vision, on navy */}
            <section className="relative overflow-hidden bg-forest-950 text-white">
                <svg
                    className="absolute -top-6 right-0 h-40 w-72 text-marigold-500"
                    viewBox="0 0 300 160"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path d="M300 0 L300 140 C 250 110, 215 150, 170 118 C 130 90, 120 40, 40 30 C 80 12, 150 20, 200 8 C 240 -2, 270 12, 300 0 Z" />
                </svg>
                <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:py-28">
                    <div>
                        <span className="grid size-14 place-items-center rounded-3xl bg-white/10 text-marigold-400">
                            <Church className="size-7" strokeWidth={1.5} />
                        </span>
                        <p className="mt-6 text-xs font-semibold tracking-[0.22em] text-marigold-400 uppercase">What we are here for</p>
                        <h2 className="mt-3 text-4xl font-semibold">Our mission</h2>
                        <blockquote className="mt-6 border-l-4 border-marigold-500 pl-5 font-display text-xl leading-relaxed text-white/85 italic">
                            Make disciples of Jesus Christ who live as His loving witnesses and proclaim to all people the everlasting gospel of the Three Angels&apos; Messages in preparation for His soon return
                        </blockquote>
                    </div>
                    <div>
                        <span className="grid size-14 place-items-center rounded-3xl bg-white/10 text-marigold-400">
                            <Target className="size-7" strokeWidth={1.5} />
                        </span>
                        <p className="mt-6 text-xs font-semibold tracking-[0.22em] text-marigold-400 uppercase">Where we are heading</p>
                        <h2 className="mt-3 text-4xl font-semibold">Our vision</h2>
                        <blockquote className="mt-6 border-l-4 border-marigold-500 pl-5 font-display text-xl leading-relaxed text-white/85 italic">
                            In harmony with Bible revelation, Seventh-day Adventists see as the climax of God&apos;s plan the restoration of all His creation to full harmony with His perfect will and righteousness.
                        </blockquote>
                    </div>
                </div>
            </section>

            {/* Core beliefs */}
            <section>
                <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
                    <p className="text-xs font-semibold tracking-[0.22em] text-clay-600 uppercase">What we hold to</p>
                    <h2 className="mt-3 text-4xl font-semibold text-forest-950 sm:text-5xl">Our core beliefs</h2>
                    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {coreBeliefs.map((belief) => (
                            <div
                                key={belief.title}
                                className="rounded-3xl bg-white p-7 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lift"
                            >
                                <span className="grid size-12 place-items-center rounded-3xl bg-forest-50 text-forest-900">
                                    <belief.icon className="size-6" strokeWidth={1.6} />
                                </span>
                                <h3 className="mt-5 text-xl font-semibold text-forest-950">{belief.title}</h3>
                                <p className="mt-2 leading-relaxed text-ink/70">{belief.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Who we are */}
            <section className="bg-cream-deep/70">
                <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:py-28">
                    <div>
                        <p className="text-xs font-semibold tracking-[0.22em] text-clay-600 uppercase">Who we are</p>
                        <h2 className="mt-3 text-4xl leading-tight font-semibold text-forest-950 sm:text-5xl">
                            More than a congregation. A family.
                        </h2>
                        <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink/70">
                            Kitisuru SDA Church is more than a congregation — we are a family. We gather each Sabbath to worship, study, serve, and grow together.
                        </p>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="rounded-3xl bg-white p-7 shadow-card">
                            <h3 className="text-xl font-semibold text-forest-950">Our ministries</h3>
                            <ul className="mt-4 space-y-3 text-ink/75">
                                {ministries.map((item) => (
                                    <li key={item} className="flex items-start gap-3">
                                        <span className="mt-2 size-2 shrink-0 rotate-45 rounded-sm bg-marigold-500" aria-hidden="true" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="rounded-3xl bg-white p-7 shadow-card">
                            <h3 className="text-xl font-semibold text-forest-950">Service times</h3>
                            <div className="mt-4 divide-y divide-forest-950/10">
                                {serviceTimes.map((item) => (
                                    <div key={item.name} className="py-3 first:pt-0 last:pb-0">
                                        <p className="text-xs font-semibold tracking-[0.16em] text-clay-600 uppercase">{item.name}</p>
                                        <p className="mt-1 font-display text-2xl font-medium text-forest-950">{item.time}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* History and global impact */}
            <section>
                <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 md:grid-cols-2 lg:py-28">
                    <div>
                        <span className="grid size-14 place-items-center rounded-3xl bg-marigold-100 text-marigold-600">
                            <History className="size-7" strokeWidth={1.5} />
                        </span>
                        <h2 className="mt-6 text-3xl font-semibold text-forest-950">Our history</h2>
                        <p className="mt-4 leading-relaxed text-ink/70">
                            The Seventh-day Adventist Church began in the mid-19th century during the Second Great Awakening in North America and has since grown into a worldwide movement. Kitisuru SDA Church was established to serve our local community with love, truth, and service.
                        </p>
                    </div>
                    <div>
                        <span className="grid size-14 place-items-center rounded-3xl bg-forest-50 text-forest-900">
                            <Globe className="size-7" strokeWidth={1.5} />
                        </span>
                        <h2 className="mt-6 text-3xl font-semibold text-forest-950">Global church, local impact</h2>
                        <p className="mt-4 leading-relaxed text-ink/70">
                            We are part of a global denomination with over 22 million members worldwide. The SDA Church operates thousands of schools, hospitals, and humanitarian agencies that serve people of all faiths — and none — across the globe.
                        </p>
                    </div>
                </div>
            </section>

            {/* Closing call to action: the notch with the church emblem */}
            <section className="relative bg-forest-950 text-white">
                <div
                    className="absolute top-0 left-1/2 h-24 w-56 -translate-x-1/2 bg-cream"
                    style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
                    aria-hidden="true"
                />
                <img src="/logo-icon.png" alt="" className="absolute top-2 left-1/2 size-14 -translate-x-1/2" />
                <div className="mx-auto max-w-3xl px-5 pt-36 pb-20 text-center sm:px-8">
                    <h2 className="text-4xl leading-tight font-semibold sm:text-5xl">
                        Come and be part of the <span className="text-marigold-400 italic">family</span>
                    </h2>
                    <p className="mt-5 text-lg text-white/70">Every Sabbath morning. Come as you are, and bring a friend.</p>
                    <div className="mt-9 flex flex-wrap justify-center gap-3">
                        <a
                            href="https://www.google.com/maps/search/?api=1&query=Kitisuru+SDA+Church"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-full bg-marigold-500 px-7 py-3.5 font-semibold text-forest-950 transition hover:bg-marigold-400 active:translate-y-px"
                        >
                            <MapPin className="size-4" />
                            Get directions
                        </a>
                        <Link
                            to="/getinvolved"
                            className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3.5 font-semibold text-white transition hover:border-white hover:bg-white/10 active:translate-y-px"
                        >
                            Get involved <ArrowRight className="size-4" />
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default About

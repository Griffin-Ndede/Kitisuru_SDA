import React from 'react'
import { Link } from 'react-router'

// The dark footer of every public page: logo, links, the map and the verse.
function Footer() {
    return (
        <footer className="site-theme border-t border-white/10 bg-forest-950 text-white">
            <div className="mx-auto max-w-7xl px-5 pt-16 pb-8 sm:px-8">
                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12">
                    <div className="lg:col-span-3">
                        <Link to="/" className="flex items-center gap-3">
                            <img src="/logo-icon.png" alt="" className="size-11 rounded-xl bg-white p-1" />
                            <span className="leading-tight">
                                <span className="block font-display text-xl font-semibold">Kitisuru</span>
                                <span className="block text-[0.7rem] font-semibold tracking-[0.2em] text-white/60 uppercase">SDA Church</span>
                            </span>
                        </Link>
                        <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/70">
                            A welcoming Seventh-day Adventist community dedicated to sharing God&apos;s love.
                        </p>
                    </div>

                    <div className="lg:col-span-2">
                        <h3 className="font-sans text-xs font-semibold tracking-[0.2em] text-white/50 uppercase">Explore</h3>
                        <ul className="mt-5 space-y-3 text-sm">
                            <li><Link to="/about" className="text-white/80 transition hover:text-marigold-400">Who we are</Link></li>
                            <li><Link to="/getinvolved" className="text-white/80 transition hover:text-marigold-400">Get involved</Link></li>
                            <li><Link to="/giving" className="text-white/80 transition hover:text-marigold-400">Give online</Link></li>
                            <li><Link to="/contact" className="text-white/80 transition hover:text-marigold-400">Get in touch</Link></li>
                        </ul>
                    </div>

                    <div className="lg:col-span-2">
                        <h3 className="font-sans text-xs font-semibold tracking-[0.2em] text-white/50 uppercase">Members</h3>
                        <ul className="mt-5 space-y-3 text-sm">
                            <li><Link to="/signin" className="text-white/80 transition hover:text-marigold-400">Sign in</Link></li>
                            <li><Link to="/join" className="text-white/80 transition hover:text-marigold-400">Create an account</Link></li>
                            <li><Link to="/privacy" className="text-white/80 transition hover:text-marigold-400">Privacy</Link></li>
                        </ul>
                    </div>

                    <div className="md:col-span-2 lg:col-span-5">
                        <h3 className="font-sans text-xs font-semibold tracking-[0.2em] text-white/50 uppercase">Find us</h3>
                        <iframe
                            title="Map to Kitisuru SDA Church"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1388.0664428512541!2d36.75646564290673!3d-1.2255396003921943!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f197536c093d1%3A0x9030e99db5586283!2sKitisuru%20SDA%20Church!5e1!3m2!1sen!2ske!4v1762853012881!5m2!1sen!2ske"
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="mt-5 h-52 w-full rounded-3xl border border-white/10"
                        />
                    </div>
                </div>

                <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
                    <p>&copy; {new Date().getFullYear()} Seventh Day Adventist Church Kitisuru. All rights reserved.</p>
                    <p className="font-display text-sm text-marigold-400 italic">&ldquo;Remember the Sabbath day, to keep it holy.&rdquo; Exodus 20:8</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer

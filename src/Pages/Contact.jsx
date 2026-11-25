import React from 'react'
import { useState } from 'react';

import { motion } from 'framer-motion'
import Footer from '../Components/Footer'
import Navbar from '../Components/Navbar'
import Swal from 'sweetalert2'
import { Clock, Facebook, Instagram, Mail, MapPin, Phone, Youtube } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'general',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    Swal.fire({
      title: 'Thank you!',
      text: 'Thank you for your message! We will get back to you soon.',
      icon: 'success',
      iconColor: '#2e8eb4', // the website's blue
      confirmButtonText: 'OK',
      confirmButtonColor: '#2e8eb4',
    });
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: 'general',
      message: ''
    });
  };

  return (
    <div className="site-theme min-h-screen overflow-x-clip">
      <Navbar />

      {/* Header */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-5 pt-12 pb-14 sm:px-8 lg:pt-20 lg:pb-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <p className="text-xs font-semibold tracking-[0.22em] text-clay-600 uppercase">Contact</p>
            <h1 className="mt-4 text-5xl leading-[1.05] font-semibold text-forest-950 sm:text-6xl">
              We&apos;d love to{' '}
              <span className="relative inline-block text-forest-900">
                hear from you
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
              Reach out with questions, or to learn more about our ministries and our programs.
            </p>
          </motion.div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:pb-28">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Contact form */}
          <div className="rounded-3xl bg-white p-7 shadow-card sm:p-10 lg:col-span-2">
            <h2 className="text-3xl font-semibold text-forest-950">Send us a message</h2>
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
                  Your name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="input"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="mb-1.5 block text-sm font-medium">
                    Phone number (optional)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="mb-1.5 block text-sm font-medium">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="general">General Inquiry</option>
                  <option value="prayer">Prayer Request</option>
                  <option value="ministry">Ministry Information</option>
                  <option value="event">Event Questions</option>
                  <option value="giving">Giving Questions</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
                  Your message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="input"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-forest-900 px-6 py-3.5 font-semibold text-white shadow-card transition hover:bg-forest-800 active:translate-y-px sm:w-auto"
              >
                Send message
              </button>
            </form>
          </div>

          {/* Contact information */}
          <aside className="h-fit rounded-3xl bg-forest-950 p-7 text-white sm:p-10">
            <h2 className="text-3xl font-semibold">Our information</h2>
            <ul className="mt-8 space-y-7">
              <li className="flex gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-3xl bg-white/10 text-marigold-400">
                  <MapPin className="size-5" />
                </span>
                <span>
                  <span className="block text-xs font-semibold tracking-[0.16em] text-white/50 uppercase">Physical address</span>
                  <span className="mt-1 block leading-relaxed text-white/90">
                    Seventh Day Adventist <br />
                    Church Kitisuru<br />
                    Kirawa rd, Kitisuru
                  </span>
                </span>
              </li>
              <li className="flex gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-3xl bg-white/10 text-marigold-400">
                  <Clock className="size-5" />
                </span>
                <span>
                  <span className="block text-xs font-semibold tracking-[0.16em] text-white/50 uppercase">Service times</span>
                  <span className="mt-1 block leading-relaxed text-white/90">
                    Saturday: 9:00am to 5:00pm<br />
                    Friday Vespers: 8:00pm
                  </span>
                </span>
              </li>
              <li className="flex gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-3xl bg-white/10 text-marigold-400">
                  <Phone className="size-5" />
                </span>
                <span>
                  <span className="block text-xs font-semibold tracking-[0.16em] text-white/50 uppercase">Phone</span>
                  <span className="mt-1 block text-white/90">(123) 456-7890</span>
                </span>
              </li>
              <li className="flex gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-3xl bg-white/10 text-marigold-400">
                  <Mail className="size-5" />
                </span>
                <span>
                  <span className="block text-xs font-semibold tracking-[0.16em] text-white/50 uppercase">Email</span>
                  <a href="mailto:kitisurusda@gmail.com" className="mt-1 block break-all text-white/90 hover:text-marigold-400">
                    kitisurusda@gmail.com
                  </a>
                </span>
              </li>
            </ul>
            <div className="mt-9 border-t border-white/10 pt-7">
              <p className="text-xs font-semibold tracking-[0.16em] text-white/50 uppercase">Follow us</p>
              <div className="mt-4 flex gap-3">
                <a href="#" aria-label="Facebook" className="grid size-11 place-items-center rounded-full bg-white/10 transition hover:bg-marigold-500 hover:text-forest-950">
                  <Facebook className="size-5" />
                </a>
                <a
                  href="https://youtube.com/@sdachurchkitisuru?si=G-N85sdrGISWHe-g"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="grid size-11 place-items-center rounded-full bg-white/10 transition hover:bg-marigold-500 hover:text-forest-950"
                >
                  <Youtube className="size-5" />
                </a>
                <a href="#" aria-label="Instagram" className="grid size-11 place-items-center rounded-full bg-white/10 transition hover:bg-marigold-500 hover:text-forest-950">
                  <Instagram className="size-5" />
                </a>
              </div>
            </div>
          </aside>
        </div>

        {/* Map */}
        <div className="mt-8 rounded-3xl bg-white p-4 shadow-card sm:p-6">
          <iframe
            title="Map to Kitisuru SDA Church"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1388.0664428512541!2d36.75646564290673!3d-1.2255396003921943!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f197536c093d1%3A0x9030e99db5586283!2sKitisuru%20SDA%20Church!5e1!3m2!1sen!2ske!4v1762853012881!5m2!1sen!2ske"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            className="rounded-3xl"
          ></iframe>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;

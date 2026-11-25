import React, { useState } from 'react';
import { Link, useLoaderData } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Calendar, HandHeart, MapPin, Play, Sunrise, Youtube } from 'lucide-react';
import Footer from '../Components/Footer';
import Navbar from '../Components/Navbar';
import videoBg from '../assets/nature video.mp4';

function Home() {
  const { youtubeContent, upcomingEvents } = useLoaderData();
  const [fullscreenImage, setFullscreenImage] = useState(null);

  // The Sabbath programme, shown as a row of cells under the hero.
  const scheduleItems = [
    { title: 'Sabbath School', time: '9:00 am', until: 'to 9:20 am' },
    { title: 'Lesson discussion', time: '9:20 am', until: 'to 10:20 am' },
    { title: 'Divine Service', time: '10:45 am', until: 'to 12:20 pm' },
    { title: 'Bible study', time: '2:30 pm', until: 'to 4:00 pm' },
  ];

  // What we hold to, in the "Who we are" section.
  const values = [
    {
      Icon: Sunrise,
      title: 'The Sabbath',
      text: 'Every seventh day we set work aside to rest, worship and be together, as God asked.',
    },
    {
      Icon: BookOpen,
      title: 'The Bible',
      text: 'We read it, study it and let it shape how we live, in Sabbath School and all week.',
    },
    {
      Icon: HandHeart,
      title: 'Serving people',
      text: 'Our ministries and groups care for families, young people and neighbours near and far.',
    },
  ];

  const cloudName = 'dfycvaiv7';
  const imageUrl = `https://res.cloudinary.com/${cloudName}`;

  const futureEvents = upcomingEvents
    .filter((event) => new Date(event.end_date) > new Date())
    .sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
  const [featuredEvent, ...otherEvents] = futureEvents;

  const formatDate = (value) =>
    new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  // Pulls the video id out of any YouTube link
  const getYoutubeVideoId = (url) => {
    if (!url) return null;
    const regExp = /(?:youtube\.com\/(?:watch\?v=|embed\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const handleOpenImage = (src) => setFullscreenImage(src);
  const handleCloseImage = () => setFullscreenImage(null);

  return (
    <div className="site-theme min-h-screen overflow-x-clip">
      <Navbar />

      {/* Hero */}
      <section className="relative">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pt-12 pb-20 sm:px-8 lg:grid-cols-2 lg:pt-20 lg:pb-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <p className="text-xs font-semibold tracking-[0.22em] text-clay-600 uppercase">Welcome to Kitisuru SDA</p>
            <h1 className="mt-4 text-5xl leading-[1.05] font-semibold text-forest-950 sm:text-6xl xl:text-7xl">
              Worship with us <br className="hidden sm:block" />
              this{' '}
              <span className="relative inline-block text-forest-900">
                Sabbath
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
            <p className="mt-8 max-w-md text-lg leading-relaxed text-ink/70">
              &ldquo;Remember the Sabbath day, to keep it holy.&rdquo;
              <span className="mt-1 block text-sm font-semibold tracking-wide text-ink/50">Exodus 20:8</span>
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Kitisuru+SDA+Church"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-forest-900 px-6 py-3.5 font-semibold text-white shadow-card transition hover:bg-forest-800 active:translate-y-px"
              >
                <MapPin className="size-4" />
                Get directions
              </a>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-full border border-forest-950/15 bg-white px-6 py-3.5 font-semibold text-forest-950 transition hover:border-forest-900 active:translate-y-px"
              >
                Who we are
              </Link>
            </div>

            {/* hand-drawn spiral arrow */}
            <svg
              className="doodle-float absolute -bottom-24 left-0 hidden h-28 w-28 text-forest-950 lg:block"
              style={{ '--tilt': '-6deg' }}
              viewBox="0 0 120 120"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M14 18 C 4 52, 20 100, 62 100 C 92 100, 92 62, 66 66 C 46 69, 50 92, 72 90 C 82 89, 92 84, 100 76"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path d="M88 70 L102 76 L94 90" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative mx-auto w-full max-w-lg lg:max-w-none"
          >
            {/* the coloured shapes behind the picture */}
            <div className="absolute -inset-3 -rotate-6 rounded-3xl bg-marigold-500 sm:-inset-4" aria-hidden="true" />
            <div className="absolute inset-0 rotate-3 rounded-3xl bg-forest-900/90" aria-hidden="true" />
            <div className="relative aspect-4/3 overflow-hidden rounded-3xl bg-forest-950 shadow-lift sm:aspect-5/4">
              {/* picture for small screens, video for larger ones */}
              <img
                src="https://media.istockphoto.com/id/522403165/photo/praying-hands-with-bible.jpg?s=612x612&w=0&k=20&c=-5H0OP-7GKsglDbxalhBUl9klbhImkXjJrsTl7p52J0="
                alt="Praying hands resting on an open Bible"
                className="block size-full object-cover sm:hidden"
              />
              <video
                src={videoBg}
                autoPlay
                loop
                muted
                playsInline
                aria-hidden="true"
                className="hidden size-full object-cover sm:block"
              />
            </div>

            {/* a small card floating over the picture */}
            <div className="doodle-float absolute -bottom-6 -left-2 flex items-center gap-3 rounded-3xl bg-white px-4 py-3 shadow-lift sm:-left-8" style={{ '--tilt': '-2deg' }}>
              <span className="grid size-10 place-items-center rounded-full bg-marigold-100 text-marigold-600">
                <Sunrise className="size-5" />
              </span>
              <span className="leading-tight">
                <span className="block text-xs text-muted">Every Sabbath</span>
                <span className="block font-display text-lg font-semibold text-forest-950">Divine Service 10:45 am</span>
              </span>
            </div>

            {/* squiggle */}
            <svg
              className="absolute -top-8 right-6 hidden h-8 w-28 sm:block"
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

        {/* Service times, in cells */}
        <div id="services" className="border-y border-cream-deep">
          <div className="mx-auto grid max-w-7xl grid-cols-2 lg:grid-cols-4">
            {scheduleItems.map((item, index) => (
              <div
                key={item.title}
                className={`border-cream-deep px-5 py-7 sm:px-8 ${index % 2 === 0 ? 'border-r' : ''} ${index < 2 ? 'border-b lg:border-b-0' : ''} ${index < 3 ? 'lg:border-r' : ''}`}
              >
                <p className="text-xs font-semibold tracking-[0.18em] text-clay-600 uppercase">{item.title}</p>
                <p className="mt-2 font-display text-3xl font-medium text-forest-950">{item.time}</p>
                <p className="text-sm text-ink/50">{item.until}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who we are */}
      <section className="bg-cream-deep/70">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
            className="relative mx-auto h-96 w-full max-w-md sm:h-[28rem]"
          >
            {/* arch picture, with a diamond overlapping it */}
            <div className="arch absolute top-0 right-0 h-[85%] w-[72%] overflow-hidden bg-forest-950 shadow-lift">
              <img
                src="https://media.istockphoto.com/id/522403165/photo/praying-hands-with-bible.jpg?s=612x612&w=0&k=20&c=-5H0OP-7GKsglDbxalhBUl9klbhImkXjJrsTl7p52J0="
                alt="Praying hands resting on an open Bible"
                className="size-full object-cover"
              />
            </div>
            <div
              className="absolute bottom-0 left-0 grid size-44 place-items-center bg-marigold-500 sm:size-52"
              style={{ clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)' }}
              aria-hidden="true"
            >
              <img src="/logo-icon.png" alt="" className="size-16 rounded-xl sm:size-20" />
            </div>
            <div className="absolute top-[58%] left-[8%] size-6 rotate-45 rounded-sm bg-forest-900" aria-hidden="true" />
          </motion.div>

          <div>
            <p className="text-xs font-semibold tracking-[0.22em] text-clay-600 uppercase">Who we are</p>
            <h2 className="mt-3 text-4xl leading-tight font-semibold text-forest-950 sm:text-5xl">
              A church family rooted in the Word
            </h2>
            <ul className="mt-9 divide-y divide-forest-950/10 border-y border-forest-950/10">
              {values.map((value) => (
                <li key={value.title} className="flex gap-5 py-6">
                  <span className="grid size-12 shrink-0 place-items-center rounded-3xl bg-white text-forest-900 shadow-card">
                    <value.Icon className="size-6" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold tracking-[0.14em] text-forest-950 uppercase">
                      {value.title}
                    </span>
                    <span className="mt-1.5 block leading-relaxed text-ink/70">{value.text}</span>
                  </span>
                </li>
              ))}
            </ul>
            <Link
              to="/about"
              className="mt-8 inline-flex items-center gap-2 font-semibold text-forest-900 transition hover:gap-3"
            >
              Learn more about us <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming events, on navy */}
      <section id="upcoming" className="relative overflow-hidden bg-forest-950 text-white">
        <svg
          className="absolute -top-6 right-0 h-40 w-72 text-marigold-500"
          viewBox="0 0 300 160"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M300 0 L300 140 C 250 110, 215 150, 170 118 C 130 90, 120 40, 40 30 C 80 12, 150 20, 200 8 C 240 -2, 270 12, 300 0 Z" />
        </svg>
        <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          <p className="text-xs font-semibold tracking-[0.22em] text-marigold-400 uppercase">Events and programs</p>
          <h2 className="mt-3 text-4xl font-semibold sm:text-5xl">Upcoming events</h2>
          <p className="mt-3 max-w-xl text-white/70">Keep up to date with what is happening at church.</p>

          {!featuredEvent ? (
            <div className="mt-12 flex flex-col items-center rounded-3xl bg-cream px-6 py-14 text-center text-ink">
              <span className="grid size-14 place-items-center rounded-full bg-marigold-100 text-marigold-600">
                <Calendar className="size-7" />
              </span>
              <h3 className="mt-4 text-2xl font-semibold text-forest-950">No events yet</h3>
              <p className="mt-2 max-w-sm text-ink/70">New events will show up here as soon as they are announced.</p>
            </div>
          ) : (
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              <article className="flex flex-col overflow-hidden rounded-3xl bg-cream text-ink lg:col-span-2 lg:flex-row">
                {featuredEvent.image && (
                  <button
                    type="button"
                    className="block h-64 shrink-0 overflow-hidden lg:h-auto lg:w-2/5"
                    aria-label={`View the picture for ${featuredEvent.title}`}
                    onClick={() => handleOpenImage(`${imageUrl}/${featuredEvent.image}`)}
                  >
                    <img
                      src={`${imageUrl}/${featuredEvent.image}`}
                      alt={featuredEvent.title}
                      className="size-full object-cover transition duration-500 hover:scale-105"
                    />
                  </button>
                )}
                <div className="flex flex-1 flex-col p-7 sm:p-9">
                  <span className="w-fit rounded-3xl bg-clay-100 px-2.5 py-1 text-xs font-semibold text-clay-700">
                    Next up{featuredEvent.ministry_title ? ` · ${featuredEvent.ministry_title}` : ''}
                  </span>
                  <h3 className="mt-4 text-3xl leading-tight font-semibold text-forest-950">{featuredEvent.title}</h3>
                  <p className="mt-3 line-clamp-4 leading-relaxed text-ink/70">{featuredEvent.description}</p>
                  <div className="mt-auto space-y-2 border-t border-forest-950/10 pt-5 text-sm text-ink/80">
                    <p className="flex items-center gap-2.5">
                      <Calendar className="size-4 text-forest-900" />
                      {formatDate(featuredEvent.start_date)} – {formatDate(featuredEvent.end_date)}
                    </p>
                    {featuredEvent.location && (
                      <p className="flex items-center gap-2.5">
                        <MapPin className="size-4 text-forest-900" />
                        {featuredEvent.location}
                      </p>
                    )}
                  </div>
                </div>
              </article>

              <div className="flex flex-col gap-6">
                {otherEvents.map((event) => (
                  <article key={event.id ?? event.title} className="flex gap-4 rounded-3xl bg-cream p-5 text-ink">
                    {event.image && (
                      <button
                        type="button"
                        className="size-20 shrink-0 overflow-hidden rounded-3xl"
                        aria-label={`View the picture for ${event.title}`}
                        onClick={() => handleOpenImage(`${imageUrl}/${event.image}`)}
                      >
                        <img src={`${imageUrl}/${event.image}`} alt="" className="size-full object-cover" />
                      </button>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs text-ink/50">{formatDate(event.start_date)}</p>
                      <h3 className="truncate text-lg font-semibold text-forest-950">{event.title}</h3>
                      {event.location && <p className="mt-1 truncate text-sm text-ink/70">{event.location}</p>}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Video gallery */}
      <section id="videos">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.22em] text-clay-600 uppercase">In case you missed it</p>
              <h2 className="mt-3 text-4xl font-semibold text-forest-950 sm:text-5xl">From the pulpit</h2>
            </div>
            <a
              href="https://www.youtube.com/@SDAchurchKitisuru"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-semibold text-forest-900 transition hover:gap-3"
            >
              <Youtube className="size-5" />
              All videos on YouTube <ArrowRight className="size-4" />
            </a>
          </div>

          {youtubeContent.length === 0 ? (
            <div className="mt-12 flex flex-col items-center rounded-3xl bg-white px-6 py-14 text-center shadow-card">
              <span className="grid size-14 place-items-center rounded-full bg-forest-50 text-forest-900">
                <Play className="size-7" />
              </span>
              <h3 className="mt-4 text-2xl font-semibold text-forest-950">No videos yet</h3>
              <p className="mt-2 max-w-sm text-ink/70">Please check back later, or watch on our YouTube channel.</p>
            </div>
          ) : (
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {youtubeContent.map((video) => {
                const videoId = getYoutubeVideoId(video.youtube_url);
                return (
                  <div
                    key={video.id}
                    className="overflow-hidden rounded-3xl bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lift"
                  >
                    <div className="aspect-video">
                      <iframe
                        className="size-full"
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title={video.title}
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    <p className="p-5 font-display text-lg font-semibold text-forest-950">{video.title}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Call to action: a notch with the church emblem, then the dark footer */}
      <section className="relative bg-forest-950 text-white">
        <div
          className="absolute top-0 left-1/2 h-24 w-56 -translate-x-1/2 bg-cream"
          style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
          aria-hidden="true"
        />
        <img src="/logo-icon.png" alt="" className="absolute top-2 left-1/2 size-14 -translate-x-1/2" />
        <div className="mx-auto max-w-3xl px-5 pt-36 pb-20 text-center sm:px-8">
          <h2 className="text-4xl leading-tight font-semibold sm:text-6xl">
            Join us for <span className="text-marigold-400 italic">worship</span>
          </h2>
          <p className="mt-5 text-lg text-white/70">
            Every Sabbath morning. Come as you are, and bring a friend. Or tell us how you would like to serve.
          </p>
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
              Get involved
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      {fullscreenImage && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4"
          role="dialog"
          aria-label="Picture"
          onClick={handleCloseImage}
        >
          <img
            src={fullscreenImage}
            alt="Event"
            onContextMenu={(e) => e.preventDefault()}
            className="max-h-full max-w-full rounded-3xl object-contain"
          />
        </div>
      )}
    </div>
  );
}

export default Home;

import React from 'react';
import { Calendar, MapPin, Play } from 'lucide-react';
import { faBible, faBookOpen, faHandsPraying, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Footer from '../Components/Footer';
import Navbar from '../Components/Navbar';
import videoBg from '../assets/Paint Sweeps Peace - Slow - HD 1080.mp4'
import { useLoaderData } from 'react-router';
import { motion } from 'framer-motion';
import { useState } from 'react';

function Home() {

  const scheduleItems = [
    {
      icon: faBookOpen,
      title: "Sabbath School",
      time: "0900hrs - 0920hrs"
    },
    {
      icon: faUsers,
      title: "Lesson discussion",
      time: "0920hrs - 1020hrs"
    },
    {
      icon: faHandsPraying,
      title: "Divine Service",
      time: "1045hrs - 1220hrs"
    },
    {
      icon: faBible,
      title: "Bible study",
      time: "1430hrs - 1600hrs"
    }
  ];

  const { youtubeContent, upcomingEvents } = useLoaderData()
  const [fullscreenImage, setFullscreenImage] = useState(null);


  const futureEvents = upcomingEvents.filter(
    (event) => new Date(event.end_date) >= new Date()
  );


  if (!youtubeContent) return <p>Loading...</p>;

  console.log(upcomingEvents)

  // Helper function to extract video ID from any YouTube URL
  const getYoutubeVideoId = (url) => {
    if (!url) return null;

    const regExp =
      /(?:youtube\.com\/(?:watch\?v=|embed\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const cloudName = "dfycvaiv7";
  const imageUrl = `https://res.cloudinary.com/${cloudName}`;

  return (
    <>
      <div className="min-h-screen bg-white">
        <Navbar />
        {/* Hero Section */}
        <div className="relative h-screen">
          <div className="absolute inset-0 overflow-hidden">
            {/* Image for small screens */}
            <img
              src="https://media.istockphoto.com/id/522403165/photo/praying-hands-with-bible.jpg?s=612x612&w=0&k=20&c=-5H0OP-7GKsglDbxalhBUl9klbhImkXjJrsTl7p52J0="
              alt="background"
              className="w-full h-full object-cover block sm:hidden"
            />
            {/* Video for larger screens */}
            <video
              src={videoBg}
              autoPlay
              loop
              muted
              className="w-full h-full object-cover hidden sm:block"
            />
          </div>

          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 150 }}
              whileInView={{ opacity: 1, y: 2 }}
              transition={{ duration: 1.5 }}
              viewport={{ once: true }}
              className="max-w-5xl mx-auto px-6 text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-10">
                Welcome to Seventh Day Adventist Church Kitisuru
              </h1>
              <p className="text-4xl font-bold text-white mb-8 leading-10 max-w-xl mx-auto">
                "Remember the Sabbath day, to keep it holy." <br />
                <span className='text-2xl font-light'>Exodus 20:8</span>
              </p>
            </motion.div>
          </div>
        </div>
        {/* Service Times */}
        <section className="py-16 bg-blue-50" id='services'>
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-custom-blue mb-6">Service Times</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4  justify-center items-center gap-8 w-full">
                {scheduleItems.map((item, index) => (
                  <div className="p-8  w-full" key={index}>
                    <FontAwesomeIcon icon={item.icon} className="text-custom-blue mx-auto mb-4 text-5xl" />
                    <h3 className="text-xl font-semibold mb-2 text-black">{item.title}</h3>
                    <p className="text-black font-light text-lg ">{item.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="bg-gray-50" id='upcoming'>
          <div className="container mx-auto px-6 py-10">
            <header className="mb-16 text-center">
              <h1 className="text-5xl font-bold text-custom-blue mb-4">Upcoming events</h1>
              <p className="text-slate-600 text-xl max-w-2xl mx-auto">
                Keep up to date with church events
              </p>
            </header>
            {futureEvents.length === 0 ? (
              <div className="items-center justify-center rounded-3xl p-16 shadow-lg w-fit border-slate-200 mx-auto border text-center ">
                <div className="bg-red-600 rounded-full mb-4 p-4 w-fit mx-auto">
                  <Calendar className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl text-center font-bold text-midnight">No Events Yet!</h3>
                <p className="mt-2 text-center px-3">
                  Looks like there are no upcoming events at the moment.
                </p>
                <span className="text-custom-blue mt-2">Stay tuned — new events will appear here soon!</span>
              </div>
            ) : (
              <div className="flex flex-wrap mx-auto gap-8 h-fit">
                {futureEvents
                  .filter((event) => new Date(event.end_date) >= new Date())
                  .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
                  .map((event, index) => (
                    <div
                      key={index}
                      className="relative bg-white  p-6 rounded-4xl shadow-2xl hover:shadow-3xl transition-shadow duration-300 mx-auto w-fit h-fit md:w-1/3 mb-6"
                    >
                      {/* Category Badge */}
                      <span className="absolute top-4 right-4 bg-blue-100 text-custom-orange text-xs font-bold px-3 py-1 rounded-full">
                        {event.ministry_title}
                      </span>

                      {/* Icon */}
                      <Calendar className="w-8 h-8 text-custom-blue mb-4" />

                      {/* <img
                        src={`${imageUrl}/${event.image}`}
                        alt={event.title}
                        className="h-64 w-fit mx-auto object-cover rounded-2xl shadow-sm mb-4 cursor-pointer"
                        onClick={() => setFullscreenImage(`${imageUrl}/${event.image}`)}
                      /> */}
                      {/* Title */}
                      <h3 className="text-xl font-bold mb-2 text-center">{event.title}</h3>
                      {/* Description */}
                      <p className="font-light mb-6 text-center text-base">{event.description}</p>
                      {/* Location & Dates */}
                      <div className="border-t border-gray-200 w-full pt-4 flex flex-col md:justify-between text-sm text-gray-600">
                        {/* Location */}
                        <div className="flex items-center gap-2 mb-2 md:mb-0">
                          <MapPin strokeWidth={1} size={24} absoluteStrokeWidth className='text-custom-blue' />
                          <span className="font-light text-base">{event.location}</span>
                        </div>
                        {/* Dates */}
                        <div className="flex items-center gap-2">
                          <Calendar strokeWidth={1} size={24} absoluteStrokeWidth className="text-custom-blue" />
                          <span className="text-gray-700">
                            {event.start_date} <span className="text-gray-400">–</span> {event.end_date}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </section>
        {/* 🎥 Video Gallery Section */}
        <section className="min-h-fit bg-white" id="videos">
          <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <header className="mb-16 text-center">
              <h1 className="text-5xl font-bold text-custom-blue mb-4">Video Gallery</h1>
              <p className="text-slate-600 text-xl max-w-2xl mx-auto">
                In case you missed it
              </p>
            </header>
            {youtubeContent.length === 0 ? (
              <div className="items-center justify-center rounded-3xl p-16 shadow-lg w-fit border-slate-200 mx-auto border text-center">
                <div className="bg-red-600 rounded-full mb-4 p-4 w-fit mx-auto">
                  <Play className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-red-600">No Videos Available</h3>
                <p className="mt-2 text-center px-3">
                  There are currently no YouTube links uploaded for this ministry.
                </p>
                <span className="text-custom-blue mt-2">Please check back later.</span>
              </div>
            ) : (
              <div className="gap-8 grid md:grid-cols-3">
                {youtubeContent.map((video, index) => {
                  const videoId = getYoutubeVideoId(video.youtube_url);
                  return (
                    <div
                      key={video.id}
                      className="rounded-3xl overflow-hidden  h-fit border border-slate-200 hover:shadow-2xl transition-all duration-500"
                    >
                      <div className="">
                        {/* 🎞️ Embedded Player */}
                        <div className="relative aspect-video">
                          <iframe
                            className="w-full h-full rounded-none"
                            src={`https://www.youtube.com/embed/${videoId}`}
                            title={video.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      </div>
                      <div className=" p-2 justify-center text-center border-t border-t-slate-200">
                        <h3 className="text-lg font-bold mb-3 w-2/3 mx-auto">
                          {video.title}
                        </h3>
                        <p className=" text-sm mx-auto text-custom-blue leading-relaxed">
                          {video.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
        {
          fullscreenImage && (
            <div
              className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
              onClick={() => setFullscreenImage(null)} // Close when clicked
            >
              <img
                src={fullscreenImage}
                alt="Fullscreen"
                onContextMenu={(e) => e.preventDefault()}
                className="w-full max-h-full object-contain"
              />
            </div>
          )
        }
        <Footer />
      </div>
    </>
  )
}

export default Home

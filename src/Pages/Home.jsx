import React from 'react'
import { Calendar, Heart, Book, Users, ChevronDown, MapPin } from 'lucide-react';
import { faBible, faBookOpen, faHandsPraying, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Footer from '../Components/Footer';
import Navbar from '../Components/Navbar';
import videoBg from '../assets/nature video.mp4'


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

  const upcomingEvents = [
    {
      title: "Youth Camp Meeting",
      description:
        "A weekend of worship, bonding, and adventure for all youth members. Don’t forget your camping gear!",
      startDate: "2025-12-05",
      endDate: "2025-12-08",
      location: "Naivasha Adventist Camp Grounds",
      category: "Youth Ministry"
    },
    {
      title: "Church Music Day",
      description:
        "A day dedicated to praising God through song. Choirs and soloists from across the district will participate.",
      startDate: "2025-11-09",
      endDate: "2025-11-09",
      location: "Nairobi Central SDA Church",
      category: "Music Ministry"
    },
    {
      title: "Community Outreach Sabbath",
      description:
        "Join us in visiting nearby hospitals and children’s homes to share hope and kindness.",
      startDate: "2025-11-23",
      endDate: "2025-11-23",
      location: "Kayole Community Center",
      category: "Outreach"
    },
    {
      title: "Women’s Prayer Breakfast",
      description:
        "An inspiring morning of fellowship, testimonies, and prayer led by the Women’s Ministry department.",
      startDate: "2025-12-14",
      endDate: "2025-12-14",
      location: "Parklands SDA Church Hall",
      category: "Women's Ministry"
    },
    {
      title: "Pathfinder Hike and Adventure",
      description:
        "Pathfinders will explore Karura Forest in this year’s adventure outing — filled with teamwork and fun challenges.",
      startDate: "2026-01-18",
      endDate: "2026-01-19",
      location: "Karura Forest, Nairobi",
      category: "Pathfinder Club"
    }
  ];

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
            <div className="max-w-5xl mx-auto px-6 text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-10">
                Welcome to Seventh Day Adventist Church Kitisuru
              </h1>
              <p className="text-4xl font-bold text-white mb-8 leading-10 max-w-xl mx-auto">
                "Remember the Sabbath day, to keep it holy." <br />
                <span className='text-2xl font-light'>Exodus 20:8</span>
              </p>
            </div>
          </div>
        </div>
        {/* Service Times */}
        <section className="py-16 bg-blue-50" id='services'>
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-blue-600 mb-6">Service Times</h2>
              <div className="flex flex-col md:flex-row justify-center items-center gap-8 w-full">
                {scheduleItems.map((item, index) => (
                  <div className="p-8  w-full" key={index}>
                    <FontAwesomeIcon icon={item.icon} className="text-blue-600 mx-auto mb-4 text-5xl" />
                    <h3 className="text-xl font-semibold mb-2 text-black">{item.title}</h3>
                    <p className="text-black font-light text-lg ">{item.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        {/* Ministries */}
        {/* <section className="py-16" id='ministries'>
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-blue-600 mb-12">Our Ministries</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center rounded-4xl p-4 shadow-2xl">
                <Users strokeWidth={1.5} className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2  mx-auto">Community Outreach</h3>
                <p className="text-gray-600 font-light">Serving our community through various programs and initiatives.</p>
              </div>
              <div className="text-center  rounded-4xl p-4 shadow-2xl">
                <Heart strokeWidth={1.5} className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2  mx-auto">Health Ministry</h3>
                <p className="text-gray-600 font-light">Promoting wholistic health and wellness through education and support.</p>
              </div>
              <div className="text-center rounded-4xl p-4 shadow-2xl">
                <Book strokeWidth={1.5} className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2  mx-auto">Bible Study</h3>
                <p className="text-gray-600 font-light">Deep dive into Scripture through various study groups and classes.</p>
              </div>
            </div>
          </div>
        </section> */}
        {/* Upcoming Events */}

        <section className="bg-gray-50" id='upcoming'>
          <div className="container mx-auto px-6 py-10">
            <h2 className="text-3xl font-bold text-center text-blue-600 mb-12">Upcoming Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {upcomingEvents
                .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
                .map((event, index) => (
                  <div
                    key={index}
                    className="relative bg-white p-6 rounded-4xl shadow-2xl hover:shadow-3xl transition-shadow duration-300"
                  >
                    {/* Category Badge */}
                    <span className="absolute top-4 right-4 bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                      {event.category}
                    </span>

                    {/* Icon */}
                    <Calendar className="w-8 h-8 text-blue-600 mb-4" />

                    {/* Title */}
                    <h3 className="text-xl font-bold mb-2">{event.title}</h3>

                    {/* Description */}
                    <p className=" mb-6">{event.description}</p>

                    {/* Location & Dates */}
                    <div className="border-t border-gray-100 pt-4 flex flex-col md:flex-row md:items-center md:justify-between text-sm text-gray-600">
                      {/* Location */}
                      <div className="flex items-center gap-2 mb-2 md:mb-0">
                        <MapPin strokeWidth={1} size={24} absoluteStrokeWidth className='text-blue-600' />
                        <span className="font-light text-base">{event.location}</span>
                      </div>

                      {/* Dates */}
                      <div className="flex items-center gap-2">
                        <Calendar strokeWidth={1} size={24} absoluteStrokeWidth className="text-blue-600" />
                        <span className="text-gray-700">
                          {event.startDate} <span className="text-gray-400">–</span> {event.endDate}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>
        <section className="min-h-fit bg-gray-200 p-6 sm:p-10">
          <h1 className="text-center font-bold text-3xl sm:text-4xl text-blue-600 mb-8">
            Latest Sermons
          </h1>

          {/* Sermon Item */}
          {Array(4).fill(0).map((_, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10 mx-auto justify-center mt-6 bg-white/50 rounded-3xl p-6 shadow-sm"
            >
              <video
                src={videoBg}
                autoPlay
                loop
                muted
                className="w-full sm:w-96 h-56 sm:h-fit rounded-3xl object-cover"
              />
              <div className="flex flex-col items-center sm:items-start gap-4 sm:w-1/2">
                <h2 className="font-semibold text-lg sm:text-xl text-gray-800 text-center sm:text-left">
                  Title: Lorem ipsum dolor sit amet.
                </h2>
                <p className="bg-blue-100 p-4 sm:p-6 rounded-2xl text-gray-700 leading-relaxed text-sm sm:text-base text-center sm:text-left">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit dicta veritatis
                  doloremque quaerat, dolorum corrupti omnis rerum quo natus placeat illo. Dicta quas
                  asperiores laborum sequi rem illum autem suscipit in! Inventore nisi architecto vero.
                  Adipisci obcaecati exercitationem, totam cum unde vero labore id eos a alias? Qui,
                  dolorum ullam.
                </p>
              </div>
            </div>
          ))}
        </section>

        <Footer />
      </div>
    </>
  )
}

export default Home

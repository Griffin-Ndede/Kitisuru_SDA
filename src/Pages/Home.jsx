import React from 'react'
import { Calendar, Heart, Book, Users, ChevronDown } from 'lucide-react';
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

  return (
    <>
      <div className="min-h-screen bg-white">
        <Navbar />
        {/* Hero Section */}
        <div className="relative h-screen">
          <div className="absolute inset-0 overflow-hidden">
            {/* Image for small screens */}
            <img
              src="https://images.unsplash.com/photo-1601758003122-53c40e686a19"
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
              {/* <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition duration-300 flex items-center gap-2 mx-auto">
                Learn More <ChevronDown size={20} />
              </button> */}
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
        <section className="py-16" id='ministries'>
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
        </section>
        {/* Upcoming Events */}
        <section className="py-16 bg-gray-50" id='upcoming'>
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-blue-600 mb-12">Upcoming Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-4xl shadow-2xl">
                <Calendar className="w-8 h-8 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Youth Camp Meeting</h3>
                <p className="text-gray-600 mb-4">Join us for our annual youth retreat filled with worship, fellowship, and outdoor activities.</p>
                <p className="text-sm text-gray-500">March 15-17, 2024</p>
              </div>
              <div className="bg-white p-6 rounded-4xl shadow-2xl">
                <Calendar className="w-8 h-8 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Health Fair</h3>
                <p className="text-gray-600 mb-4">Free health screenings, nutrition workshops, and wellness seminars for the community.</p>
                <p className="text-sm text-gray-500">April 5, 2024</p>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </>
  )
}

export default Home

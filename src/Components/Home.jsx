import React from 'react'
import { Calendar, Heart, Book, Users, ChevronDown } from 'lucide-react';
import { faBible, faBookOpen, faHandsPraying, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Footer from '../Pages/Footer';
import Navbar from '../Pages/Navbar';

function Home() {
  return (
    <>
      <div className="min-h-screen bg-white">
        <Navbar />
        {/* Hero Section */}
        <div className="relative h-screen">
          <div className="absolute inset-0 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1548094990-c16ca90f1f0d?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Hero"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center">
            <div className="max-w-5xl mx-auto px-6 text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Welcome to Seventh Day Adventist Church Kitisuru
              </h1>
              <p className="text-xl md:text-2xl text-white mb-8">
                Where Faith Meets Community
              </p>
              <button className="bg-white text-blue-900 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition duration-300 flex items-center gap-2 mx-auto">
                Learn More <ChevronDown size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Service Times */}
        <section className="py-16 bg-blue-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-blue-900 mb-6">Service Times</h2>
              <div className="flex flex-col md:flex-row justify-center items-center gap-8 w-full">
                <div className="bg-white p-8 rounded-4xl shadow-2xl w-full">
                  <FontAwesomeIcon icon={faBookOpen} className="text-blue-600 mx-auto mb-4 text-5xl" />
                  <h3 className="text-xl font-semibold mb-2">Sabbath School</h3>
                  <p className="text-gray-600">0900hrs - 0920hrs</p>
                </div>
                <div className="bg-white p-8 rounded-4xl shadow-2xl w-full">
                  <FontAwesomeIcon icon={faUsers} className="text-blue-600 mx-auto mb-4 text-5xl" />
                  <h3 className="text-xl font-semibold mb-2">Lesson discussion</h3>
                  <p className="text-gray-600">0920hrs - 1020hrs</p>
                </div>
                <div className="bg-white p-8 rounded-4xl shadow-2xl w-full">
                  <FontAwesomeIcon icon={faHandsPraying} className="text-blue-600 mx-auto mb-4 text-5xl" />
                  <h3 className="text-xl font-semibold mb-2">Divine Service</h3>
                  <p className="text-gray-600">1045hrs - 1220hrs</p>
                </div>
                <div className="bg-white p-8 rounded-4xl shadow-2xl w-full">
                  <FontAwesomeIcon icon={faBible} className="text-blue-600 mx-auto mb-4 text-5xl" />
                  <h3 className="text-xl font-semibold mb-2">Bible study</h3>
                  <p className="text-gray-600">1430hrs - 1600hrs</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ministries */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">Our Ministries</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Community Outreach</h3>
                <p className="text-gray-600">Serving our community through various programs and initiatives.</p>
              </div>
              <div className="text-center">
                <Heart className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Health Ministry</h3>
                <p className="text-gray-600">Promoting wholistic health and wellness through education and support.</p>
              </div>
              <div className="text-center">
                <Book className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Bible Study</h3>
                <p className="text-gray-600">Deep dive into Scripture through various study groups and classes.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">Upcoming Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-4xl shadow-2xlb">
                <Calendar className="w-8 h-8 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Youth Camp Meeting</h3>
                <p className="text-gray-600 mb-4">Join us for our annual youth retreat filled with worship, fellowship, and outdoor activities.</p>
                <p className="text-sm text-gray-500">March 15-17, 2024</p>
              </div>
              <div className="bg-white p-6 rounded-4xl shadow-2xlb">
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

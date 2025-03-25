import React from 'react'
import { Calendar, Clock, Heart, MapPin, Music, Book, Users, ChevronDown } from 'lucide-react';


function Home() {
  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div
          className="relative h-screen bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1499652848871-1527a310b13a?q=80&w=3474&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-60">
            <div className="max-w-5xl container mx-auto px-6 h-full flex flex-col justify-center items-center text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Welcome to Seventh Day Adventist Church Kitisuru
              </h1>
              <p className="text-xl md:text-2xl text-white mb-8">
                Where Faith Meets Community
              </p>
              <button className="bg-white text-blue-900 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition duration-300 flex items-center gap-2">
                Learn More <ChevronDown size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Service Times */}
        <section className="py-16 bg-blue-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-blue-900 mb-4">Service Times</h2>
              <div className="flex flex-col md:flex-row justify-center items-center gap-8">
                <div className="bg-white p-8 rounded-lg shadow-lg flex-1 max-w-sm">
                  <Clock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Sabbath School</h3>
                  <p className="text-gray-600">Saturday 9:30 AM</p>
                </div>
                <div className="bg-white p-8 rounded-lg shadow-lg flex-1 max-w-sm">
                  <Music className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Worship Service</h3>
                  <p className="text-gray-600">Saturday 11:00 AM</p>
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
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <Calendar className="w-8 h-8 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Youth Camp Meeting</h3>
                <p className="text-gray-600 mb-4">Join us for our annual youth retreat filled with worship, fellowship, and outdoor activities.</p>
                <p className="text-sm text-gray-500">March 15-17, 2024</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <Calendar className="w-8 h-8 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Health Fair</h3>
                <p className="text-gray-600 mb-4">Free health screenings, nutrition workshops, and wellness seminars for the community.</p>
                <p className="text-sm text-gray-500">April 5, 2024</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-blue-900 text-white py-12">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">About Us</h3>
                <p className="text-blue-200">A welcoming Seventh-day Adventist community dedicated to sharing God's love.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Contact</h3>
                <div className="flex items-center gap-2 text-blue-200">
                  <MapPin size={20} />
                  <p>123 Faith Street, City, State 12345</p>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2 text-blue-200">
                  <li><a href="#" className="hover:text-white">Beliefs</a></li>
                  <li><a href="#" className="hover:text-white">Ministries</a></li>
                  <li><a href="#" className="hover:text-white">Events</a></li>
                  <li><a href="#" className="hover:text-white">Give Online</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Connect</h3>
                <p className="text-blue-200">Join us this Sabbath for worship and fellowship.</p>
              </div>
            </div>
            <div className="border-t border-blue-800 mt-8 pt-8 text-center text-blue-200">
              <p>&copy; 2024 Grace Adventist Church. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

export default Home

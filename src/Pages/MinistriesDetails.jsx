import React from 'react';
import { 
  ArrowLeft, Calendar, Clock, MapPin, Users, Phone, Mail, 
  UserPlus, Target, Heart, CheckCircle 
} from 'lucide-react';

export default function MinistriesDetail() {
  const sampleGallery = [
    'https://images.unsplash.com/photo-1601758003122-53c40e686a19',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87'
  ];

  const samplePrograms = [
    { title: "Bible Story Hour", description: "Engaging lessons designed for children aged 5-10.", schedule: "Every Sabbath at 9:00 AM" },
    { title: "Children’s Choir", description: "Developing musical talent through worship songs.", schedule: "Every Wednesday at 4:00 PM" },
  ];

  const sampleEvents = [
    { 
      id: 1, 
      title: "Vacation Bible School", 
      date: "2025-08-10", 
      time: "9:00 AM - 12:00 PM", 
      location: "Church Grounds", 
      description: "A week-long fun and spiritual program for children.", 
      registrationRequired: true 
    },
    { 
      id: 2, 
      title: "Children’s Day Celebration", 
      date: "2025-09-05", 
      time: "10:00 AM - 1:00 PM", 
      location: "Main Sanctuary", 
      description: "A special Sabbath dedicated to children leading worship.", 
      registrationRequired: false 
    }
  ];

  const contacts = [
    {
      name: "Sister Grace Mwangi",
      role: "Children’s Ministry Leader",
      email: "grace.mwangi@example.com",
      phone: "+254 712 345 678",
      photo: "https://randomuser.me/api/portraits/women/65.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <button
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Ministries
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div 
        className="relative h-[400px] bg-cover bg-center"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1601758003122-53c40e686a19')` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center">
          <div className="container mx-auto px-6 text-white max-w-3xl">
            <div className="flex items-center gap-4 mb-4">
              <Heart className="w-8 h-8 text-white" />
              <h1 className="text-4xl font-bold">Children’s Ministry</h1>
            </div>
            <p className="text-xl leading-relaxed">
              Nurturing young hearts in faith through engaging Bible stories, activities, and worship designed for children ages 3–12.
            </p>
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-12">

          {/* Left Column */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Mission */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold">Our Mission</h2>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed">
                To guide children into a loving relationship with Jesus through fun, interactive, and faith-filled experiences that build their spiritual foundation.
              </p>
            </section>

            {/* Programs */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Heart className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold">Our Programs</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {samplePrograms.map((program, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-lg font-semibold mb-3">{program.title}</h3>
                    <p className="text-gray-600 mb-3">{program.description}</p>
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <Clock className="w-4 h-4" />
                      {program.schedule}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Gallery */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Photo Gallery</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {sampleGallery.map((img, index) => (
                  <div key={index} className="aspect-square overflow-hidden rounded-lg">
                    <img 
                      src={img} 
                      alt={`Children Ministry ${index + 1}`} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Events */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold">Upcoming Events</h2>
              </div>
              <div className="space-y-6">
                {sampleEvents.map((event) => (
                  <div key={event.id} className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-600">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <h3 className="text-xl font-semibold">{event.title}</h3>
                      {event.registrationRequired && (
                        <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                          Registration Required
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-4">{event.description}</p>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            
            {/* Meeting Info */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Regular Meetings</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span>Every Sabbath, 9:00 AM</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span>Children’s Chapel</span>
                </div>
              </div>
            </div>

            {/* Contacts */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <UserPlus className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Get Involved</h3>
              </div>
              {contacts.map((c, i) => (
                <div key={i} className="flex items-start gap-4">
                  <img src={c.photo} alt={c.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <h4 className="font-semibold">{c.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{c.role}</p>
                    <div className="space-y-1">
                      <a href={`mailto:${c.email}`} className="flex items-center gap-2 text-blue-600 text-sm">
                        <Mail className="w-4 h-4" /> {c.email}
                      </a>
                      <a href={`tel:${c.phone}`} className="flex items-center gap-2 text-blue-600 text-sm">
                        <Phone className="w-4 h-4" /> {c.phone}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="bg-blue-600 text-white p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6" />
                <h3 className="text-lg font-semibold">Join Our Ministry</h3>
              </div>
              <p className="mb-4 text-blue-100">
                Ready to get involved? Visit us or reach out to our ministry leader.
              </p>
              <button className="w-full bg-white text-blue-600 py-2 px-4 rounded-lg font-semibold hover:bg-blue-50 transition">
                Get Started Today
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

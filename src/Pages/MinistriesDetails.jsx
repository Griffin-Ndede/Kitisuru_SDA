import { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, Clock, MapPin, Users, Phone, Mail, UserPlus, Target, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function MinistriesDetail() {
  const [ministries, setMinistries] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/ministries/ministries/")
      .then((response) => setMinistries(response.data))
      .catch((error) => console.error("Error fetching ministries:", error));
  }, []);

  console.log(ministries);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <Link to='/ministries'>
            <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              Back to Ministries
            </button>
          </Link>
        </div>
      </div>

      {/* Loop through ministries */}
      {ministries.map((ministry) => (
        <div key={ministry.id}>
          {/* Hero Section */}
          <div
            className="relative h-[400px] bg-cover bg-center"
            style={{ backgroundImage: `url(${ministry.image})` }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center">
              <div className="container mx-auto px-6 text-white">
                <div className="flex items-center gap-4 mb-4">
                  <Heart className="w-8 h-8 text-white" />
                  <h1 className="text-4xl font-bold">{ministry.title}</h1>
                </div>
                <p className="text-xl leading-relaxed">{ministry.description}</p>
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
                  <p className="text-gray-600 text-lg leading-relaxed">{ministry.mission}</p>
                </section>

                {/* Programs */}
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <Heart className="w-6 h-6 text-blue-600" />
                    <h2 className="text-2xl font-bold">Our Programs</h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    {ministry.programs?.map((program) => (
                      <div key={program.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
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

                {/* Events */}
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <Calendar className="w-6 h-6 text-blue-600" />
                    <h2 className="text-2xl font-bold">Upcoming Events</h2>
                  </div>
                  <div className="space-y-6">
                    {ministry.events?.map((event) => (
                      <div key={event.id} className="bg-white p-6 rounded-3xl shadow-sm">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                          <h3 className="text-xl font-semibold">{event.title}</h3>
                        </div>
                        <p className="text-gray-600 mb-4">{event.description}</p>
                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <span>
                              {event.start_time} - {event.end_time}
                            </span>
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
                {/* Contacts */}
                <div className="bg-white p-6 rounded-3xl shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <UserPlus className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold">Get Involved</h3>
                  </div>
                  {ministry.contacts?.map((contact) => (
                    <div key={contact.id} className="flex items-start gap-4">
                      <img
                        src={contact.photo || "https://randomuser.me/api/portraits/men/32.jpg"}
                        alt={contact.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-semibold">{contact.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{contact.role}</p>
                        <div className="space-y-1">
                          <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-blue-600 text-sm">
                            <Mail className="w-4 h-4" /> {contact.email}
                          </a>
                          <a href={`tel:${contact.phone}`} className="flex items-center gap-2 text-blue-600 text-sm">
                            <Phone className="w-4 h-4" /> {contact.phone}
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="bg-blue-600 text-white p-6 rounded-3xl">
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="w-6 h-6" />
                    <h3 className="text-lg font-semibold">Join Our Ministry</h3>
                  </div>
                  <p className="mb-4 text-blue-100">
                    Ready to get involved? Visit us or reach out to our ministry leader.
                  </p>
                  <button className="w-full bg-white text-blue-600 py-2 px-4 rounded-3xl font-semibold hover:bg-blue-50 transition">
                    Get Started Today
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

import React from 'react';
import { ArrowLeft, Calendar, Clock, MapPin, Users, Phone, Mail, UserPlus, Target, Heart, Image, CircleCheckBig } from 'lucide-react';
import { Link, useLoaderData, useParams } from 'react-router';

export default function MinistriesDetail() {

  const { ministry } = useLoaderData()

  if (!ministry) {
    return <div className="text-center mt-20">Loading ministry details...</div>;
  }
  const cloudName = "dfycvaiv7";
  const imageUrl = `https://res.cloudinary.com/${cloudName}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <Link to='/ministries'>
            <button className="flex items-center gap-2 text-custom-blue hover:text-custom-blue transition-colors cursor-pointer">
              <ArrowLeft className="w-5 h-5" />
              Back to Ministries
            </button>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div
        className="relative h-[400px] bg-cover bg-center"
      // style={{ backgroundImage: `url(${ministry.image})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center">
          <div className="container mx-auto px-6 text-white">
            <div className="flex items-center gap-4 mb-4">
              <Heart className="w-8 h-8 text-white" />
              <h1 className="text-4xl font-bold">{ministry?.title}</h1>
            </div>
            <p className="text-lg leading-relaxed">{ministry?.mission}</p>
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-12 w-full">
            {/* Mission */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-6 h-6 text-custom-blue" />
                <h2 className="text-2xl font-bold">About us</h2>
              </div>
              <p className=" md:text-lg text-smbase font-light leading-relaxed md:w-5/6">{ministry?.description}</p>
            </section>

            {/* Programs */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Heart className="w-6 h-6 text-custom-blue" />
                <h2 className="text-2xl font-bold">Our Programs</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {ministry.programs?.length > 0 ? (
                  ministry.programs.map((program) => (
                    <div key={program.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                      <h3 className="text-lg font-semibold mb-3">{program.title}</h3>
                      <p className="text-gray-600 mb-3">{program.description}</p>
                      <div className="flex items-center gap-2 text-sm text-custom-blue">
                        <Clock className="w-4 h-4" />
                        {program.schedule}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-3xl py-16 shadow-lg w-full border border-slate-200">
                    <div className="bg-red-600 rounded-full mb-4 p-4">
                      <Calendar className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-red-600">No programs yet for {ministry.title}!</h3>
                    <p className="mt-2 text-center px-3">
                      Looks like there are no programs listed under this ministry.
                    </p>
                    <span className="text-custom-blue mt-2 text-center">Stay tuned — The programs will be updated soon!</span>
                  </div>)}
              </div>
            </section>

            {/* Gallery */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Photo Gallery</h2>
              {ministry.gallery_images?.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-3xl py-16 shadow-lg w-full mx-auto border border-slate-200">
                  <div className="bg-red-600 rounded-full mb-4 p-4">
                    <Image className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-red-600">No Photos available yet for {ministry.title}!</h3>
                  <p className="mt-2 text-center px-3">
                    It looks like we haven&apos;t added any photos for this ministry yet.
                  </p>
                  <span className="text-custom-blue mt-2 text-center">
                    Check back soon—we&apos;ll be uploading new photos shortly!
                  </span>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row gap-4 overflow-x-auto  py-2">
                  {ministry.gallery_images?.map((img, index) => (
                    <div
                      key={index}
                      className="w-full md:w-1/3 md:min-w-[300px] md:h-[300px] rounded-3xl overflow-hidden"
                    >
                      <img
                        src={`${imageUrl}/${img.image}`}
                        className="w-full h-[300px] object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              )}
            </section>


            {/* Events */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="w-6 h-6 text-custom-blue" />
                <h2 className="text-2xl font-bold">Upcoming Events</h2>
              </div>
              <div className="space-y-6">
                {ministry.events?.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-3xl py-16 shadow-lg md:w-2/3 w-full border border-slate-200">
                    <div className="bg-red-600 rounded-full mb-4 p-4">
                      <Calendar className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-red-600">No Events yet for {ministry.title}!</h3>
                    <p className="mt-2 text-center px-3">
                      Looks like there are no upcoming events at the moment.
                    </p>
                    <span className="text-custom-blue mt-2 text-center">Stay tuned — new events will appear here soon!</span>
                  </div>
                ) : (
                  <div className='grid md:grid-cols-2 gap-4 py-2'>
                    {ministry.events
                      ?.sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
                      .map((event) => {
                        const eventEnded = new Date(event.end_date) < new Date();
                        return (
                          <div key={event.id} className="p-6 rounded-3xl shadow-sm mb-4">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                              <h3 className="text-xl font-semibold">{event.title}</h3>

                              {eventEnded && (
                                <div>
                                  <CircleCheckBig size={24} strokeWidth={2} className='text-green-600' />
                                </div>
                              )}
                            </div>

                            <p className="mb-4">{event.description}</p>

                            <div className="flex gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-custom-blue" />
                                <span className='text-custom-blue'>{event.location}</span>
                              </div>

                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-custom-blue" />
                                <span className='text-custom-blue'>
                                  {event.start_date} - {event.end_date}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>

                )}

              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Contacts */}
            <div className="bg-white p-6 rounded-3xl shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <UserPlus className="w-5 h-5 text-custom-blue" />
                <h3 className="text-lg font-semibold">Get in touch</h3>
              </div>
              {ministry.contacts?.map((contact) => (
                <div key={contact.id} className="flex items-start gap-4">
                  <img
                    src='https://static.vecteezy.com/system/resources/previews/039/845/007/non_2x/placeholder-avatar-female-person-default-woman-avatar-image-gray-profile-anonymous-face-picture-illustration-isolated-on-white-vector.jpg'
                    alt={contact.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold">{contact.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{contact.role}</p>
                    <div className="space-y-1">
                      <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-custom-blue text-sm">
                        <Mail className="w-4 h-4" /> {contact.email}
                      </a>
                      <a href={`tel:${contact.phone}`} className="flex items-center gap-2 text-custom-blue text-sm">
                        <Phone className="w-4 h-4" /> {contact.phone}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="bg-custom-blue text-white p-6 rounded-3xl">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6" />
                <h3 className="text-lg font-semibold">Join Our Ministry</h3>
              </div>
              <p className="mb-4 text-blue-100">
                Ready to get involved Visit us or reach out to our ministry leader.
              </p>
              <button className="w-full bg-white text-custom-blue py-2 px-4 rounded-3xl font-semibold hover:bg-blue-50 transition">
                Get Started Today
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

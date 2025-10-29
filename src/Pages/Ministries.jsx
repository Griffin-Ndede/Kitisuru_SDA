
import { Link, useLoaderData } from 'react-router';
import axios from 'axios';
import Navbar from '../Components/Navbar';

const Ministries = () => {
  const {ministries} = useLoaderData();

  const cloudName = "dfycvaiv7";
  const imageUrl = `https://res.cloudinary.com/${cloudName}`;

  return (
    <>
      <Navbar />
      <section className=" min-h-screen pt-20">
        <div className="container mx-auto px-6 md:px-12">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-extrabold text-slate-800 mb-4 tracking-tight mt-12">
              Our Ministries
            </h2>
            <p className="text-lg  max-w-2xl mx-auto">
              Discover opportunities to grow spiritually, serve others, and build lasting connections within our church family.
            </p>
          </div>

          {/* Ministries Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {ministries
              .sort((a, b) => a.title.localeCompare(b.title))
              .map((ministry) => (
                <Link
                  key={ministry.id}
                  to={`/ministries/${ministry.id}/`}>
                  <div
                    className="bg-white rounded-3xl shadow-xl overflow-hidden h-64"
                  >
                    <div className="group relative block rounded-3xl shadow-sm  overflow-hidden">
                      <img
                        src={`${imageUrl}/${ministry.image}`}
                        alt={ministry.title}
                        className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                        <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2">
                          <h3 className="text-xl font-bold text-white line-clamp-2">
                            {ministry.title}
                          </h3>
                          <h3 className="text-sm font-light leading-loose text-white line-clamp-4">
                            {ministry.description}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                  <h3 className="mt-3 font-semibold text-lg px-2 text-center">
                    {ministry.title}
                  </h3>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Ministries;

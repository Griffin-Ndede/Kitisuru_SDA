import { React, useState, useEffect } from 'react';
import {
  Baby, Users, HeartHandshake, BookHeart, Music, Activity,
  Soup, HandHeart, Mic2, CalendarCheck, Phone, Mail
} from 'lucide-react';
import Navbar from '../Components/Navbar';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Ministries = () => {
  // const ministries = [
  //   {
  //     id: 'children',
  //     title: "Children's Ministry",
  //     icon: <Baby className="w-8 h-8" />,
  //     description:
  //       'Nurturing young hearts in faith through engaging Bible stories, songs, and creative activities for children ages 3-12.',
  //     image: 'https://images.unsplash.com/photo-1601758003122-53c40e686a19',
  //     activities: [
  //       'Sabbath School classes (Ages 3–12) - Every Sabbath 9:00–10:30 AM',
  //       'Children’s Choir - Every 2nd & 4th Sabbath 3:00 PM',
  //       'Bible Memory Verses & Games - Every Sabbath Afternoon',
  //     ],
  //     contact: {
  //       name: 'Sister Grace Mwangi',
  //     },
  //   },
  //   {
  //     id: 'pathfinders',
  //     title: 'Pathfinder Club',
  //     icon: <Users className="w-8 h-8" />,
  //     description:
  //       'Empowering young people ages 10–15 through leadership, discipline, outdoor adventure, and service under the Pathfinder law.',
  //     image: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2',
  //     activities: [
  //       'Club Meetings - Sundays 9:00 AM',
  //       'Drill Practice & Camping Skills - Monthly',
  //       'Pathfinder Camporee - July 2025',
  //     ],
  //     contact: {
  //       name: 'Brother David Omondi',
  //     },
  //   },
  //   {
  //     id: 'women',
  //     title: "Women's Ministries",
  //     icon: <HeartHandshake className="w-8 h-8" />,
  //     description:
  //       'Encouraging women to grow spiritually and support one another through prayer, service, and empowerment programs.',
  //     image: 'https://images.unsplash.com/photo-1545231027-637d2f6210f8',
  //     activities: [
  //       'Prayer Breakfast - First Sunday of every month',
  //       'Community Outreach - Wednesdays 3:00 PM',
  //       'Women’s Retreat - September 12–14',
  //     ],
  //     contact: {
  //       name: 'Sister Esther Wambui',
  //     },
  //   },
  //   {
  //     id: 'men',
  //     title: 'Adventist Men’s Organization (AMO)',
  //     icon: <BookHeart className="w-8 h-8" />,
  //     description:
  //       'Developing godly men who lead with integrity through fellowship, mentorship, and acts of service.',
  //     image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
  //     activities: [
  //       'Men’s Prayer Breakfast - Every Friday 6:00 AM',
  //       'Work Projects & Maintenance Days - 3rd Sunday Monthly',
  //       'Father-Son Fellowship - August 18',
  //     ],
  //     contact: {
  //       name: 'Brother James Kamau',
  //     },
  //   },
  //   {
  //     id: 'youth',
  //     title: 'Youths & Young Adults Ministry',
  //     icon: <Activity className="w-8 h-8" />,
  //     description:
  //       'Creating a space for young adults to grow in faith, leadership, and fellowship through worship and community engagement.',
  //     image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
  //     activities: [
  //       'AY Fellowship - Every Sabbath 4:00 PM',
  //       'Youth Bible Study & Discussion - Fridays 6:30 PM',
  //       'Social Sundays - Last Sunday of the Month',
  //     ],
  //     contact: {
  //       name: 'Brother Peter Maina',
  //     },
  //   },
  //   {
  //     id: 'welfare',
  //     title: 'Welfare Ministry',
  //     icon: <HandHeart className="w-8 h-8" />,
  //     description:
  //       'Extending Christ’s compassion through support and practical help to members and the surrounding community.',
  //     image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216',
  //     activities: [
  //       'Food & Clothing Distribution - Last Sunday of each month',
  //       'Visitation & Support for the Sick - Ongoing',
  //       'Member Assistance Fund - Active Throughout the Year',
  //     ],
  //     contact: {
  //       name: 'Sister Ruth Atieno',
  //     },
  //   },
  // ];

  const [ministries, setMinistries] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/ministries/ministries/")
      .then((response) => {
        setMinistries(response.data);
      })
      .catch((error) => {
        console.error("Error fetching ministries:", error);
      });
  }, []);

console.log(ministries)
  return (
    <>
      <Navbar />
      <section className="py-16 bg-slate-200">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-6xl font-bold text-center mb-4 md:mt-32 mt-14">
            Our Ministries
          </h2>
          <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12">
            Opportunities for spiritual growth and service in our church family
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ministries.map((ministry) => (
              <Link to='/ministriesdetail'>
                <div
                  key={ministry.id}
                  className="bg-white rounded-3xl shadow-xl overflow-hidden"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={ministry.image}
                      alt={ministry.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="bg-white p-3 rounded-full">
                        {/* {React.cloneElement(ministry.icon, { className: "w-8 h-8 text-blue-600" })} */}
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{ministry.title}</h3>
                    <p className="text-gray-600 mb-4">{ministry.description}</p>

                    {/* <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-start mb-4">
                      <CalendarCheck className="w-5 h-5 text-blue-600 mt-1 mr-2" />
                      <div>
                        <h4 className="font-semibold mb-2">Upcoming Activities</h4>
                        <ul className="space-y-1">
                          {ministry.activities.map((activity, i) => (
                            <li key={i} className="text-gray-600">{activity}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="mr-2">
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">In Charge</h4>
                        <p className="text-gray-600">{ministry.contact.name}</p>
                      </div>
                    </div>
                  </div> */}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Ministries;
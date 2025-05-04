import React from 'react';
import {
  Baby, Users, HeartHandshake, BookHeart, Music, Activity,
  Soup, HandHeart, Mic2, CalendarCheck, Phone, Mail
} from 'lucide-react';
import Navbar from '../Components/Navbar';

const Ministries = () => {
  const ministries = [
    {
      id: 'children',
      title: 'Children\'s Ministry',
      icon: <Baby className="w-8 h-8" />,
      description: 'Nurturing young hearts in faith through engaging Bible stories, activities, and worship designed for children ages 3-12.',
      image: 'https://images.unsplash.com/photo-1601758003122-53c40e686a19',
      activities: [
        "Sabbath Morning Schedule:",
        "9:00 - 9:30 AM: Communal Sabbath School (Mission Story)",
        "9:30 - 10:30 AM: Individual Sabbath Classes:",
        "1) Beginner's (Below 3 years)",
        "2) Kindergarten (3-4 years)",
        "3) Primary A (5-6 years)",
        "4) Primary B (7-9 years)",
        "5) PowerPoint (10-12 years)",
        "6) Realtime (13-15 years)",
        "7) Cornerstone (16-18 years)",
        "Sabbath Afternoon Schedule (Every 2nd & 4th Sabbaths):",
        "2:30 - 3:00 PM: Bible Study / Memory Verse",
        "3:00 - 3:30 PM: Children’s Choir",
        "3:30 - 4:30 PM: Individual Class Lesson / Activity"
      ],
      
      contact: {
        name: 'Sister Grace Mwangi',
      }
    },
    {
      id: 'youth',
      title: 'Youth & Pathfinder Club',
      icon: <Users className="w-8 h-8" />,
      description: 'Empowering teens through spiritual growth, leadership development, and outdoor adventures in the Pathfinder pledge and law.',
      image: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2',
      activities: [
        'Camporee preparation - Every Sunday',
        'Bible Bowl Competition - August 15',
        'Missionary trip - September 5-7'
      ],
      contact: {
        name: 'Brother David Omondi',
      }
    },
    {
      id: 'women',
      title: 'Women\'s Ministries',
      icon: <HeartHandshake className="w-8 h-8" />,
      description: 'Strengthening and encouraging women in their spiritual journey through fellowship, Bible study, and service projects.',
      image: 'https://images.unsplash.com/photo-1545231027-637d2f6210f8',
      activities: [
        'Monthly prayer breakfast - First Sunday',
        'Women\'s retreat - October 12-14',
        'Community outreach - Every Wednesday'
      ],
      contact: {
        name: 'Sister Esther Wambui',
      }
    },
    {
      id: 'men',
      title: 'Men\'s Ministries',
      icon: <BookHeart className="w-8 h-8" />,
      description: 'Building godly men through accountability, discipleship, and service opportunities in the church and community.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
      activities: [
        'Men\'s prayer meeting - Fridays 6am',
        'Workday projects - Third Sunday',
        'Father/Son campout - November 8-10'
      ],
      contact: {
        name: 'Brother James Kamau',
      }
    },
    {
      id: 'ay',
      title: 'Adventist Youth (AY)',
      icon: <Activity className="w-8 h-8" />,
      description: 'Dynamic programs for young adults including worship, outreach, and social activities centered on Christ.',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
      activities: [
        'AY Program - Every Saturday 4pm',
        'Youth Evangelism Series - August 20-25',
        'Sports Fellowship - Sundays 2pm'
      ],
      contact: {
        name: 'Brother Peter Maina',
      }
    },
    {
      id: 'music',
      title: 'Music Ministry',
      icon: <Music className="w-8 h-8" />,
      description: 'Leading the congregation in worship through music and developing talents for God\'s glory.',
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4',
      activities: [
        'Choir practice - Thursdays 5pm',
        'Music Workshop - August 3',
        'Christmas Cantata rehearsals start Nov 1'
      ],
      contact: {
        name: 'Brother Mark Ngugi',
      }
    },
    {
      id: 'health',
      title: 'Health Ministry',
      icon: <Soup className="w-8 h-8" />,
      description: 'Promoting wholistic health through education, screenings, and lifestyle programs based on biblical principles.',
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528',
      activities: [
        'Cooking classes - Second Sunday',
        'Health Expo - September 14',
        'Walking club - Daily 6am'
      ],
      contact: {
        name: 'Dr. Sarah Kibuchi',
      }
    },
    {
      id: 'community',
      title: 'Community Services',
      icon: <HandHeart className="w-8 h-8" />,
      description: 'Showing Christ\'s love through practical assistance to those in need within our community.',
      image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216',
      activities: [
        'Food distribution - Last Sunday',
        'Clothing drive - Ongoing',
        'Literacy program - Tuesdays 3pm'
      ],
      contact: {
        name: 'Sister Ruth Atieno',
      }
    },
    {
      id: 'outreach',
      title: 'Personal Ministries (Outreach & Evangelism)',
      icon: <Mic2 className="w-8 h-8" />,
      description: 'Equipping members to share their faith through Bible studies, evangelism, and discipleship programs.',
      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136',
      activities: [
        'Door-to-door outreach - Saturdays 10am',
        'Bible study training - August 10',
        'Crusade meetings - October 20-27'
      ],
      contact: {
        name: 'Pastor John Mwangi',
      }
    }
  ];

  return (
    <>
      <Navbar/>
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
                      {React.cloneElement(ministry.icon, { className: "w-8 h-8 text-blue-600" })}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{ministry.title}</h3>
                  <p className="text-gray-600 mb-4">{ministry.description}</p>

                  <div className="mt-4 pt-4 border-t border-gray-100">
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Ministries;
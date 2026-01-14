import React, { useState } from 'react';
import { BookOpen, Droplets, UserPlus, Calendar, MessageSquareText, HandHeart, ChevronRight, X, Baby, } from 'lucide-react';
import Navbar from '../Components/Navbar';
import { Link } from 'react-router';
import ActivityForm from '../forms/Activityform';


function GetInvolved() {

    const [selectedActivity, setSelectedActivity] = useState(null)

    const activities = [
        {
            key: "Child_dedication",
            title: "Child dedication",
            description:
                "If you would like to have your child dedicated at Kitisuru Seventh-day Adventist Church please submit one form per child.",
            buttonText: "Fill out the form",
            icon: <Baby className="w-6 h-6 text-custom-blue" />

        },
        {
            key: "baptism",
            title: "Baptism Interest",
            description:
                "Take the next step in your spiritual journey and learn more about baptism in the Adventist faith.",
            buttonText: "Learn More",
            icon: <Droplets className='w-6 h-6 text-custom-blue' />
        },
        {
            key: "membership_transfer",
            title: "Membership Transfer",
            description:
                "Moving from another Adventist church? We'll help you transfer your membership to our congregation.",
            buttonText: "Start Transfer",
            icon: <UserPlus className='w-6 h-6 text-custom-blue' />
        },
    
    ];

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-200">
                {/* Hero Section */}
                <div
                    className="relative bg-cover bg-center py-24"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://www.briellemag.com/wp-content/uploads/2021/11/gracious-adebayo-AWIyDHiNKk-unsplash-1600x1067.jpg")',
                    }}
                >
                    <div className="container mx-auto px-4 mt-12 md:mt-32">
                        <div className="max-w-3xl mx-auto text-center">
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                Get Involved at Our Church
                            </h1>
                            <p className="text-xl text-gray-200 mb-8">
                                Join our vibrant community and make a difference in God's work
                            </p>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 md:gap-12 md:p-20">
                    {activities.map((activity) => (
                        <div
                            key={activity.key}
                            className="bg-white rounded-4xl shadow-md p-6 transition-all hover:shadow-2xl text-center">
                            <div className="flex items-center mb-4">
                                <div className="bg-blue-50 p-3 rounded-full mx-auto">
                                    {activity.icon}
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-gray-800 text-center">{activity.title}</h3>
                            <p className="text-gray-600 mb-4 text-center">{activity.description}</p>
                            <button
                                onClick={() => setSelectedActivity(activity)}
                                className="flex items-center text-custom-blue hover:text-custom-blue font-medium mx-auto hover:cursor-pointer">
                                {activity.buttonText}
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </button>
                        </div>
                    ))}

                </div>


                {/* popup modal */}
                {selectedActivity && (
                    <div className="fixed inset-0  z-50 md:z-25 flex items-center justify-center bg-black/30 backdrop-blur-xs">
                        <div className="bg-white rounded-4xl shadow-lg p-6 w-full max-w-xl mx-4 sm:mx-6 md:mx-0 relative overflow-y-auto max-h-[90vh]">
                            {/* Close button */}
                            <X
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 hover:cursor-pointer"
                                onClick={() => setSelectedActivity(null)}
                            />

                            {/* Your form */}
                            <ActivityForm
                                activity={selectedActivity}
                                onClose={() => setSelectedActivity(null)}
                            />
                        </div>
                    </div>
                )}


            </div>
            {/* Contact Section */}
            <div className="mt-16 text-center p-10">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    Need More Information?
                </h2>
                <p className="text-gray-600 mb-8">
                    Our pastoral team is here to help you find your place in our church family.
                </p>
                <Link to="/contact">
                    <button className="bg-custom-blue text-white px-8 py-3 rounded-4xl font-medium hover:bg-custom-blue hover:cursor-pointer transition-colors">
                        Contact Us
                    </button>
                </Link>
            </div>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8">
                <div className=" mx-auto px-4 text-center">
                    <p className="mb-4">
                        For where two or three gather in my name, there am I with them. - Mathew 18:20
                    </p>
                </div>
            </footer>
        </>
    );
}

export default GetInvolved;
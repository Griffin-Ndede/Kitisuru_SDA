import React from 'react'
import Footer from '../Components/Footer'
import { Clock, History, } from 'lucide-react';
import { Book, Users, Cross, Heart, Sun, CloudSun, Moon, Church, Target, Globe } from "lucide-react";

import Navbar from '../Components/Navbar';

function About() {


    const coreBeliefs = [
        {
            title: "The Bible",
            description:
                "The inspired, infallible Word of God and our ultimate authority for faith and life.",
            icon: Book,
        },
        {
            title: "The Trinity",
            description:
                "One God in three co-eternal persons: Father, Son, and Holy Spirit.",
            icon: Users,
        },
        {
            title: "Jesus Christ",
            description:
                "Fully God and fully man — the eternal Son who became our Savior.",
            icon: Cross,
        },
        {
            title: "Salvation",
            description:
                "A free gift of grace received through faith in Jesus Christ.",
            icon: Heart,
        },
        {
            title: "The Sabbath",
            description:
                "The seventh day, Saturday — a memorial of creation and rest in God.",
            icon: Sun,
        },
        {
            title: "Second Coming",
            description:
                "We eagerly await the imminent return of Jesus Christ to Earth.",
            icon: CloudSun,
        },
        {
            title: "State of the Dead",
            description:
                "The dead rest unconsciously until the resurrection at Christ’s return.",
            icon: Moon,
        },
    ];


    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50">
                {/* Hero Section */}
                <div className="relative h-[50vh]"> {/* Changed from h-screen to 3/4 viewport height */}
                    <div className="absolute inset-0 overflow-hidden">
                        <img
                            src="https://www.briellemag.com/wp-content/uploads/2021/11/gracious-adebayo-AWIyDHiNKk-unsplash-1600x1067.jpg"
                            alt="prayer"
                            className='w-full h-full object-cover'
                        />
                    </div>
                    <div className="absolute inset-0 bg-black/60 flex items-center">
                        <div className="container mx-auto px-6">
                            <div className="text-white max-w-2xl text-left">
                                <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Kitisuru</h1>
                                <p className="text-lg md:text-xl">A community rooted in Christ, devoted to truth, and driven by service</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mission & Vision */}
                <div className="py-16 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="max-w-3xl mx-auto">
                            <div className="text-center mb-12">
                                <Church strokeWidth={1.5} className="w-12 h-12 mx-auto mb-6 text-blue-600" />
                                <h2 className="text-3xl font-bold mb-8">Our Mission</h2>
                                <blockquote className="text-lg text-gray-600 leading-relaxed italic border-l-4 border-blue-600 pl-4">
                                    Make disciples of Jesus Christ who live as His loving witnesses and proclaim to all people the everlasting gospel of the Three Angels&apos; Messages in preparation for His soon return
                                </blockquote>
                            </div>
                            <div className="text-center mt-16">
                                <Target strokeWidth={1.5} className="w-12 h-12 mx-auto mb-6 text-blue-600" />
                                <h2 className="text-3xl font-bold mb-8">Our Vision</h2>
                                <blockquote className="text-lg text-gray-600 leading-relaxed italic border-l-4 border-blue-600 pl-4">
                                    In harmony with Bible revelation, Seventh-day Adventists see as the climax of God&apos;s plan the restoration of all His creation to full harmony with His perfect will and righteousness.                                </blockquote>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Core Beliefs */}
                <div className="py-16 bg-gray-50">
                    <div className="container mx-auto px-6">
                        <h2 className="text-3xl font-bold text-center mb-12">Our Core Beliefs</h2>
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-10">
                            {coreBeliefs.map((belief, index) => {
                                const Icon = belief.icon
                                return (
                                    <div key={index} className="bg-white p-8 rounded-3xl shadow-2xl text-center">
                                        <Icon strokeWidth={1.5} className="w-10 h-10 mx-auto mb-4 text-blue-600" />
                                        <h3 className="text-xl font-semibold mb-3">{belief.title}</h3>
                                        <p className="text-gray-600">{belief.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Who We Are */}
                <div className="py-16 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="max-w-3xl mx-auto">
                            <div className="text-center mb-12">
                                <Users className="w-12 h-12 mx-auto mb-6 text-blue-600" />
                                <h2 className="text-3xl font-bold mb-8">Who We Are</h2>
                                <p className="text-lg text-gray-600 mb-8">
                                    Kitisuru SDA Church is more than a congregation — we are a family. We gather each Sabbath to
                                    worship, study, serve, and grow together.
                                </p>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="p-6 bg-gray-50 rounded-3xl">
                                    <h3 className="font-semibold text-lg mb-4">Our Ministries</h3>
                                    <ul className="space-y-2 text-gray-600">
                                        <li>• Children & Youth Ministries</li>
                                        <li>• Women's and Men's Ministries</li>
                                        <li>• Health and Wellness Outreach</li>
                                        <li>• Evangelism and Bible Study</li>
                                        <li>• Music and Worship Programs</li>
                                        <li>• Community Development Initiatives</li>
                                    </ul>
                                </div>
                                <div className="p-6 bg-gray-50 rounded-3xl">
                                    <h3 className="font-semibold text-lg mb-4">Service Times</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="font-medium">Sabbath School</p>
                                            <p className="text-gray-600">9:00 AM</p>
                                        </div>
                                        <div>
                                            <p className="font-medium">Divine Service</p>
                                            <p className="text-gray-600">10:45 AM</p>
                                        </div>
                                        <div>
                                            <p className="font-medium">Afternoon Programs</p>
                                            <p className="text-gray-600">2:00 PM</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* History & Global Impact */}
                <div className="py-16 bg-gray-50">
                    <div className="container mx-auto px-6">
                        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                            <div>
                                <History strokeWidth={1.5} className="w-12 h-12 mb-6 text-blue-600" />
                                <h2 className="text-2xl font-bold mb-6">Our History</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    The Seventh-day Adventist Church began in the mid-19th century during the Second Great
                                    Awakening in North America and has since grown into a worldwide movement. Kitisuru SDA
                                    Church was established to serve our local community with love, truth, and service.
                                </p>
                            </div>
                            <div>
                                <Globe strokeWidth={1.5} className="w-12 h-12 mb-6 text-blue-600" />
                                <h2 className="text-2xl font-bold mb-6">Global Church, Local Impact</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    We are part of a global denomination with over 22 million members worldwide. The SDA Church
                                    operates thousands of schools, hospitals, and humanitarian agencies that serve people of all
                                    faiths — and none — across the globe.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default About

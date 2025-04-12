import React from 'react';
import {
    Users,
    BookOpen,
    Droplets,
    UserPlus,
    Calendar,
    MessageSquareText,
    HandHeart,
    ChevronRight,
} from 'lucide-react';

function GetInvolvedCard({ icon: Icon, title, description, buttonText }) {
    return (
        <div className="bg-white rounded-4xl shadow-md p-6 transition-all hover:shadow-2xl text-center">
            <div className="flex items-center mb-4">
                <div className="bg-blue-50 p-3 rounded-full mx-auto">
                    <Icon className="w-6 h-6 text-blue-600" />
                </div>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800 text-center">{title}</h3>
            <p className="text-gray-600 mb-4 text-center">{description}</p>
            <button className="flex items-center text-blue-600 hover:text-blue-700 font-medium mx-auto hover:cursor-pointer">
                {buttonText}
                <ChevronRight className="w-4 h-4 ml-1" />
            </button>
        </div>
    );
}

function GetInvolved() {
    return (
        <>
            <div className="min-h-screen bg-gray-50">
                {/* Hero Section */}
                <div
                    className="relative bg-cover bg-center py-24"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://www.briellemag.com/wp-content/uploads/2021/11/gracious-adebayo-AWIyDHiNKk-unsplash-1600x1067.jpg")',
                    }}
                >
                    <div className="container mx-auto px-4">
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

                {/* Main Content */}
                <div className="container mx-auto px-4 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <GetInvolvedCard
                            icon={HandHeart}
                            title="Volunteer Opportunities"
                            description="Share your time and talents to serve our church and community through various ministries and outreach programs."
                            buttonText="View Opportunities"
                        />

                        <GetInvolvedCard
                            icon={BookOpen}
                            title="Bible Study Groups"
                            description="Deepen your understanding of Scripture by joining one of our weekly Bible study groups or Sabbath School classes."
                            buttonText="Find a Group"
                        />

                        <GetInvolvedCard
                            icon={Droplets}
                            title="Baptism Interest"
                            description="Take the next step in your spiritual journey and learn more about baptism in the Adventist faith."
                            buttonText="Learn More"
                        />

                        <GetInvolvedCard
                            icon={UserPlus}
                            title="Membership Transfer"
                            description="Moving from another Adventist church? We'll help you transfer your membership to our congregation."
                            buttonText="Start Transfer"
                        />

                        <GetInvolvedCard
                            icon={Calendar}
                            title="Suggest an Event"
                            description="Have an idea for a church event or ministry? Share your suggestions with our leadership team."
                            buttonText="Submit Idea"
                        />

                        <GetInvolvedCard
                            icon={MessageSquareText}
                            title="Share Your Testimony"
                            description="Inspire others by sharing how God has worked in your life through our testimony submission form."
                            buttonText="Share Story"
                        />
                    </div>

                    {/* Contact Section */}
                    <div className="mt-16 text-center">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">
                            Need More Information?
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Our pastoral team is here to help you find your place in our church family.
                        </p>
                        <button className="bg-blue-600 text-white px-8 py-3 rounded-4xl font-medium hover:bg-blue-700 transition-colors">
                            Contact Us
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <footer className="bg-gray-800 text-white py-8">
                    <div className=" mx-auto px-4 text-center">
                        <p className="mb-4">
                           For where two or three gather in my name, there am I with them. - Mathew 18:20 
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}

export default GetInvolved;
import React from 'react'
import { MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
function Footer() {
    return (
        <>
            <footer className="bg-blue-900 text-white py-12">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-xl font-semibold mb-4">About Us</h3>
                            <p className="text-blue-200">A welcoming Seventh-day Adventist community dedicated to sharing God's love.</p>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
                            <ul className="space-y-2 text-blue-400">
                                <Link to="/about"><li className="hover:text-white">Beliefs</li></Link>
                                <Link to="/ministries"><li className="hover:text-white">Ministries</li></Link>
                                <Link to="/giving"><li className='hover:text-white'>Give online</li></Link>
                                <Link to="/resources"><li className='hover:text-white'>Library</li></Link>
                                <Link to='/contact'><li className='hover:text-white'>Get in touch</li></Link>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Connect</h3>
                            <p className="text-blue-200">Join us this Sabbath for worship and fellowship.</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Find us</h3>
                            <div className="flex items-center gap-2 text-blue-200">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4996.487141362847!2d36.7588812749656!3d-1.2428615987453007!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1837ea6db27b%3A0x44df5a87efb12b5e!2sFarasi%20Lane%20Primary%20School%2C%20Nairobi!5e1!3m2!1sen!2ske!4v1742980063015!5m2!1sen!2ske"
                                    loading="lazy"
                                    allowFullScreen=""
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className='rounded-3xl w-full h-60'>
                                </iframe>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-white mt-8 pt-8 text-center text-blue-200 text-xs font-light">
                        <p>&copy; 2024 Seventh Day Adventist Church Kitisuru. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer

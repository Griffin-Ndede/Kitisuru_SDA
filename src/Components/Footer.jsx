import React from 'react'
import { MapPin } from 'lucide-react'
import { Link } from 'react-router'
function Footer() {
    return (
        <>
            <footer className="bg-custom-blue text-white py-12">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-xl font-semibold mb-4">About Us</h3>
                            <p className="text-blue-200">A welcoming Seventh-day Adventist community dedicated to sharing God's love.</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
                            <ul className="space-y-2 text-white">
                                <Link to="/about"><li className="hover:text-custom-yellow">Beliefs</li></Link>
                                <Link to="/ministries"><li className="hover:text-custom-yellow">Ministries</li></Link>
                                <Link to="/giving"><li className='hover:text-custom-yellow'>Give online</li></Link>
                                <Link to="/resources"><li className='hover:text-custom-yellow'>Library</li></Link>
                                <Link to='/contact'><li className='hover:text-custom-yellow'>Get in touch</li></Link>
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
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1388.0664428512541!2d36.75646564290673!3d-1.2255396003921943!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f197536c093d1%3A0x9030e99db5586283!2sKitisuru%20SDA%20Church!5e1!3m2!1sen!2ske!4v1762853012881!5m2!1sen!2ske"
                                    allowFullScreen=""
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className='rounded-3xl w-full h-60'>
                                </iframe>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-white mt-8 pt-8 text-center text-blue-200 text-xs font-light">
                        <p>&copy; {new Date().getFullYear()}  Seventh Day Adventist Church Kitisuru. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer

import { useState } from 'react';
import Navbar from '../Components/Navbar'
import { Facebook , Instagram, Youtube, } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'general',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: 'general',
      message: ''
    });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white py-12 text-center shadow-sm">
          <div className="container mx-auto px-4 mt-16 md:mt-32">
            <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-3">Contact Our Church</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We'd love to hear from you! Reach out with questions, prayer requests, or to learn more about our ministries.
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Contact Form */}
            <div className="lg:w-1/2 bg-white p-8 rounded-4xl shadow-2xl">
              <h2 className="text-2xl font-semibold text-blue-800 mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-4xl focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-4xl focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number (optional)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-4xl focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-4xl focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="prayer">Prayer Request</option>
                    <option value="ministry">Ministry Information</option>
                    <option value="event">Event Questions</option>
                    <option value="giving">Giving Questions</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-4xl focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-3 px-4 rounded-4xl transition duration-300"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="lg:w-1/2 bg-white p-8 rounded-4xl shadow-2xl">
              <h2 className="text-2xl font-semibold text-blue-800 mb-6">Our Information</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-blue-800 mb-2">Address</h3>
                  <p className="text-gray-600">
                    SDA Church Kitisuru<br />
                    Farasi Lane primary school<br />
                    Off Lower Kabete Road
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-blue-800 mb-2">Service Times</h3>
                  <p className="text-gray-600">
                    Saturday: 9:00am & 5:00pm<br />
                    Friday Vespers: 8:00pm
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-blue-800 mb-2">Contact Details</h3>
                  <p className="text-gray-600">
                    Phone: (123) 456-7890<br />
                    Email: info@KitisuruSDA.org<br />
                    Office Hours: Mon-Thu 9am-4pm
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-blue-800 mb-2">Follow Us</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="text-red-600 hover:text-blue-800 transition duration-300">
                    <Facebook />
                    </a>
                    <a href="#" className="text-red-600 hover:text-blue-800 transition duration-300">
                     <Youtube/>
                    </a>
                    <a href="#" className="text-red-600 hover:text-blue-800 transition duration-300">
                    <Instagram />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="mt-12 bg-white p-8 rounded-4xl shadow-2xl">
            <h2 className="text-2xl font-semibold text-blue-800 mb-6">Find Us</h2>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215019090895!2d-73.98784492423991!3d40.74844097138972!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQ0JzU0LjQiTiA3M8KwNTknMTkuNyJX!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                className="rounded-4xl"
              ></iframe>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white py-8 text-center border-t border-gray-200">
          <div className="container mx-auto px-4">
            <p className="text-gray-600">
              [Your Church Name] • Loving God, Loving People, Serving Our Community
            </p>
            <p className="text-gray-500 mt-2">
              &copy; {new Date().getFullYear()} [Your Church Name]. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Contact;
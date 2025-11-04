import React, { useState, useEffect } from 'react';
import {
  Wallet,
  Building2,
  CreditCard,
  Phone,
  Building,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import Navbar from '../Components/Navbar';



function GivingOption({ icon: Icon, title, description, methods }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-4xl shadow-2xl p-6 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="bg-green-50 p-3 rounded-full mr-4">
            <Icon className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-500 hover:text-gray-700"
        >
          <ChevronDown className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
      </div>
      <p className="text-gray-600 mb-4">{description}</p>
      {isExpanded && (
        <div className="space-y-3 mt-4 border-t pt-4">
          {methods.map((method, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-4xl">
              <h4 className="font-medium text-gray-800 mb-1">{method.name}</h4>
              <p className="text-gray-600 text-sm">{method.details}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FAQ({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex justify-between items-center w-full text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-gray-800">{question}</span>
        <ChevronDown className={`w-5 h-5 text-gray-500 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <p className="mt-2 text-gray-600">{answer}</p>
      )}
    </div>
  );
}

function Giving() {
  const givingOptions = [
    {
      icon: Wallet,
      title: "Tithes & Offerings",
      description: "Return your tithe and give offerings to support God's work worldwide.",
      methods: [
        { name: "M-PESA", details: "Church Paybill: 406 894 9" },
        { name: "Adventist Giving", details: "Give securely through the official Adventist Giving platform" },
      ]
    },
    {
      icon: Building2,
      title: "Local Church Projects",
      description: "Support our local initiatives and community outreach programs.",
      methods: [
        { name: "Church development", details: "Help us maintain and improve our church facilities" },
        { name: "Welfare", details: "Support our local charity and outreach programs" },
        { name: "Youth Ministry", details: "Invest in our youth programs and activities" }
      ]
    }
  ];

  const faqs = [
    {
      question: "How is my tithe used?",
      answer: "Your tithe supports the worldwide mission of the Seventh-day Adventist Church, including pastoral ministry, evangelism, and education."
    },
    {
      question: "What's the difference between tithe and offerings?",
      answer: "Tithe is 10% of your income returned to God, while offerings are additional voluntary gifts for specific purposes or projects."
    },
    {
      question: "Are my donations tax-deductible?",
      answer: "Yes, all donations are tax-deductible. You will receive a yearly statement for your tax records."
    },
    {
      question: "Is online giving secure?",
      answer: "Yes, we use industry-standard encryption and secure payment processors to protect your financial information."
    }
  ];
  const [value, setValue] = useState(0);

  // Example data: total goal and amount raised so far
  const totalGoal = 375000;
  const amountRaised = 234353;

  // Function to calculate progress
  function calculateProgress(raised, goal) {
    if (goal <= 0) return 0;
    return Math.min(Math.round((raised / goal) * 100), 100);
  }

  // Automatically calculate when data changes
  useEffect(() => {
    const progress = calculateProgress(amountRaised, totalGoal);
    setValue(progress);
  }, [amountRaised, totalGoal]);


  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div
          className="relative bg-cover bg-center py-24"
          style={{
            backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("https://images.unsplash.com/photo-1490730141103-6cac27aaab94?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80")',
          }}
        >
          <div className="container mx-auto px-4 mt-8 md:mt-32">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Supporting God's Work Through Giving
              </h1>
              <p className="text-xl mx-auto font-light text-gray-200 mb-8">
                "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver." - 2 Corinthians 9:7
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-16">
          {/* Giving Options */}
          <div className="space-y-6 mb-16">
            {givingOptions.map((option, index) => (
              <GivingOption key={index} {...option} />
            ))}
          </div>

          <div className="w-full max-w-6xl mx-auto p-6 rounded-2xl shadow-lg bg-white space-y-6">
            <h2 className="text-2xl font-bold text-center text-gray-800">Fundraising Progress</h2>

            {/* Progress Summary */}
            <div className="text-center">
              <p className="text-sm text-gray-500">Total fundraising progress</p>
              <p className="font-medium text-gray-700">
                {amountRaised} of {totalGoal}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full">
              <div className="flex justify-between text-sm mb-1 font-medium text-gray-600">
                <span>{value}%</span>
                <span>{value}% of goal reached</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className="h-4 rounded-full bg-green-600 transition-all duration-500"
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 text-center py-4 border-t">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Raised</p>
                <p className="font-semibold text-gray-800">{amountRaised}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Target</p>
                <p className="font-semibold text-gray-800">{totalGoal}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Balance</p>
                <p className="font-semibold text-gray-800">{totalGoal - amountRaised}</p>
              </div>
            </div>
          </div>



          {/* Payment Methods */}
          <div className="bg-white rounded-4xl shadow-2xl p-8 mb-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Methods</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start space-x-4">
                <Phone className="w-6 h-6 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">M-PESA</h3>
                  <p className="text-gray-600">Church Paybill: 406 894 9</p>
                  <p className="text-gray-600">A/c name - LCB, Tithe or Offering</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Building className="w-6 h-6 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Bank Transfer (ABSA bank)</h3>
                  <p className="text-gray-600">Kshs acc: 204 532 686 6</p>
                  <p className="text-gray-600">Usd acc: 204 532 684 8</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <CreditCard className="w-6 h-6 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Development account (Unaitas Sacco)</h3>
                  <div className="space-y-2">
                    <p className="flex items-center text-gray-800">
                      Dev Acc. Pesalink Pay bill 4068949.
                      <br />1023286088
                    </p>
                    <p className="flex items-center text-gray-800">
                      Paybill 544600 A/C 863441# your name
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/* FAQs */}
          <div className="bg-white rounded-4xl shadow-2xl p-8 mb-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-2">
              {faqs.map((faq, index) => (
                <FAQ key={index} {...faq} />
              ))}
            </div>
          </div>

          {/* Accountability Section */}
          <div className="bg-white rounded-4xl shadow-2xl p-8 mb-20">
            <div className="flex items-start space-x-4">
              <div className="bg-green-50 p-3 rounded-full">
                <ShieldCheck className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Commitment to Financial Accountability</h2>
                <p className="text-gray-600 mb-4">
                  We are committed to the highest standards of financial accountability and transparency. All funds are carefully managed and audited according to Seventh-day Adventist Church policy.
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Regular financial reports to church board and business meetings</li>
                  <li>Annual audits by conference auditors</li>
                  <li>Detailed tracking of designated funds</li>
                  <li>Multiple signatories for all accounts</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-black fixed bottom-0 w-full text-white py-8 mt-16">
          <div className="container text-lg text-white font-light mx-auto px-4 text-center">
            <p >
              "Bring the whole tithe into the storehouse..." - Malachi 3:10
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}

export default Giving;
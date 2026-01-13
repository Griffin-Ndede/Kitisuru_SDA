import React, { useState } from "react";

function Activityform({ activity }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    });

    const activityFields = {
        volunteer: [], // just the base fields
        bible_study: [
            { name: "preferred_day", type: "text", placeholder: "Preferred Day for Study Group" },
        ],
        baptism: [
            { name: "preferred_date", type: "date", placeholder: "Preferred Baptism Date" },
        ],
        membership_transfer: [
            { name: "previous_church", type: "text", placeholder: "Previous Church Name" },
        ],
        event_suggestion: [
            { name: "event_idea", type: "text", placeholder: "Briefly describe your idea" },
        ],
        testimony: [
            { name: "consent", type: "checkbox", label: "I consent to share my testimony" },
            { name: "long_message", type: "textarea", placeholder: "Share your testimony here..." },
        ],
    };


    return (
        <div className="max-w-xl mx-auto bg-white rounded-4xl p-8">
            {/* Header */}
            <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                    Get Involved
                </h2>
                <p className="text-gray-600">
                    Thank you for your interest in <strong>{activity.title}</strong>. Please complete the form below and our team will be in touch with you soon.
                </p>
            </div>

            {/* Form */}
            <form className="space-y-5">
                {/* Full Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                    </label>
                    <input
                        name="name"
                        placeholder="John Doe"
                        required
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-custom-blue focus:border-custom-blue"
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                    </label>
                    <input
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        required
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-custom-blue focus:border-custom-blue"
                    />
                </div>

                {/* Phone */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number <span className="text-gray-400">(optional)</span>
                    </label>
                    <input
                        name="phone"
                        placeholder="0712 345 678"
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-custom-blue focus:border-custom-blue"
                    />
                </div>
                {/* Activity-specific extra fields */}
                {(activityFields[activity.key] || []).map((field) => {
                    if (field.type === "checkbox") {
                        return (
                            <label key={field.name} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name={field.name}
                                    className="rounded border-gray-300 focus:ring-2 focus:ring-custom-blue"
                                />
                                <span>{field.label}</span>
                            </label>
                        );
                    }

                    if (field.type === "textarea") {
                        return (
                            <div key={field.name}>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {field.placeholder}
                                </label>
                                <textarea
                                    name={field.name}
                                    rows="4"
                                    placeholder={field.placeholder}
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-custom-blue focus:border-custom-blue"
                                />
                            </div>
                        );
                    }

                    // default input field
                    return (
                        <div key={field.name}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {field.placeholder}
                            </label>
                            <input
                                name={field.name}
                                type={field.type}
                                placeholder={field.placeholder}
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-custom-blue focus:border-custom-blue"
                            />
                        </div>
                    );
                })}


                {/* Message */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Why are you interested?
                    </label>
                    <textarea
                        name="message"
                        rows="4"
                        placeholder="Tell us a bit about your interest..."
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-custom-blue focus:border-custom-blue"
                    />
                </div>
                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-custom-blue text-white py-3 rounded-xl font-medium hover:bg-custom-blue/90 transition-colors"
                >
                    Get Involved
                </button>
            </form>
        </div>
    );
}

export default Activityform;

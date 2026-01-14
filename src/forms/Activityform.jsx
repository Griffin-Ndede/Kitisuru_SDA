import React, { useState } from "react";
import { activityFields } from "./ActivitySchema";

function Activityform({ activity }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    });




    return (
        <>
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
                    {/* Activity-specific extra fields */}
                    {(activityFields[activity.key] || []).map((field) => (
                        <div key={field.name} className="mb-4">
                            {/* Label */}
                            {field.label && field.type !== "checkbox" && field.type !== "checkbox_group" && (
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {field.label}
                                </label>
                            )}

                            {/* Text, Email, Number, Date */}
                            {["text", "email", "number", "date"].includes(field.type) && (
                                <input
                                    type={field.type}
                                    name={field.name}
                                    placeholder={field.placeholder}
                                    required={field.required}
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-custom-blue focus:border-custom-blue"
                                />
                            )}

                            {/* Textarea */}
                            {field.type === "textarea" && (
                                <textarea
                                    name={field.name}
                                    rows={4}
                                    placeholder={field.placeholder}
                                    required={field.required}
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-custom-blue focus:border-custom-blue"
                                />
                            )}

                            {/* Select */}
                            {field.type === "select" && (
                                <select
                                    name={field.name}
                                    required={field.required}
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-custom-blue focus:border-custom-blue"
                                >
                                    <option value="">{field.placeholder || `Select ${field.label}`}</option>
                                    {field.options.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            )}

                            {/* Single Checkbox */}
                            {field.type === "checkbox" && (
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        name={field.name}
                                        required={field.required}
                                        className="rounded border-gray-300 focus:ring-2 focus:ring-custom-blue"
                                    />
                                    <span>{field.label}</span>
                                </label>
                            )}

                            {/* Checkbox Group */}
                            {field.type === "checkbox_group" && field.options && (

                                <div>
                                    <label>{field.label}</label>
                                    {field.options.map((opt) => (
                                        <label key={opt.value} className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                name={field.name}
                                                value={opt.value}
                                                className="rounded border-gray-300 focus:ring-2 focus:ring-custom-blue"
                                            />
                                            <span>{opt.label}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-custom-blue text-white py-3 rounded-xl font-medium hover:bg-custom-blue/90 transition-colors"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </>

    );
}

export default Activityform;

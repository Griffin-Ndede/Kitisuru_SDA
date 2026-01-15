import React, { useEffect, useState } from "react";
import { activityFields } from "./ActivitySchema";

function Activityform({ activity }) {
    const [formData, setFormData] = useState({});


    useEffect(() => {
        const initialData = {};

        (activityFields[activity.key] || []).forEach(field => {
            if (field.type === "checkbox_group") {
                initialData[field.name] = [];
            } else if (field.type === "checkbox") {
                initialData[field.name] = false;
            } else {
                initialData[field.name] = "";
            }
        });

        setFormData(initialData);
    }, [activity.key]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData(prev => {
            // Single checkbox
            if (type === "checkbox" && !Array.isArray(prev[name])) {
                return { ...prev, [name]: checked };
            }

            // Checkbox group
            if (type === "checkbox" && Array.isArray(prev[name])) {
                return {
                    ...prev,
                    [name]: checked
                        ? [...prev[name], value]
                        : prev[name].filter(v => v !== value),
                };
            }

            // Everything else (text, email, select, radio, textarea)
            return { ...prev, [name]: value };
        });
    };
    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            activity: activity.key,
            submittedAt: new Date().toISOString(),
            data: formData,
        };

        console.log("FINAL PAYLOAD", payload);

        // Send to EmailJS, Django API, Firebase, etc
    };


    console.log(formData)
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
                <form onSubmit={handleSubmit}
                    className="space-y-5">
                    {(activityFields[activity.key] || []).map((field) => (
                        <div key={field.name} className="mb-4">

                            {/* Label */}
                            {field.label && field.type !== "checkbox" && field.type !== "checkbox_group" && (
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {field.label}
                                </label>
                            )}

                            {/* Text / Email / Number / Date */}
                            {["text", "email", "number", "date"].includes(field.type) && (
                                <input
                                    type={field.type}
                                    name={field.name}
                                    placeholder={field.placeholder}
                                    required={field.required}
                                    value={formData[field.name] || ""}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3"
                                />
                            )}

                            {/* Textarea */}
                            {field.type === "textarea" && (
                                <textarea
                                    name={field.name}
                                    rows={4}
                                    placeholder={field.placeholder}
                                    required={field.required}
                                    value={formData[field.name] || ""}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3"
                                />
                            )}

                            {/* Select */}
                            {field.type === "select" && (
                                <select
                                    name={field.name}
                                    required={field.required}
                                    value={formData[field.name] || ""}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3"
                                >
                                    <option value="">
                                        {field.placeholder || `Select ${field.label}`}
                                    </option>
                                    {field.options.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            )}

                            {/* Radio */}
                            {field.type === "radio" && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {field.label}
                                    </label>

                                    {field.options.map((option) => (
                                        <label key={option.value} className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name={field.name}
                                                value={option.value}
                                                checked={formData[field.name] === option.value}
                                                onChange={handleChange}
                                            />
                                            <span>{option.label}</span>
                                        </label>
                                    ))}
                                </div>
                            )}

                            {/* Single Checkbox */}
                            {field.type === "checkbox" && (
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name={field.name}
                                        checked={!!formData[field.name]}
                                        onChange={handleChange}
                                        required={field.required}
                                    />
                                    <span>{field.label}</span>
                                </label>
                            )}

                            {/* Checkbox Group */}
                            {field.type === "checkbox_group" && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {field.label}
                                    </label>

                                    {field.options.map((opt) => (
                                        <label key={opt.value} className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                name={field.name}
                                                value={opt.value}
                                                checked={formData[field.name]?.includes(opt.value)}
                                                onChange={handleChange}
                                            />
                                            <span>{opt.label}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    <button
                        type="submit"
                        className="w-full bg-custom-blue text-white py-3 rounded-xl font-medium"
                    >
                        Submit
                    </button>
                </form>

            </div>
        </>

    );
}

export default Activityform;

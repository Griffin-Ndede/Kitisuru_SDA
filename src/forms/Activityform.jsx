import React, { useEffect, useState } from "react";
import { activityFields } from "./ActivitySchema";
import Swal from "sweetalert2";
import emailjs from '@emailjs/browser';


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


    const fields = activityFields[activity.key] || [];

    // field name -> field label
    const fieldLabelMap = Object.fromEntries(
        fields.map(field => [field.name, field.label || field.name])
    );

    // field name -> option value -> option label
    const optionLabelMap = Object.fromEntries(
        fields
            .filter(field => field.options)
            .map(field => [
                field.name,
                Object.fromEntries(
                    field.options.map(opt => [opt.value, opt.label])
                ),
            ])
    );


    // format email function 
    const formatEmailMessage = (payload) => {
        const { submittedAt, data } = payload;

        let message = `
Hello,

You have received a new form submission through the website.
Activity: ${activity.title}
Submitted at: ${new Date(submittedAt).toLocaleString()}

----------------------------------
`;

        Object.entries(data).forEach(([key, value]) => {
            const label = fieldLabelMap[key] || key;

            // Checkbox group / multi-select
            if (Array.isArray(value)) {
                if (value.length === 0) {
                    message += `${label}: —\n\n`;
                    return;
                }

                message += `${label}:\n`;
                value.forEach(v => {
                    const displayValue =
                        optionLabelMap[key]?.[v] || v;
                    message += `- ${displayValue}\n`;
                });
                message += "\n";
                return;
            }

            // Boolean (single checkbox)
            if (typeof value === "boolean") {
                message += `${label}: ${value ? "Yes" : "No"}\n\n`;
                return;
            }

            // Text / email / select / radio
            const displayValue =
                optionLabelMap[key]?.[value] || value || "—";

            message += `${label}: ${displayValue}\n\n`;
        });
        message += `
----------------------------------
This message was sent from the church website on the ${activity.title} form.
Please follow up with the applicant as needed.
Thank you for serving and supporting this ministry.

Warm regards,  
Kitisuru SDA Church Website
`;
        return message;
    };



    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            activity: activity.key,
            submittedAt: new Date().toISOString(),
            data: formData,
        };

        const emailMessage = formatEmailMessage(payload);
        // use sendForm if it is a form in which case you have to reference the form and use useRef for that otherwise just use .send if you are formatting your own message
        emailjs
            .send(
                'Kitisuru_comms',
                'template_fklz9gq',
                {
                    subject: `New ${activity.title} Submission`,
                    activity: activity.key,
                    message: emailMessage,
                },
                'ujzRVhmE5hogh7h9b')
            .then(
                () => {
                    successAlert();
                    setFormData({
                        name: '',
                        email: '',
                        school: '',
                        date: '',
                    })
                },
                () => {
                    failureAlert();
                    setFormData({
                        name: '',
                        email: '',
                        school: '',
                        date: '',
                    })
                },
            );
        // function to show success alert prompt
        const successAlert = () => {
            Swal.fire({
                title: 'Success',
                text: `Thank you for filling out the ${activity.title} form`,
                icon: 'success',
                confirmButtonText: 'OK',
            })
        };

        // function to show failure alert prompt
        const failureAlert = (message) => {
            Swal.fire({
                title: 'Error',
                text: message,
                icon: 'error',
                confirmButtonText: 'OK',
            });
        };

    };

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
                <form
                    onSubmit={handleSubmit}
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
                                        checked={Boolean(formData[field.name])}
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
                                                checked={(formData[field.name] || []).includes(opt.value)}
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

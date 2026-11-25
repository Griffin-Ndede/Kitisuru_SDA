import React, { useEffect, useState } from "react";
import { activityContacts, activityFields } from "./ActivitySchema";
import { sendGetInvolved } from "../Api";
import { errorMessage } from "../Api/client";
import Swal from "sweetalert2";
import emailjs from '@emailjs/browser';


function Activityform({ activity, ministries = [], onClose }) {
    const [formData, setFormData] = useState({});
    const [consent, setConsent] = useState(false);
    const [busy, setBusy] = useState(false);

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


    // The ministry list comes from the church's real ministries
    const fields = (activityFields[activity.key] || []).map((field) =>
        field.name === "ministries"
            ? { ...field, options: ministries.map((m) => ({ label: m.title, value: String(m.id) })) }
            : field
    );

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

    // The first filled-in field out of a list of candidates (mother, father...)
    const firstFilled = (names = []) => names.map((n) => formData[n]).find((v) => v && String(v).trim()) || "";

    // What the church office needs to follow up, sent to the backend
    const buildSubmission = () => {
        const contact = activityContacts[activity.key];
        const used = new Set(["ministries", "area"]);
        ["name", "email", "phone"].forEach((k) => contact[k].forEach((n) => used.add(n)));
        const details = fields
            .filter((f) => !used.has(f.name))
            .map((f) => {
                const value = formData[f.name];
                const show = (v) => optionLabelMap[f.name]?.[v] || v;
                return {
                    label: f.label || f.name,
                    value: Array.isArray(value) ? value.map(show) : typeof value === "boolean" ? (value ? "Yes" : "No") : show(value || ""),
                };
            });
        return {
            kind: contact.kind,
            name: firstFilled(contact.name),
            email: firstFilled(contact.email),
            phone: firstFilled(contact.phone),
            area: formData.area || "",
            ministries: (formData.ministries || []).map(Number),
            details,
            consent,
            website: formData.website || "", // hidden field: only bots fill it in
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setBusy(true);
        try {
            await sendGetInvolved(buildSubmission());
        } catch (err) {
            setBusy(false);
            Swal.fire({
                title: "Error",
                text: errorMessage(err),
                icon: "error",
                iconColor: "#b04a2a", // red
                confirmButtonText: "OK",
                confirmButtonColor: "#2e8eb4", // the website's blue
            });
            return;
        }

        // The church also still gets an email about it. This is only a courtesy:
        // the request is already saved, so a failed email is not shown as an error.
        const payload = { activity: activity.key, submittedAt: new Date().toISOString(), data: formData };
        emailjs
            .send(
                'Kitisuru_comms',
                'template_fklz9gq',
                {
                    subject: `New ${activity.title} Submission`,
                    activity: activity.key,
                    message: formatEmailMessage(payload),
                },
                'ujzRVhmE5hogh7h9b')
            .catch(() => {});

        await Swal.fire({
            title: 'Success',
            text: `Thank you for filling out the ${activity.title} form. The church office will be in touch.`,
            icon: 'success',
            iconColor: '#2e8eb4', // the website's blue
            confirmButtonText: 'OK',
            confirmButtonColor: '#2e8eb4',
        });
        onClose?.();
    };

    return (
        <>
            <div className="mx-auto max-w-xl p-2 pt-6 sm:p-4">
                {/* Header */}
                <div className="text-center mb-6">
                    <h2 className="font-display text-3xl font-semibold text-forest-950 mb-2">
                        Get Involved
                    </h2>
                    <p className="text-ink/70">
                        Thank you for your interest in <strong>{activity.title}</strong>. Please complete the form below and our team will be in touch with you soon.
                    </p>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-5">
                    {fields.map((field) => (
                        <div key={field.name} className="mb-4">

                            {/* Label */}
                            {field.label && field.type !== "checkbox" && field.type !== "checkbox_group" && (
                                <label className="block text-sm font-medium text-ink mb-1">
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
                                    className="input"
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
                                    className="input"
                                />
                            )}

                            {/* Select */}
                            {field.type === "select" && (
                                <select
                                    name={field.name}
                                    required={field.required}
                                    value={formData[field.name] || ""}
                                    onChange={handleChange}
                                    className="input"
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
                                    <label className="block text-sm font-medium text-ink mb-2">
                                        {field.label}
                                    </label>

                                    {field.options.map((option) => (
                                        <label key={option.value} className="flex items-center gap-2.5 py-1 text-sm">
                                            <input
                                                type="radio"
                                                className="size-4 accent-forest-900"
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
                                <label className="flex items-center gap-2.5 text-sm">
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
                                    <label className="block text-sm font-medium text-ink mb-2">
                                        {field.label}
                                    </label>

                                    {field.options.map((opt) => (
                                        <label key={opt.value} className="flex items-center gap-2.5 py-1 text-sm">
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

                    {/* Hidden from people; bots tend to fill every field */}
                    <input
                        type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"
                        value={formData.website || ""} onChange={handleChange}
                        className="absolute -left-[9999px] h-0 w-0 opacity-0"
                    />

                    <label className="flex items-start gap-2.5 text-sm text-ink/80">
                        <input
                            type="checkbox" required checked={consent}
                            onChange={(e) => setConsent(e.target.checked)} className="mt-1 size-4 accent-forest-900"
                        />
                        <span>
                            I agree that the church may keep these details to follow up with me.{" "}
                            <a href="/privacy" target="_blank" rel="noreferrer" className="font-medium text-forest-900 underline">
                                How we use your details
                            </a>
                        </span>
                    </label>

                    <button
                        type="submit"
                        disabled={busy}
                        className="w-full rounded-full bg-forest-900 py-3.5 font-semibold text-white shadow-card transition hover:bg-forest-800 active:translate-y-px disabled:opacity-60"
                    >
                        {busy ? "Sending..." : "Submit"}
                    </button>
                </form>

            </div>
        </>

    );
}

export default Activityform;

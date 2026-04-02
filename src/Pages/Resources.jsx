import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import BASE_URL from '../config';

const Resources = () => {
    const [documents, setDocuments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentDocument, setCurrentDocument] = useState(null);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await fetch(`${BASE_URL}/library/documents/`);
                if (!response.ok) throw new Error('Failed to fetch documents');
                const data = await response.json();
                setDocuments(data);
                console.log(response.data)
                setIsLoading(false);
            } catch (err) {
                setError(err.message);
                setIsLoading(false);
            }
        };
        fetchDocuments();
    }, []);

    const handleDocumentSelect = (doc) => {
        setCurrentDocument(doc);
    };

    const BookItem = ({ doc, currentDocument, handleDocumentSelect }) => {
        const [isExpanded, setIsExpanded] = useState(false);

        const toggleExpand = (e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
        };

        const truncateText = (text, maxLength) => {
            if (text.length <= maxLength) return text;
            return text.substring(0, maxLength) + '...';
        };

        return (
            <li
                key={doc.id}
                className={`p-4 rounded-3xl border mb-4 cursor-pointer transition-colors ${currentDocument?.id === doc.id
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-custom-blue/20 border-gray-200 hover:bg-gray-50 hover:shadow-xl'
                    }`}
                onClick={() => handleDocumentSelect(doc)}
            >
                <h4 className="font-medium text-gray-900">{doc.title}</h4>
                <p className="text-sm text-gray-600 mt-1">
                    {isExpanded ? doc.description : truncateText(doc.description, 100)}
                </p>
                {doc.description.length > 100 && (
                    <button
                        onClick={toggleExpand}
                        className="mt-2 text-custom-blue text-sm focus:outline-none hover:cursor-pointer"
                    >
                        {isExpanded ? 'Show Less' : 'Read More'}
                    </button>
                )}
                <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">{doc.publish_date || doc.date}</span>
                    <span className="text-xs px-2 py-1 bg-custom-blue rounded-full text-white">
                        {doc.category?.name || doc.category}
                    </span>
                </div>
            </li>
        );
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-lg text-gray-600">Loading documents...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-lg text-red-500">Error loading documents: {error}</p>
            </div>
        );
    }

    return (
        <>
            <div className="h-fit overflow-hidden">
                <Navbar />

                {/* MAIN CONTENT */}
                <div className="w-full h-fit bg-gray-50 pt-24">

                    {/* LEFT: Documents */}
                    <div className="bg-white w-full p-4">
                        {/* Header */}
                        <div className="p-4 md:p-6 border-b border-gray-100">
                            <h2 className="text-lg md:text-xl font-semibold text-gray-800 text-center">
                                Church Study Materials
                            </h2>
                        </div>

                        {/* Scrollable List */}
                        <ul className=" w-full h-full p-3 md:p-4 space-y-2 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {documents
                                .sort((a, b) => a.title.localeCompare(b.title))
                                .map((doc) => (
                                    <BookItem
                                        key={doc.id}
                                        doc={doc}
                                        currentDocument={currentDocument}
                                        handleDocumentSelect={handleDocumentSelect}
                                    />
                                ))}
                        </ul>
                    </div>
                </div>

                {/* PDF POPUP */}
                {currentDocument && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
                        onClick={() => setCurrentDocument(null)} // close when clicking outside
                    >
                        <div
                            className="relative w-[90%] md:w-7xl  bg-white rounded-2xl border border-gray-200 overflow-hidden"
                            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
                        >
                            {/* Header */}
                            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="text-sm md:text-lg font-semibold text-gray-800 truncate">
                                    {currentDocument.title}
                                </h3>
                                <button
                                    onClick={() => setCurrentDocument(null)}
                                    className="text-gray-500 hover:text-gray-800"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* PDF */}
                            <div className="">
                                <iframe
                                    src={`${BASE_URL}/library/documents/${currentDocument.slug}/#toolbar=1&navpanes=0&zoom=page-width`}
                                    className="w-full h-[90vh]"
                                    title={currentDocument.title}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Resources;

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
                className={`p-4 rounded-3xl border mb-4 cursor-pointer transition-colors ${
                    currentDocument?.id === doc.id
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-white border-gray-200 hover:bg-gray-50 hover:shadow-xl'
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
                        className="mt-2 text-blue-600 text-sm focus:outline-none hover:cursor-pointer"
                    >
                        {isExpanded ? 'Show Less' : 'Read More'}
                    </button>
                )}
                <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">{doc.publish_date || doc.date}</span>
                    <span className="text-xs px-2 py-1 bg-blue-600 rounded-full text-white">
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
            <div className=" h-screen overflow-hidden">
                <Navbar />
                <div className="flex pt-28 h-full">
                    {/* Left side: Document List */}
                    <div className="w-1/3 bg-white h-full overflow-y-auto p-6">
                        <h2 className="text-2xl font-bold mb-6 text-black">Church Documents</h2>
                        <ul className="space-y-4">
                            {documents.map((doc) => (
                                <BookItem
                                    key={doc.id}
                                    doc={doc}
                                    currentDocument={currentDocument}
                                    handleDocumentSelect={handleDocumentSelect}
                                />
                            ))}
                        </ul>
                    </div>

                    {/* Right side: PDF Viewer */}
                    <div className="w-2/3 h-full overflow-y-auto p-6">
                        {currentDocument ? (
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 h-full flex flex-col">
                                <div className="p-4 border-b border-gray-200">
                                    <h3 className="text-xl font-medium text-black">{currentDocument.title}</h3>
                                </div>
                                <div className="flex-1 p-4">
                                    <iframe
                                        src={`${BASE_URL}/library/documents/${currentDocument.slug}/#toolbar=1&navpanes=0&scrollbar=1&zoom=100`}
                                        className="w-full h-full rounded-xl"
                                        allowFullScreen
                                        title={currentDocument.title}
                                    >
                                        <p>Your browser does not support PDFs.
                                            <a href={`${BASE_URL}/library/documents/${currentDocument.slug}/`}>Download the PDF</a> instead.
                                        </p>
                                    </iframe>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full bg-white rounded-3xl border border-gray-200">
                                <svg
                                    className="w-12 h-12 text-gray-400 mb-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                    />
                                </svg>
                                <p className="text-gray-500">Select a document from the list to view</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Resources;

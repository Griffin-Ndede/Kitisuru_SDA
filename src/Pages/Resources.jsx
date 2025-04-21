import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import BASE_URL from '../../config';

const Resources = () => {
    const [documents, setDocuments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentDocument, setCurrentDocument] = useState(null);

    // Fetch documents from Django backend
    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await fetch(`${BASE_URL}/resources/documents/`);
                if (!response.ok) throw new Error('Failed to fetch documents');
                const data = await response.json();
                setDocuments(data);
                setIsLoading(false);
                console.log(data);
            } catch (err) {
                setError(err.message);
                setIsLoading(false);
            }
        };
        fetchDocuments();
    }, []);

    // Handle document selection
    const handleDocumentSelect = (doc) => {
        setCurrentDocument(doc);
    };

    // Small component for each book/document
    const BookItem = ({ doc, currentDocument, handleDocumentSelect }) => {
        const [isExpanded, setIsExpanded] = useState(false);

        const toggleExpand = (e) => {
            e.stopPropagation(); // Don't trigger document selection when clicking "Read More"
            setIsExpanded(!isExpanded);
        };

        const truncateText = (text, maxLength) => {
            if (text.length <= maxLength) {
                return text;
            }
            return text.substring(0, maxLength) + '...';
        };

        return (
            <li
                key={doc.id}
                className={`p-4 rounded-3xl border cursor-pointer transition-colors ${
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
                        className="mt-2 text-blue-600 text-sm focus:outline-none hover:cursor-pointer "
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

    // Render loading state
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-lg text-gray-600">Loading documents...</p>
            </div>
        );
    }

    // Render error state
    if (error) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-lg text-red-500">Error loading documents: {error}</p>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="container mx-auto px-4 py-8 max-w-8xl">
                <h2 className="text-2xl font-bold text-black mb-6 mt-12 md:mt-32 ml-4">Church Documents</h2>

                <div className="flex flex-col md:flex-row gap-6">
                    {/* Document List */}
                    <div className="md:w-1/3">
                        <h3 className="text-xl font-semibold mb-4 ml-4">Available Documents</h3>
                        <ul className="space-y-3">
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

                    {/* PDF Viewer */}
                    <div className="md:w-2/3">
                        {currentDocument ? (
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 h-full">
                                <div className="p-4 border-b border-gray-200">
                                    <h3 className="text-xl font-medium text-black">{currentDocument.title}</h3>
                                </div>

                                <div className="p-4 flex justify-center bg-gray-50 min-h-fit">
                                    <iframe
                                        src={`${BASE_URL}/resources/documents/${currentDocument.slug}/#toolbar=1&navpanes=0&scrollbar=1&zoom=100`}
                                        className="w-full h-full min-h-[600px] rounded-xl"
                                        allowFullScreen
                                        title={currentDocument.title}
                                    >
                                        <p>Your browser does not support PDFs.
                                            <a href={`${BASE_URL}/resources/documents/${currentDocument.slug}/`}>Download the PDF</a> instead.
                                        </p>
                                    </iframe>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-64 bg-white rounded-3xl border border-gray-200">
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

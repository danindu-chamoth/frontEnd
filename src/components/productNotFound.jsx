import React from 'react';

export default function ProductNotFound() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 p-8">
            {/* Large 404 Number */}
            <div className="text-8xl font-bold text-gray-800 mb-4">
                404
            </div>

            {/* Error Message */}
            <div className="text-xl text-gray-600 mb-8">
                Oops! Product not found.
            </div>

            {/* Go Back Button */}
            <button 
                onClick={() => window.history.back()}
                className="px-8 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
                Go Back
            </button>
        </div>
    );
}

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ErrorStateProps {
    error: string | null;
    isMaintenanceMode?: boolean;
    isProductNotFound?: boolean;
}

const ErrorState: React.FC<ErrorStateProps> = ({ 
    error, 
    isMaintenanceMode = false,
    isProductNotFound = false 
}) => {
    const navigate = useNavigate();

    if (isProductNotFound) {
        return (
            <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
                <button 
                    onClick={() => navigate('/menu')}
                    className="inline-flex items-center bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Menu
                </button>
            </div>
        );
    }

    if (isMaintenanceMode) {
        return (
            <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="text-yellow-500 text-5xl mb-4">🛠️</div>
                <h1 className="text-3xl font-bold mb-4">Site Under Maintenance</h1>
                <p className="text-xl text-gray-600 mb-6">
                    We're currently updating our menu. Please check back soon!
                </p>
                <button 
                    onClick={() => window.location.reload()}
                    className="mt-4 inline-flex items-center bg-yellow-500 text-white px-4 py-2 rounded-full hover:bg-yellow-600 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Reload Page
                </button>
            </div>
        );
    }

    return (
        <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-bold mb-4">Error Loading Product</h1>
            <p className="text-xl text-red-500">{error}</p>
            <button 
                onClick={() => window.location.reload()}
                className="mt-4 inline-flex items-center bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors"
            >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Reload Page
            </button>
        </div>
    );
};

export default ErrorState;

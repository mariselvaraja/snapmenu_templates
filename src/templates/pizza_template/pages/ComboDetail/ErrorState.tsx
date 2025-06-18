interface ErrorStateProps {
    error: string | null;
    isMaintenanceMode?: boolean;
    isComboNotFound?: boolean;
}

export default function ErrorState({ error, isMaintenanceMode = false, isComboNotFound = false }: ErrorStateProps) {
    if (isMaintenanceMode) {
        return (
            <div className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="text-yellow-500 text-5xl mb-4">🛠️</div>
                    <h1 className="text-3xl font-bold mb-4">Combo Maintenance</h1>
                    <p className="text-xl text-gray-600 mb-6">
                        We're currently updating our combo offers. Please check back soon!
                    </p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="mt-4 inline-flex items-center bg-yellow-500 text-white px-4 py-2 rounded-full hover:bg-yellow-600 transition-colors"
                    >
                        Reload Page
                    </button>
                </div>
            </div>
        );
    }

    if (isComboNotFound) {
        return (
            <div className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="text-red-500 text-5xl mb-4">🍕</div>
                    <h1 className="text-3xl font-bold mb-4">Combo Not Found</h1>
                    <p className="text-xl text-gray-600 mb-6">
                        Sorry, the combo you're looking for doesn't exist or is no longer available.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button 
                            onClick={() => window.history.back()}
                            className="inline-flex items-center bg-gray-500 text-white px-6 py-3 rounded-full hover:bg-gray-600 transition-colors"
                        >
                            Go Back
                        </button>
                        <button 
                            onClick={() => window.location.href = '/menu'}
                            className="inline-flex items-center bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition-colors"
                        >
                            Browse Menu
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="text-red-500 text-5xl mb-4">⚠️</div>
                <h1 className="text-4xl font-bold mb-4">Error Loading Combo</h1>
                <p className="text-xl text-red-500 mb-6">{error}</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                        onClick={() => window.location.reload()}
                        className="inline-flex items-center bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition-colors"
                    >
                        Reload Page
                    </button>
                    <button 
                        onClick={() => window.location.href = '/menu'}
                        className="inline-flex items-center bg-gray-500 text-white px-6 py-3 rounded-full hover:bg-gray-600 transition-colors"
                    >
                        Browse Menu
                    </button>
                </div>
            </div>
        </div>
    );
}

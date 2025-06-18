export default function LoadingState() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50/30">
            <div className="py-6 sm:py-8 lg:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Enhanced Loading Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg mb-6">
                            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                            Loading Combo...
                        </h1>
                        <p className="text-xl text-gray-600 font-medium">
                            Please wait while we prepare your combo details
                        </p>
                    </div>

                    {/* Enhanced Skeleton for back button */}
                    <div className="mb-8">
                        <div className="h-12 w-36 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse shadow-sm"></div>
                    </div>

                    {/* Enhanced Grid Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
                        {/* Enhanced Main content skeleton */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Enhanced Header skeleton */}
                            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                                    {/* Left side - combo info */}
                                    <div className="space-y-4">
                                        <div className="h-10 w-3/4 bg-gradient-to-r from-red-200 to-red-300 rounded-xl animate-pulse shadow-sm"></div>
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-24 bg-gradient-to-r from-red-200 to-red-300 rounded-lg animate-pulse"></div>
                                            <div className="h-6 w-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse"></div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="h-4 w-full bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                                            <div className="h-4 w-3/4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                                        </div>
                                        <div className="h-12 w-44 bg-gradient-to-r from-red-200 to-red-300 rounded-xl animate-pulse shadow-sm mt-6"></div>
                                    </div>
                                    {/* Right side - image */}
                                    <div className="w-full h-64 bg-gradient-to-br from-red-100 to-red-200 rounded-xl animate-pulse shadow-md"></div>
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Sidebar skeleton */}
                        <div className="lg:col-span-1">
                            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 sticky top-6">
                                {/* Header */}
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-gradient-to-br from-red-200 to-red-300 rounded-xl animate-pulse"></div>
                                    <div className="h-6 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                                    <div className="h-6 w-8 bg-gradient-to-r from-red-200 to-red-300 rounded-full animate-pulse"></div>
                                </div>
                                
                                {/* Product items */}
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex items-start gap-4 p-4 bg-gradient-to-r from-white to-gray-50/50 border border-gray-200/60 rounded-xl">
                                            <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-xl animate-pulse shadow-sm"></div>
                                            <div className="flex-1 space-y-2">
                                                <div className="h-4 w-3/4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                                                <div className="h-3 w-1/2 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                                                <div className="h-5 w-16 bg-gradient-to-r from-green-200 to-green-300 rounded-full animate-pulse"></div>
                                            </div>
                                            <div className="h-6 w-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse"></div>
                                        </div>
                                    ))}
                                </div>

                                {/* Summary section */}
                                <div className="mt-8 pt-6 border-t border-gray-200">
                                    <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-200/60">
                                        <div className="flex justify-between items-center mb-3">
                                            <div className="h-4 w-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                                            <div className="h-6 w-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse"></div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div className="h-5 w-20 bg-gradient-to-r from-red-200 to-red-300 rounded animate-pulse"></div>
                                            <div className="h-8 w-20 bg-gradient-to-r from-red-200 to-red-300 rounded-xl animate-pulse"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

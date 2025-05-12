import React from 'react';
import { ArrowLeft } from 'lucide-react';

const LoadingState: React.FC = () => {
    return (
        <div className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back button skeleton */}
                <div className="h-10 w-32 bg-red-100 rounded-full animate-pulse mb-8"></div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* You May Also Like skeleton on LHS */}
                    <div className="md:col-span-1">
                        <div className="h-6 w-48 bg-red-100 rounded animate-pulse mb-4"></div>
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm">
                                    <div className="flex items-center p-2">
                                        <div className="w-16 h-16 bg-red-100 rounded-md mr-3 animate-pulse"></div>
                                        <div>
                                            <div className="h-4 w-20 bg-red-100 rounded animate-pulse mb-2"></div>
                                            <div className="h-3 w-12 bg-red-100 rounded animate-pulse"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Product Details skeleton on RHS */}
                    <div className="md:col-span-3">
                        {/* Product Header with Image on Right */}
                        <div className="flex flex-col md:flex-row justify-between items-start mb-4">
                            <div className="md:pr-8 md:w-1/2">
                                <div className="h-8 w-48 bg-red-100 rounded animate-pulse mb-2"></div>
                                <div className="h-6 w-24 bg-red-100 rounded animate-pulse mb-4"></div>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <div className="h-6 w-20 bg-red-100 rounded-full animate-pulse"></div>
                                    <div className="h-6 w-16 bg-red-100 rounded-full animate-pulse"></div>
                                </div>
                                <div className="h-4 w-full bg-red-100 rounded animate-pulse mb-2"></div>
                                <div className="h-4 w-full bg-red-100 rounded animate-pulse mb-2"></div>
                                <div className="h-4 w-3/4 bg-red-100 rounded animate-pulse mb-6"></div>
                                
                                {/* Add to cart button skeleton */}
                                <div className="w-full h-12 bg-red-100 rounded-full animate-pulse mb-6"></div>
                            </div>
                            <div className="md:w-1/2 mt-4 md:mt-0">
                                <div className="w-full h-64 bg-red-100 rounded-lg animate-pulse"></div>
                            </div>
                        </div>

                        {/* Product Details section skeleton */}
                        <div className="mb-8">
                            <div className="flex items-center mb-4">
                                <div className="h-6 w-6 bg-red-100 rounded-full animate-pulse mr-2"></div>
                                <div className="h-6 w-32 bg-red-100 rounded animate-pulse"></div>
                            </div>
                            <div className="space-y-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="border-b border-gray-100 pb-3">
                                        <div className="flex items-center mb-1">
                                            <div className="h-4 w-4 bg-red-100 rounded-full animate-pulse mr-2"></div>
                                            <div className="h-4 w-24 bg-red-100 rounded animate-pulse"></div>
                                        </div>
                                        <div className="h-4 w-32 bg-red-100 rounded animate-pulse ml-6"></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Nutritional information section skeleton */}
                        <div className="mb-8">
                            <div className="flex items-center mb-4">
                                <div className="h-6 w-6 bg-red-100 rounded-full animate-pulse mr-2"></div>
                                <div className="h-6 w-48 bg-red-100 rounded animate-pulse"></div>
                            </div>
                            <div className="space-y-4">
                                {[1, 2].map((i) => (
                                    <div key={i} className="border-b border-gray-100 pb-3">
                                        <div className="flex items-center mb-1">
                                            <div className="h-4 w-4 bg-red-100 rounded-full animate-pulse mr-2"></div>
                                            <div className="h-4 w-24 bg-red-100 rounded animate-pulse"></div>
                                        </div>
                                        <div className="h-4 w-16 bg-red-100 rounded animate-pulse ml-6"></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Ingredients section skeleton */}
                        <div className="mb-8">
                            <div className="flex items-center mb-4">
                                <div className="h-6 w-6 bg-red-100 rounded-full animate-pulse mr-2"></div>
                                <div className="h-6 w-32 bg-red-100 rounded animate-pulse"></div>
                            </div>
                            <div className="flex flex-wrap gap-2 pl-6">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-8 w-20 bg-red-100 rounded-full animate-pulse"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoadingState;

import React from 'react';
import { Flame } from 'lucide-react';

interface SpiceLevelSelectorProps {
    spiceLevel: number;
    setSpiceLevel: (level: number) => void;
}

const SpiceLevelSelector: React.FC<SpiceLevelSelectorProps> = ({ 
    spiceLevel, 
    setSpiceLevel 
}) => {
    return (
        <div className="mb-3">
            <div className="flex items-center mb-2">
                <Flame className="h-4 w-4 mr-1 text-red-500" />
                <span className="text-sm font-medium text-gray-700">Spice Level:</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
                <div 
                    onClick={() => setSpiceLevel(1)}
                    className={`flex items-center justify-center px-2 py-1 rounded cursor-pointer ${
                        spiceLevel === 1 
                            ? 'bg-red-200 border border-red-400 text-red-700' 
                            : 'bg-gray-100 border border-gray-200 text-red-600 hover:bg-gray-200'
                    }`}
                >
                    <span>🌶️</span>
                </div>
                <div 
                    onClick={() => setSpiceLevel(2)}
                    className={`flex items-center justify-center px-2 py-1 rounded cursor-pointer ${
                        spiceLevel === 2 
                            ? 'bg-red-200 border border-red-400 text-red-700' 
                            : 'bg-gray-100 border border-gray-200 text-red-600 hover:bg-gray-200'
                    }`}
                >
                    <span>🌶️🌶️</span>
                </div>
                <div 
                    onClick={() => setSpiceLevel(3)}
                    className={`flex items-center justify-center px-2 py-1 rounded cursor-pointer ${
                        spiceLevel === 3 
                            ? 'bg-red-200 border border-red-400 text-red-700' 
                            : 'bg-gray-100 border border-gray-200 text-red-600 hover:bg-gray-200'
                    }`}
                >
                    <span>🌶️🌶️🌶️</span>
                </div>
            </div>
        </div>
    );
};

export default SpiceLevelSelector;

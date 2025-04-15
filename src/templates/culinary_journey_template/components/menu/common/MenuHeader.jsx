import React, { useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../../../common/redux';

export function MenuHeader({ title, description }) {
  const navigate = useNavigate();
  
  // Get menu data from Redux store instead of useMenu hook
  const { items, categories } = useAppSelector(state => state.menu);
  
  // Transform Redux menu data to match the expected format
  const menuData = useMemo(() => {
    return {
      categories: categories.map(category => {
        // Handle case where category might be an object or a string
        if (typeof category === 'string') {
          return {
            id: category,
            name: category.charAt(0).toUpperCase() + category.slice(1)
          };
        } else if (typeof category === 'object' && category !== null) {
          // If category is already an object with id and name
          return {
            id: category.id || category.name || 'unknown',
            name: category.name || category.id || 'Unknown'
          };
        } else {
          // Fallback for unexpected category format
          return {
            id: 'unknown',
            name: 'Unknown'
          };
        }
      })
    };
  }, [categories]);

  return (
    <div className="mb-12">
      {/* Category navigation */}
      <div className="flex flex-wrap gap-4 mb-8">
        {menuData.categories.map((category) => (
          <Link
            key={category.id}
            to={`/menu/${category.id}`}
            className="px-4 py-2 rounded-full text-sm font-medium transition-colors bg-gray-800 text-gray-300 hover:bg-gray-700"
          >
            {category.name}
          </Link>
        ))}
      </div>

      {/* Back button and title */}
      <div>
        <button 
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </button>
        <h1 className="text-4xl font-serif mb-4 text-white">{title}</h1>
        {description && (
          <p className="text-gray-400 max-w-2xl">{description}</p>
        )}
      </div>
    </div>
  );
}

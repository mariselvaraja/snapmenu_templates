import React from 'react';
import { useInView } from '../../../hooks/useInView';
import { Wine } from 'lucide-react';

export function ExperienceCard({ icon, title, description, index = 0 }) {
  const { ref, inView } = useInView({ threshold: 0.2 });

  return (
    <div 
      ref={ref}
      className={`transform transition-all duration-1000 delay-${index * 200} ${
        inView 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-20'
      }`}
    >
      <div className="relative group">
        <div className="absolute inset-0 bg-black/5 rounded-xl transform rotate-3 transition-transform group-hover:rotate-0" />
        <div className="relative bg-white p-8 rounded-xl transition-transform group-hover:-translate-y-2">
          <div className="mb-6 text-orange-600 transform transition-transform duration-500 group-hover:scale-110 animate-float">
            {icon || <Wine className="h-8 w-8" />}
          </div>
          <h3 className="text-xl font-serif mb-4">{title || "Culinary Experience"}</h3>
          <p className="text-gray-600 leading-relaxed">{description || "Experience our unique culinary offerings with carefully selected ingredients and expert preparation."}</p>
        </div>
      </div>
    </div>
  );
}

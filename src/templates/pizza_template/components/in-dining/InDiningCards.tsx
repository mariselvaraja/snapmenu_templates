import React, { useEffect } from 'react';

interface InDiningCardsProps {
  onFoodMenuClick: () => void;
  onDrinksMenuClick: () => void;
}

export default function InDiningCards({ onFoodMenuClick, onDrinksMenuClick }: InDiningCardsProps) {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 mt-10 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Food Menu Card */}
        <div 
          className="border border-theme-accent hover:border-theme-accent/50  hover:shadow-[0_22px_43px_rgba(0,0,0,0.15)] transition-all duration-300 cursor-pointer overflow-hidden rounded-xl shadow-md  transition-shadow duration-300 bg-white border-2"
          onClick={onFoodMenuClick} style={{ borderColor: '#ef4421' }}
        >
          <div className="h-48 md:h-56 bg-white relative flex items-center justify-center">
            <div className="text-center text-black-800">
              {/* Fork and Spoon Icon */}
              <div className="mb-3 flex justify-center">
                <svg stroke="currentColor" fill="#ef4421" stroke-width="0" viewBox="0 0 416 512" className="text-theme-accent text-5xl mb-4 group-hover:scale-110 transition-transform duration-300" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M207.9 15.2c.8 4.7 16.1 94.5 16.1 128.8 0 52.3-27.8 89.6-68.9 104.6L168 486.7c.7 13.7-10.2 25.3-24 25.3H80c-13.7 0-24.7-11.5-24-25.3l12.9-238.1C27.7 233.6 0 196.2 0 144 0 109.6 15.3 19.9 16.1 15.2 19.3-5.1 61.4-5.4 64 16.3v141.2c1.3 3.4 15.1 3.2 16 0 1.4-25.3 7.9-139.2 8-141.8 3.3-20.8 44.7-20.8 47.9 0 .2 2.7 6.6 116.5 8 141.8.9 3.2 14.8 3.4 16 0V16.3c2.6-21.6 44.8-21.4 48-1.1zm119.2 285.7l-15 185.1c-1.2 14 9.9 26 23.9 26h56c13.3 0 24-10.7 24-24V24c0-13.2-10.7-24-24-24-82.5 0-221.4 178.5-64.9 300.9z"></path></svg>
              </div>
              <h2 className="text-lg md:text-xl font-bold mb-2 text-black-800">
                Food Menu
              </h2>
              <p className="text-base md:text-sm text-black-600">
                Explore our delicious dishes
              </p>
            </div>
          </div>
        </div>

        {/* Drinks Menu Card */}
        <div 
          className="border border-theme-accent hover:border-theme-accent/50  hover:shadow-[0_22px_43px_rgba(0,0,0,0.15)] transition-all duration-300 cursor-pointer overflow-hidden rounded-xl shadow-md  transition-shadow duration-300 bg-white border-2"
          onClick={onDrinksMenuClick}  style={{ borderColor: '#ef4421' }}
        >
          <div className="h-48 md:h-56 bg-white relative flex items-center justify-center">
            <div className="text-center text-black-800">
              {/* Cocktail Icon */}
              <div className="mb-3 flex justify-center">
                <svg stroke="currentColor" fill="#ef4421" stroke-width="0" viewBox="0 0 576 512" className="text-theme-accent text-5xl mb-4 group-hover:scale-110 transition-transform duration-300" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M296 464h-56V338.78l168.74-168.73c15.52-15.52 4.53-42.05-17.42-42.05H24.68c-21.95 0-32.94 26.53-17.42 42.05L176 338.78V464h-56c-22.09 0-40 17.91-40 40 0 4.42 3.58 8 8 8h240c4.42 0 8-3.58 8-8 0-22.09-17.91-40-40-40zM432 0c-62.61 0-115.35 40.2-135.18 96h52.54c16.65-28.55 47.27-48 82.64-48 52.93 0 96 43.06 96 96s-43.07 96-96 96c-14.04 0-27.29-3.2-39.32-8.64l-35.26 35.26C379.23 279.92 404.59 288 432 288c79.53 0 144-64.47 144-144S511.53 0 432 0z"></path></svg>
              </div>
              <h2 className="text-lg md:text-xl font-bold mb-2 text-black-800">
                Drinks Menu
              </h2>
              <p className="text-base md:text-sm text-black-600">
                Discover our beverage selection
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
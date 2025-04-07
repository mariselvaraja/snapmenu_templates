import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurantRequest } from './redux/restaurantSlice';
import { 
    BrowserRouter as Router, 
    Route, 
    Routes, 
    Outlet
} from "react-router-dom";
import './App.css';

// Import root context providers
import { RootSiteContentProvider } from './context/RootSiteContentContext';
import { RootMenuProvider } from './context/RootMenuContext';

// Restaurant Loading Animation Component
const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="relative mb-8">
        {/* Plate */}
        <div className="w-32 h-32 bg-white rounded-full shadow-xl flex items-center justify-center">
          {/* Food items animating */}
          <div className="absolute animate-bounce delay-100 duration-1000">
            <svg className="w-12 h-12 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11 14.62l-6.47-6.47a.75.75 0 00-1.06 1.06l7 7c.29.29.77.29 1.06 0l7-7a.75.75 0 10-1.06-1.06L11 14.62z"></path>
            </svg>
          </div>
          
          {/* Fork and knife */}
          <div className="absolute -right-8 -top-2 transform rotate-45">
            <div className="w-1 h-16 bg-gray-400 rounded-full"></div>
          </div>
          <div className="absolute -left-8 -top-2 transform -rotate-45">
            <div className="w-1 h-16 bg-gray-400 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-400 rounded-full -mt-2 -ml-1"></div>
          </div>
        </div>
        
        {/* Steam animation */}
        <div className="absolute -top-8 left-10 opacity-0 animate-steam">
          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path>
          </svg>
        </div>
        <div className="absolute -top-10 left-14 opacity-0 animate-steam animation-delay-300">
          <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path>
          </svg>
        </div>
        <div className="absolute -top-6 left-18 opacity-0 animate-steam animation-delay-600">
          <svg className="w-2 h-2 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path>
          </svg>
        </div>
      </div>
      
      <div className="text-2xl font-bold text-amber-800 mb-2">Setting the Table</div>
      <div className="text-lg text-amber-700 mb-8">Loading your culinary experience...</div>
      
      {/* Loading progress bar */}
      <div className="w-64 h-2 bg-amber-200 rounded-full overflow-hidden">
        <div className="h-full bg-amber-600 rounded-full animate-progress"></div>
      </div>
      
      {/* Add CSS for custom animations */}
      <style jsx>{`
        @keyframes steam {
          0% { opacity: 0; transform: translateY(0) scale(1); }
          50% { opacity: 0.7; transform: translateY(-10px) scale(1.2); }
          100% { opacity: 0; transform: translateY(-20px) scale(1.5); }
        }
        @keyframes progress {
          0% { width: 0%; }
          50% { width: 70%; }
          75% { width: 85%; }
          90% { width: 95%; }
          100% { width: 100%; }
        }
        .animate-steam {
          animation: steam 2s infinite;
        }
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
        .animate-progress {
          animation: progress 2.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

// Restaurant-themed Error Display Component
const ErrorDisplay = ({ message }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-orange-100">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full border-t-4 border-red-500 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-red-100 rounded-full opacity-50"></div>
        <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-amber-100 rounded-full opacity-50"></div>
        
        <div className="relative">
          {/* Restaurant-themed error icon */}
          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6">
            <div className="absolute w-16 h-16 bg-red-100 rounded-full"></div>
            <div className="relative">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938-9h13.856c1.54 0 2.502 1.667 1.732 3L13.732 15c-.77 1.333-2.694 1.333-3.464 0L3.34 7c-.77-1.333.192-3 1.732-3z"></path>
              </svg>
            </div>
          </div>
          
          <h2 className="mb-4 text-2xl font-bold text-center text-red-800">Menu Unavailable</h2>
          <p className="text-center text-gray-700 mb-6">{message}</p>
          
          {/* Decorative restaurant elements */}
          <div className="flex justify-center space-x-8 opacity-30 mt-6">
            <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z"></path>
            </svg>
            <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

// Import template layouts
import { CasualDiningLayout } from './templates/casual_dining_template_snapmenu/src/route';
import { CulinaryJourneyLayout } from './templates/culinary_journey_template_snapmenu/src/CulinaryJourneyLayout';
import { PizzaLayout } from './templates/pizza_template_snapmenu/src/route';

// Import context providers and components
import { SiteContentProvider } from './templates/eatflow_template_snapmenu/src/context/SiteContentContext';
import { MenuProvider } from './templates/eatflow_template_snapmenu/src/context/MenuContext';
import { CartProvider } from './templates/eatflow_template_snapmenu/src/context/CartContext';
import { SiteContentProvider as PizzaSiteContentProvider } from './templates/pizza_template_snapmenu/src/context/SiteContentContext';
import { MenuProvider as PizzaMenuProvider } from './templates/pizza_template_snapmenu/src/context/MenuContext';
import { MenuProvider as CasualDiningMenuProvider } from './templates/casual_dining_template_snapmenu/src/context/MenuContext';
import { ContentProvider as CasualDiningContentProvider } from './templates/casual_dining_template_snapmenu/src/context/ContentContext';

// Import template layouts
import { EatflowLayout } from './templates/eatflow_template_snapmenu/src/route';


const App = () => {
    const dispatch = useDispatch();
    const restaurant = useSelector((state) => state.restaurant?.data?.products?.[0]);
    const loading = useSelector((state) => state.restaurant.loading);
    const error = useSelector((state) => state.restaurant.error);

    // Function to extract subdomain from URL
    function getSubdomain(url) {
        const { hostname } = new URL(url);
        const domainParts = hostname.split('.');

        // Assuming the last two parts are the domain and TLD
        // if (domainParts.length > 2) {
        //     return domainParts.slice(0, -2).join('.');
        // }
        return "tonyspizza"; // No subdomain present, use tonyspizza as default
    }

    useEffect(() => {
        let host = getSubdomain(window.location.href);
        dispatch(fetchRestaurantRequest(host || 'snapmenu'));
    }, [dispatch]);

    useEffect(() => {
     if(restaurant)
     {
      sessionStorage.setItem('rid', restaurant.restaurant_id)
      console.log("Restaurant ID set in session storage:", restaurant.restaurant_id)
     }
    }
    ,[restaurant])

    console.log("Redux State:", useSelector((state) => state.restaurant));

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorDisplay message={error} />;
    if (!restaurant) return <ErrorDisplay message="Restaurant not found" />;

    // Extract restaurant_id and isPreview from the restaurant data
    const restaurant_id = restaurant.restaurant_id;
    const urlParams = new URLSearchParams(window.location.search);
    const isPreviewParam = urlParams.get('preview');
    const isPreview = isPreviewParam ? true : false;
    
    console.log("Restaurant data:", restaurant);
    console.log("Restaurant ID:", restaurant_id);
    console.log("Is Preview:", isPreview);


    // Wrap all templates with the root context providers, passing restaurant_id and isPreview
    return (
        <RootSiteContentProvider restaurant_id={restaurant_id} isPreview={isPreview}>
            <RootMenuProvider restaurant_id={restaurant_id} isPreview={isPreview}>
                {(() => {
                    // Render the appropriate template based on restaurant.template
                    switch (restaurant.template_id) {
                        case "casual_dining":
                            return (
                                <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                                    <Routes>
                                        <Route path="/*" element={
                                            <CasualDiningContentProvider>
                                                <CasualDiningMenuProvider>
                                                    <CasualDiningLayout restaurant={restaurant} />
                                                </CasualDiningMenuProvider>
                                            </CasualDiningContentProvider>
                                        } />
                                    </Routes>
                                </Router>
                            );
                        case "culinary_journey":
                            return (
                                <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                                    <Routes>
                                        <Route path="/*" element={<CulinaryJourneyLayout restaurant={restaurant} />} />
                                    </Routes>
                                </Router>
                            );
                        case "pizza":
                            return (
                                <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                                    <Routes>
                                        <Route path="/*" element={
                                            <PizzaSiteContentProvider>
                                                <PizzaMenuProvider>
                                                    <PizzaLayout restaurant={restaurant} />
                                                </PizzaMenuProvider>
                                            </PizzaSiteContentProvider>
                                        } />
                                    </Routes>
                                </Router>
                            );
                        case "eatflow":
                            return (
                                <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                                    <Routes>
                                        <Route path="/*" element={
                                            <SiteContentProvider 
                                                restaurant_id={restaurant.restaurant_id} 
                                                isPreview={restaurant.isPreview}
                                            >
                                                <MenuProvider 
                                                    restaurant_id={restaurant.restaurant_id} 
                                                    isPreview={restaurant.isPreview}
                                                >
                                                    <CartProvider>
                                                        <EatflowLayout />
                                                    </CartProvider>
                                                </MenuProvider>
                                            </SiteContentProvider>
                                        } />
                                    </Routes>
                                </Router>
                            );
                        default:
                            return <ErrorDisplay message={`Template not found: ${restaurant.template_id}`} />;
                    }
                })()}
            </RootMenuProvider>
        </RootSiteContentProvider>
    );
};

export default App;

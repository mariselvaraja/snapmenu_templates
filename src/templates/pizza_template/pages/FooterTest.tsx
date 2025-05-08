import React from 'react';
import Footer from '../components/Footer';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import sampleData from '../data/sampleFooterData.json';

// Create a simple reducer that returns the sample data
const siteContentReducer = (state = { rawApiResponse: JSON.stringify(sampleData) }, action: any) => {
  return state;
};

// Create a store with the reducer
const store = configureStore({
  reducer: {
    siteContent: siteContentReducer
  }
});

const FooterTest: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-900 flex flex-col">
        <main className="flex-grow flex items-center justify-center">
          <div className="text-white text-center">
            <h1 className="text-4xl font-bold mb-4">Footer Test Page</h1>
            <p className="text-xl">Scroll down to see the footer with policy modals</p>
          </div>
        </main>
        <Footer />
      </div>
    </Provider>
  );
};

export default FooterTest;

import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';

export function Confirmation() {
  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <div className="relative h-[70vh]">
      <Navigation />
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1579888944584-95d67062557f?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Contact background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 h-[calc(70vh-120px)] flex items-center justify-center text-center">
          <div>
            <div className="flex justify-center mb-6">
              <CheckCircle className="w-16 h-16 text-green-400" />
            </div>
            <h1 className="text-7xl font-bold text-white mb-8">Order Confirmed!</h1>
            <p className="text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Thank you for your order. We'll have it ready for pickup soon.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center">
          <div className="bg-gray-100 rounded-lg shadow-md p-6 w-full max-w-md mb-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Order Details</h2>
            <p className="text-gray-600">Thursday, March 6</p>
            <p className="text-gray-600">1:33 PM</p>
            <p className="text-gray-600">marirajayt508@gmail.com</p>
            <p className="text-gray-600">(090) 801-2208</p>
          </div>

          <div className="bg-gray-100 rounded-lg shadow-md p-6 w-full max-w-md mb-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Order Summary</h2>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <p className="text-gray-700">1x Classic Caesar Salad</p>
              <p className="text-gray-700">$16.00</p>
            </div>
            <div className="flex justify-between items-center mt-2">
              <p className="text-lg font-semibold">Total</p>
              <p className="text-lg font-semibold">$16.00</p>
            </div>
          </div>

          <Link to="/menu" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700 transition mt-4">
            Order Something Else
          </Link>
          <Link to="/" className="text-green-500 mt-2">Return to Home</Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}

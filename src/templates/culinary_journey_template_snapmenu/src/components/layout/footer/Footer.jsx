import React from 'react';
import { Utensils } from 'lucide-react';
import { useContent } from '../../../context';
import { FooterNewsletter } from './FooterNewsletter';
import { FooterLinks } from './FooterLinks';
import { FooterSocial } from './FooterSocial';

export function Footer() {
  const { content, siteContent, loading } = useContent();

  if (loading) {
    return (
      <footer className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="flex items-center space-x-2">
            <Utensils className="h-6 w-6" />
            <span className="text-2xl font-serif">Loading...</span>
          </div>
        </div>
      </footer>
    );
  }

  // Default brand data
  const defaultBrand = {
    name: "Culinary Journey",
    logo: {
      url: null,
      text: "Culinary Journey"
    }
  };

  // Use siteContent if available, otherwise fall back to content
  const brand = siteContent?.brand || content?.brand || defaultBrand;
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Brand and Newsletter */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <Utensils className="h-6 w-6" />
              <span className="text-2xl font-serif">{brand.name}</span>
            </div>
            <FooterNewsletter />
          </div>

          {/* Links */}
          <FooterLinks />
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <FooterSocial />
      <p className="text-gray-400 text-sm">
        {siteContent?.footer?.copyright?.text || content?.footer?.copyright?.text || "© 2025 All rights reserved."}
      </p>
        </div>
      </div>
    </footer>
  );
}

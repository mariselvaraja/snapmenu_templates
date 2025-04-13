import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils, Instagram, Facebook, Twitter } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

export function Footer() {
  const { siteContent, loading } = useSiteContent();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!siteContent) {
    return <div>Error: Site content not loaded.</div>;
  }

  const { brand, footer } = siteContent;

  // Function to render the appropriate social icon
  const renderSocialIcon = (iconName) => {
    switch(iconName) {
      case 'Instagram':
        return <Instagram className="w-6 h-6" />;
      case 'Facebook':
        return <Facebook className="w-6 h-6" />;
      case 'Twitter':
        return <Twitter className="w-6 h-6" />;
      default:
        return null;
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12">
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <Utensils className="h-8 w-8 text-green-400" />
              <span className="text-2xl font-bold">{brand?.name}</span>
            </Link>
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-4">{footer?.newsletter?.title}</h4>
              <p className="text-gray-400 mb-4">{footer?.newsletter?.description}</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="px-4 py-2 rounded-l-lg w-full focus:outline-none"
                />
                <button className="bg-green-500 text-white px-4 py-2 rounded-r-lg hover:bg-green-600 transition">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          
          {footer?.linkGroups?.map((group, index) => (
            <div key={index}>
              <h4 className="text-lg font-semibold mb-4">{group.title}</h4>
              <ul className="space-y-2 text-gray-400">
                {group.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link to={link.href} className="hover:text-green-400 transition">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              {footer?.social?.links?.map((social, index) => (
                <a 
                  key={index} 
                  href={social.href} 
                  className="hover:text-green-400 transition"
                  aria-label={social.ariaLabel}
                >
                  {renderSocialIcon(social.icon)}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>{footer?.copyright?.text}</p>
        </div>
      </div>
    </footer>
  );
}

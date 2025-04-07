import React from 'react';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRootSiteContent } from '../../../../context/RootSiteContentContext';

export default function Footer() {
  const { siteContent } = useRootSiteContent();
  const brand = (siteContent as any)?.navigationBar?.brand || (siteContent as any)?.brand || { name: "Pizza Restaurant" };
  const footer = (siteContent as any)?.footer || {};
  const navigation = (siteContent as any)?.navigationBar?.navigation || (siteContent as any)?.navigation || { links: [] };

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">{brand.name}</h3>
            {footer?.newsletter && (
          <div className="mb-8">
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">{footer.newsletter.title}</h4>
            <p className="text-gray-400 mb-4">{footer.newsletter.description}</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email address"
                className="bg-gray-800 border-gray-700 border rounded-l-md py-2 px-4 text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 flex-grow"
              />
              <button className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-r-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                Subscribe
              </button>
            </div>
          </div>
        )}

          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {navigation.links.filter(link => link.isEnabled).map((link, index) => (
                <li key={index}>
                  <Link to={link.path} className="text-gray-300 hover:text-white">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          {footer?.servicesSection && (
            <div>
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">{footer.servicesSection.title}</h4>
              <ul className="space-y-2">
                {footer.servicesSection.links.map((link: any, index: number) => (
                  <li key={index}>
                    <a href={link.href} className="text-gray-300 hover:text-primary-500">{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          
        </div>

        {/* {footer?.newsletter && (
          <div className="mb-8">
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">{footer.newsletter.title}</h4>
            <p className="text-gray-400 mb-4">{footer.newsletter.description}</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email address"
                className="bg-gray-800 border-gray-700 border rounded-l-md py-2 px-4 text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 flex-grow"
              />
              <button className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-r-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                Subscribe
              </button>
            </div>
          </div>
        )} */}

        <div className="md:flex md:items-center md:justify-between border-t border-gray-800 pt-8">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-400 text-sm">{footer?.copyright?.text}</p>
          </div>
          <div className="flex space-x-4">
            {footer?.social?.links?.map((socialLink: any, index: number) => {
              let IconComponent: React.FC<any> | null = null;
              if (socialLink.platform === 'Facebook') {
                IconComponent = Facebook;
              } else if (socialLink.platform === 'Instagram') {
                IconComponent = Instagram;
              } else if (socialLink.platform === 'Twitter') {
                IconComponent = Twitter;
              } else {
                return null;
              }
              return (
                <a key={index} href={socialLink.href} className="text-gray-400 hover:text-white">
                  <IconComponent className="h-5 w-5" aria-label={socialLink.ariaLabel} />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}

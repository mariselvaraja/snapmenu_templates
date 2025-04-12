import { Facebook, Instagram, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteContent } from '../context/SiteContentContext';

export default function Footer() {
  const siteContent = useSiteContent();
  const { navigationBar } = siteContent;
  const { brand, navigation } = navigationBar;
  const footer = siteContent?.footer || {
    newsletter: {
      title: "Subscribe to our newsletter",
      description: "Stay updated with our latest news and offers"
    },
    servicesSection: {
      title: "Our Services",
      links: [
        { label: "Dine In", url: "/menu" },
        { label: "Takeout", url: "/order" },
        { label: "Delivery", url: "/order" },
        { label: "Catering", url: "/contact" },
        { label: "Private Events", url: "/events" }
      ]
    },
    copyright: {
      text: "© 2025 Chris Restaurant. All rights reserved."
    },
    social: {
      links: [
        { icon: "Facebook", url: "https://facebook.com" },
        { icon: "Instagram", url: "https://instagram.com" },
        { icon: "Twitter", url: "https://twitter.com" }
      ]
    }
  };

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

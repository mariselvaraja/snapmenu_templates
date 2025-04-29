import { Facebook, Instagram, Twitter, Utensils, Pizza } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../../redux';
import { FaEnvelope, FaPhone, FaPhoneAlt } from 'react-icons/fa';

const UtensilsIcon = Utensils;
const PizzaIcon = Pizza;

export default function Footer() {
  const { rawApiResponse } = useAppSelector(state => state.siteContent);
  
  // Get site content from Redux state
  const siteContent = rawApiResponse ? 
    (typeof rawApiResponse === 'string' ? JSON.parse(rawApiResponse) : rawApiResponse) : 
    {};
  const navigationBar = siteContent?.navigationBar;
  const brand = navigationBar?.brand || { name: 'Pizza Planet' };
  const navigation = navigationBar?.navigation || { links: [] };
  const footer = siteContent?.footer;
  const contact = siteContent?.contact;

  // Extract navigation links for Quick Links section
  const quickLinks = navigation?.links?.filter((link: any) => link.isEnabled) || [];

  
  return (
    <footer className="bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section with Logo */}
          <div>
            <div className="flex items-center mb-4">
              {brand?.logo?.icon ? (
                <img src={brand.logo.icon} alt={brand.logo.text || 'Restaurant'} className="h-8 w-auto" />
              ) : (
                <PizzaIcon className="h-8 w-8 text-red-500" />
              )}
              <h3 className="text-xl font-bold ml-3">{brand?.logo?.text || brand?.name || "Pizza Planet"}</h3>
            </div>
            <p className="text-gray-400 mb-4">{footer?.tagline || "Serving the best pizza in the galaxy since 1995."}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <ul className="space-y-2">
                  <li>
                    <Link to="/menu" className="text-gray-400 hover:text-white">Menu</Link>
                  </li>
                  <li>
                    <Link to="/locations" className="text-gray-400 hover:text-white">Locations</Link>
                  </li>
                </ul>
              </div>
              <div>
                <ul className="space-y-2">
                  <li>
                    <Link to="/about" className="text-gray-400 hover:text-white">About Us</Link>
                  </li>
                  <li>
                    <Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link>
                  </li>
                </ul>
              </div>
              <div>
                <ul className="space-y-2">
                  {quickLinks.slice(0, 2).map((link: any, index: number) => (
                    <li key={index}>
                      <Link to={link.path} className="text-gray-400 hover:text-white">{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Info</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">{contact?.infoCards?.address?.street || "123 Space Station"}</li>
              <li className="text-gray-400">{contact?.infoCards?.address?.city || "Galaxy Way"}{contact?.infoCards?.address?.state ? `, ${contact.infoCards.address.state}` : ''}{contact?.infoCards?.address?.zip ? ` ${contact.infoCards.address.zip}` : ''}</li>
              Phone
              {contact?.infoCards?.phone?.numbers && Array.isArray(contact.infoCards.phone.numbers) && contact.infoCards.phone.numbers.length > 0 ? (
                contact.infoCards.phone.numbers.map((phoneNumber: any, index: number) => (
                  <li key={`phone-${index}`} className="text-gray-400 flex items-center gap-2">
                    <FaPhoneAlt/> {typeof phoneNumber === 'string' ? phoneNumber : (typeof phoneNumber === 'object' ? JSON.stringify(phoneNumber) : "(555) 123-4567")}
                  </li>
                ))
              ) : (
                <li className="text-gray-400">Phone: (555) 123-4567</li>
              )}
              
              {contact?.infoCards?.email?.addresses && Array.isArray(contact.infoCards.email.addresses) && contact.infoCards.email.addresses.length > 0 ? (
                contact.infoCards.email.addresses.map((emailAddress: any, index: number) => (
                  <li key={`email-${index}`} className="text-gray-400 flex items-center gap-2">
                 Email: {emailAddress || "info@pizzaplanet.com"}
                  </li>
                ))
              ) : (
                <li className="text-gray-400">Email: info@pizzaplanet.com</li>
              )}
            </ul>
          </div>

          {/* Follow Us - Only show if there are social links */}
          {footer?.social?.links && footer.social.links.filter((link: any) => link.href).length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                {footer.social.links.filter((link: any) => link.href).map((socialLink: any, index: number) => {
                  const iconMap: Record<string, React.FC<any>> = {
                    Facebook: Facebook,
                    Instagram: Instagram,
                    Twitter: Twitter
                  };
                  
                  const IconComponent = iconMap[socialLink.platform] || iconMap[socialLink.icon];
                  
                  if (!IconComponent) return null;
                  
                  return (
                    <a 
                      key={index} 
                      href={socialLink.href} 
                      className="text-gray-400 hover:text-white"
                      aria-label={socialLink.ariaLabel || socialLink.platform}
                    >
                      <IconComponent className="h-6 w-6" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Copyright Section with horizontal line */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            {footer?.copyright?.text || "© 2025 Pizza Planet. All rights reserved."}
          </p>
        </div>
      </div>
    </footer>
  );
}

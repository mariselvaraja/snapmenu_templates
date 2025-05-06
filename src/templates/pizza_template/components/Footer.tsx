import { Facebook, Instagram, Twitter, Utensils, Pizza } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../../redux';
import { FaEnvelope, FaPhone, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';

export default function Footer() {
  const { rawApiResponse } = useAppSelector(state => state.siteContent);
  
  // Get site content from Redux state
  const siteContent = rawApiResponse ? 
    (typeof rawApiResponse === 'string' ? JSON.parse(rawApiResponse) : rawApiResponse) : 
    {};
  const navigationBar = siteContent?.navigationBar;
  const brand = navigationBar?.brand;
  const navigation = navigationBar?.navigation;
  const footer = siteContent?.footer;
  const contact = siteContent?.contact;

  // Use only API data
  const footerData = footer;
  
  // Handle both navigation formats: navigation: [] or navigation: { links: [] }
  // Ensure navigationLinks is always an array
  let navigationLinks = [];
  
  if (Array.isArray(navigation)) {
    navigationLinks = navigation;
  } else if (navigation && Array.isArray(navigation.links)) {
    navigationLinks = navigation.links;
  }

  if (Array.isArray(siteContent.navigation)) {
    navigationLinks = siteContent.navigation;
  } 

  // Extract navigation links for Quick Links section
  const quickLinks = footerData?.quickLinks || navigationLinks.filter((link: any) => link && link.isEnabled) || [];
  
  // Pizza slice SVG for decorative elements
  const PizzaSlice = () => (
    <svg className="w-6 h-6 text-red-500 opacity-30" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,10.84 21.79,9.69 21.39,8.61L12,2M15.5,8A1.5,1.5 0 0,1 17,9.5A1.5,1.5 0 0,1 15.5,11A1.5,1.5 0 0,1 14,9.5A1.5,1.5 0 0,1 15.5,8M8.5,11A1.5,1.5 0 0,1 10,12.5A1.5,1.5 0 0,1 8.5,14A1.5,1.5 0 0,1 7,12.5A1.5,1.5 0 0,1 8.5,11M12,17.5A1.5,1.5 0 0,1 13.5,19A1.5,1.5 0 0,1 12,20.5A1.5,1.5 0 0,1 10.5,19A1.5,1.5 0 0,1 12,17.5Z" />
    </svg>
  );

  return (
    <footer className="relative bg-gradient-to-b from-gray-900 to-black text-white py-16 overflow-hidden">
      {/* Decorative pizza slices */}
      <div className="absolute top-0 left-0 w-24 h-24 opacity-10">
        <Pizza className="w-full h-full text-red-500" />
      </div>
      <div className="absolute bottom-0 right-0 w-32 h-32 opacity-10">
        <Pizza className="w-full h-full text-red-500" />
      </div>
      <div className="absolute top-1/4 right-1/4 w-16 h-16 opacity-5">
        <Pizza className="w-full h-full text-red-500" />
      </div>
      
      {/* Main content container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top decorative line */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent mb-16"></div>
        
        {/* Main sections grid - Link Groups only */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Link Groups - Excluding Restaurant and Services */}
          {footerData?.linkGroups && footerData.linkGroups
            .filter((group: any) => group.title !== "Restaurant" && group.title !== "Services")
            .map((group: any, groupIndex: number) => (
              <div key={`group-${groupIndex}`} className="backdrop-blur-sm bg-black/20 rounded-lg p-6 shadow-xl border border-gray-800/30 transform transition-all duration-300 hover:shadow-red-900/10 hover:-translate-y-1 h-full flex flex-col">
                <h3 className="text-xl font-bold mb-6 text-white border-b border-red-500/30 pb-2 flex items-center">
                  <PizzaSlice />
                  <span className="ml-2">{group.title}</span>
                </h3>
                <ul className="space-y-3 flex-grow">
                  {group.links && group.links.map((link: any, linkIndex: number) => (
                    <li key={`link-${groupIndex}-${linkIndex}`}>
                      <a 
                        href={link.href} 
                        className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block group"
                      >
                        <span className="inline-flex items-center">
                          <span className="w-0 h-0.5 bg-red-500 mr-0 group-hover:w-2 group-hover:mr-2 transition-all duration-300"></span>
                          {link.label}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>

        {/* Contact, Quick Links, and Follow Us in a single row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Contact Info */}
          <div className="backdrop-blur-sm bg-black/20 rounded-lg p-6 shadow-xl border border-gray-800/30 transform transition-all duration-300 hover:shadow-red-900/10 hover:-translate-y-1 h-full flex flex-col">
            <h3 className="text-xl font-bold mb-6 text-white border-b border-red-500/30 pb-2 flex items-center">
              <PizzaSlice />
              <span className="ml-2">Contact Us</span>
            </h3>
            <ul className="space-y-4 flex-grow">
              {footerData?.contactInfo?.address && (
                <li className="text-gray-300 flex items-start gap-3 group">
                  <FaMapMarkerAlt className="text-red-500 group-hover:text-red-400 transition-colors mt-1 flex-shrink-0" /> 
                  <span className="group-hover:text-white transition-colors">{footerData.contactInfo.address}</span>
                </li>
              )}
              
              {footerData?.contactInfo?.phone && (
                <li className="text-gray-300 flex items-center gap-3 group">
                  <FaPhoneAlt className="text-red-500 group-hover:text-red-400 transition-colors flex-shrink-0" /> 
                  <span className="group-hover:text-white transition-colors">{footerData.contactInfo.phone}</span>
                </li>
              )}
              
              {footerData?.contactInfo?.email && (
                <li className="text-gray-300 flex items-center gap-3 group">
                  <FaEnvelope className="text-red-500 group-hover:text-red-400 transition-colors flex-shrink-0" /> 
                  <span className="group-hover:text-white transition-colors">{footerData.contactInfo.email}</span>
                </li>
              )}
              
              {/* Fallback to contact from API if contactInfo is not available */}
              {!footerData?.contactInfo && contact?.infoCards?.address?.street && (
                <>
                  <li className="text-gray-300 flex items-start gap-3 group">
                    <FaMapMarkerAlt className="text-red-500 group-hover:text-red-400 transition-colors mt-1 flex-shrink-0" />
                    <span className="group-hover:text-white transition-colors">
                      {contact.infoCards.address.street}
                    </span>
                  </li>
                  {contact.infoCards.address.city && (
                    <li className="text-gray-300 flex items-start gap-3 group">
                      <span className="text-red-500 opacity-0 w-4 flex-shrink-0"></span>
                      <span className="group-hover:text-white transition-colors">
                        {contact.infoCards.address.city}
                        {contact.infoCards.address.state ? `, ${contact.infoCards.address.state}` : ''}
                        {contact.infoCards.address.zip ? ` ${contact.infoCards.address.zip}` : ''}
                      </span>
                    </li>
                  )}
                </>
              )}
              
              {!footerData?.contactInfo && contact?.infoCards?.phone?.numbers && Array.isArray(contact.infoCards.phone.numbers) && contact.infoCards.phone.numbers.length > 0 && (
                contact.infoCards.phone.numbers.map((phoneNumber: any, index: number) => (
                  <li key={`phone-${index}`} className="text-gray-300 flex items-center gap-3 group">
                    <FaPhoneAlt className="text-red-500 group-hover:text-red-400 transition-colors flex-shrink-0" /> 
                    <span className="group-hover:text-white transition-colors">
                      {typeof phoneNumber === 'string' ? phoneNumber : (typeof phoneNumber === 'object' ? JSON.stringify(phoneNumber) : '')}
                    </span>
                  </li>
                ))
              )}
              
              {!footerData?.contactInfo && contact?.infoCards?.email?.addresses && Array.isArray(contact.infoCards.email.addresses) && contact.infoCards.email.addresses.length > 0 && (
                contact.infoCards.email.addresses.map((emailAddress: any, index: number) => (
                  <li key={`email-${index}`} className="text-gray-300 flex items-center gap-3 group">
                    <FaEnvelope className="text-red-500 group-hover:text-red-400 transition-colors flex-shrink-0" /> 
                    <span className="group-hover:text-white transition-colors">
                      {emailAddress}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Quick Links */}
          {quickLinks && quickLinks.length > 0 && (
            <div className="backdrop-blur-sm bg-black/20 rounded-lg p-6 shadow-xl border border-gray-800/30 transform transition-all duration-300 hover:shadow-red-900/10 hover:-translate-y-1 h-full flex flex-col">
              <h3 className="text-xl font-bold mb-6 text-white border-b border-red-500/30 pb-2 flex items-center">
                <PizzaSlice />
                <span className="ml-2">Quick Links</span>
              </h3>
              <div className="flex flex-col flex-grow justify-center">
                <div className="flex flex-wrap gap-3">
                  {quickLinks.map((link: any, index: number) => (
                    <a 
                      key={index} 
                      href={link.href} 
                      className="text-gray-300 hover:text-white transition-all duration-300 px-3 py-1.5 rounded-md hover:bg-red-900/20 border border-transparent hover:border-red-900/30 transform hover:-translate-y-1 text-sm"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Social Links */}
          {footerData?.social?.links && footerData.social.links.length > 0 && (
            <div className="backdrop-blur-sm bg-black/20 rounded-lg p-6 shadow-xl border border-gray-800/30 transform transition-all duration-300 hover:shadow-red-900/10 hover:-translate-y-1 h-full flex flex-col">
              <h3 className="text-xl font-bold mb-6 text-white border-b border-red-500/30 pb-2 flex items-center">
                <PizzaSlice />
                <span className="ml-2">Follow Us</span>
              </h3>
              <div className="flex flex-col flex-grow justify-center items-center">
                <div className="flex justify-center items-center space-x-6">
                  {footerData.social.links.map((socialLink: any, index: number) => {
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
                        className="text-gray-400 hover:text-red-500 transition-all duration-300 transform hover:scale-110 p-3 rounded-full hover:bg-black/30 border border-transparent hover:border-red-900/30 group"
                        aria-label={socialLink.ariaLabel || socialLink.platform}
                      >
                        <IconComponent className="h-7 w-7 group-hover:animate-pulse" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Privacy Links */}
        {footerData?.privacyDetails && (
          <div className="flex flex-wrap justify-center items-center gap-8 mb-10 max-w-4xl mx-auto">
            {footerData.privacyDetails.privacyPolicy && (
              <a href={footerData.privacyDetails.privacyPolicy} className="text-gray-400 hover:text-white text-sm transition-colors duration-300 hover:underline underline-offset-4">
                Privacy Policy
              </a>
            )}
            {footerData.privacyDetails.termsOfService && (
              <a href={footerData.privacyDetails.termsOfService} className="text-gray-400 hover:text-white text-sm transition-colors duration-300 hover:underline underline-offset-4">
                Terms of Service
              </a>
            )}
            {footerData.privacyDetails.cookiePolicy && (
              <a href={footerData.privacyDetails.cookiePolicy} className="text-gray-400 hover:text-white text-sm transition-colors duration-300 hover:underline underline-offset-4">
                Cookie Policy
              </a>
            )}
          </div>
        )}

        {/* Terms & Conditions */}
        {footerData?.termsConditions && (
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold mb-4 flex items-center justify-center">
              <PizzaSlice />
              <span className="ml-2">Terms & Conditions</span>
            </h3>
            {footerData.termsConditions.documentLink && (
              <a 
                href={footerData.termsConditions.documentLink} 
                className="text-gray-400 hover:text-white transition-colors duration-300 inline-block hover:underline underline-offset-4"
              >
                View Full Document
              </a>
            )}
            {footerData.termsConditions.lastUpdated && (
              <p className="text-gray-600 text-xs mt-2">
                Last updated: {footerData.termsConditions.lastUpdated}
              </p>
            )}
          </div>
        )}

        {/* Copyright Section with horizontal line */}
        <div className="border-t border-gray-800/50 pt-8 text-center max-w-4xl mx-auto">
          {footerData?.copyright?.text && (
            <p className="text-gray-500 text-sm">
              {footerData.copyright.text}
            </p>
          )}
          
          {/* Bottom decorative line */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent mt-8"></div>
        </div>
      </div>
    </footer>
  );
}

import { Facebook, Instagram, Twitter, Utensils, Pizza } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../../redux';
import { FaEnvelope, FaPhone, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { useState } from 'react';
import { PolicyModal } from '../shared/components/ui';

export default function Footer() {
  // State for policy modals
  const [activePolicy, setActivePolicy] = useState<'privacy' | 'terms' | 'cookie' | null>(null);
  const { rawApiResponse } = useAppSelector(state => state.siteContent);
  
  // Get site content from Redux state
  const siteContent = rawApiResponse ? 
    (typeof rawApiResponse === 'string' ? JSON.parse(rawApiResponse) : rawApiResponse) : 
    {};
  const navigationBar = siteContent?.navigationBar;
  const navigation = navigationBar?.navigation;
  const footer = siteContent?.footer;
  const contact = siteContent?.contact;
  const siteConfiguration = siteContent?.siteConfiguration; 

  console.log("siteConfiguration", rawApiResponse)

  // hidePrivacyAndPolicy: true,
  // hideCookiePolicy: true,
  // hideTermsAndCondition: true

  console.log(" contact", contact)
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
    <footer className="relative bg-gradient-to-b from-gray-900 to-black text-white  overflow-hidden">
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
        <div className="w-full h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent mb-8 sm:mb-12 lg:mb-16"></div>
        
        {/* Main sections grid - Link Groups only */}
    

        {/* Contact, Quick Links, and Follow Us in a single row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 lg:mb-16">
          {/* Contact Info */}
          <div className="backdrop-blur-sm bg-black/20 rounded-lg p-4 sm:p-6 shadow-xl border border-gray-800/30 transform transition-all duration-300 hover:shadow-red-900/10 hover:-translate-y-1 h-full flex flex-col">
            <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-white border-b border-red-500/30 pb-2 flex items-center">
              <PizzaSlice />
              <span className="ml-2">Contact Us</span>
            </h3>
            <ul className="space-y-4 flex-grow">
              {contact?.address && (
                <li className="text-gray-300 flex items-start gap-3 group">
                  <FaMapMarkerAlt className="text-red-500 group-hover:text-red-400 transition-colors mt-1 flex-shrink-0" /> 
                  <span className="group-hover:text-white transition-colors">{contact.address}</span>
                </li>
              )}
              
              {contact?.phone && (
                <li className="text-gray-300 flex items-center gap-3 group">
                  <FaPhoneAlt className="text-red-500 group-hover:text-red-400 transition-colors flex-shrink-0" /> 
                  <span className="group-hover:text-white transition-colors">{contact.phone}</span>
                </li>
              )}
              
              {contact?.email && (
                <li className="text-gray-300 flex items-center gap-3 group">
                  <FaEnvelope className="text-red-500 group-hover:text-red-400 transition-colors flex-shrink-0" /> 
                  <span className="group-hover:text-white transition-colors">{contact.email}</span>
                </li>
              )}
              
      
      
  
            </ul>
          </div>

          {/* Quick Links */}
          {quickLinks && quickLinks.length > 0 && (
            <div className="backdrop-blur-sm bg-black/20 rounded-lg p-4 sm:p-6 shadow-xl border border-gray-800/30 transform transition-all duration-300 hover:shadow-red-900/10 hover:-translate-y-1 h-full flex flex-col">
              <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-white border-b border-red-500/30 pb-2 flex items-center">
                <PizzaSlice />
                <span className="ml-2">Quick Links</span>
              </h3>
              <div className="flex flex-col flex-grow justify-center">
                <div className="flex flex-wrap gap-3">
                  {quickLinks.map((link: any, index: number) => (
                    <a 
                      key={index} 
                      href={link.href} 
                      className="text-gray-300 hover:text-white transition-all duration-300 px-3 py-1.5 rounded-md hover:bg-red-900/20 border border-transparent hover:border-red-900/30 transform hover:-translate-y-1"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Social Links */}
          <>
          {footerData?.social?.links && footerData.social.links.length > 0 && (
            <div className="backdrop-blur-sm bg-black/20 rounded-lg p-4 sm:p-6 shadow-xl border border-gray-800/30 transform transition-all duration-300 hover:shadow-red-900/10 hover:-translate-y-1 h-full flex flex-col sm:col-span-2 lg:col-span-1">
              <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-white border-b border-red-500/30 pb-2 flex items-center">
                <PizzaSlice />
                <span className="ml-2">Follow Us</span>
              </h3>
              <div className="flex flex-col flex-grow justify-center items-center">
                <div className="flex justify-center items-center space-x-4 sm:space-x-6">
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
          )}</>
        </div>

        {/* Policy Links */}
      {   <div className="flex flex-wrap justify-center items-center gap-8 mb-10 max-w-4xl mx-auto">
          {!siteConfiguration?.hidePrivacyAndPolicy && footerData?.privacyPolicy && (
            <button 
              onClick={() => setActivePolicy('privacy')}
              className="text-gray-400 hover:text-white text-sm transition-colors duration-300 hover:underline underline-offset-4"
            >
              Privacy Policy
            </button>
          )}
          {!siteConfiguration?.hideTermsAndCondition && footerData?.termsConditions && (
            <button 
              onClick={() => setActivePolicy('terms')}
              className="text-gray-400 hover:text-white text-sm transition-colors duration-300 hover:underline underline-offset-4"
            >
              Terms & Conditions
            </button>
          )}
          {!siteConfiguration?.hideCookiePolicy && footerData?.cookiePolicy && (
            <button 
              onClick={() => setActivePolicy('cookie')}
              className="text-gray-400 hover:text-white text-sm transition-colors duration-300 hover:underline underline-offset-4"
            >
              Cookie Policy
            </button>
          )}
        </div>}


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
      {/* Policy Modals */}
      {activePolicy && (
        <PolicyModal
          isOpen={activePolicy !== null}
          onClose={() => setActivePolicy(null)}
          policy={getPolicyContent(activePolicy, footerData)}
        />
      )}
    </footer>
  );
}

// Add the policy modals at the end of the component
function getPolicyContent(type: 'privacy' | 'terms' | 'cookie', footerData: any) {
  if (type === 'privacy' && footerData?.privacyPolicy) {
    return {
      title: footerData.privacyPolicy.title || 'Privacy Policy',
      subtitle: footerData.privacyPolicy.subtitle || 'How we collect and use your information',
      content: footerData.privacyPolicy.content || '<p>Privacy policy content not available.</p>'
    };
  }
  
  if (type === 'terms' && footerData?.termsConditions) {
    return {
      title: footerData.termsConditions.title || 'Terms & Conditions',
      subtitle: footerData.termsConditions.subtitle || 'Legal terms and conditions for using our services',
      content: footerData.termsConditions.content || '<p>Terms and conditions content not available.</p>'
    };
  }
  
  if (type === 'cookie' && footerData?.cookiePolicy) {
    return {
      title: footerData.cookiePolicy.title || 'Cookie Policy',
      subtitle: footerData.cookiePolicy.subtitle || 'How we use cookies on our website',
      content: footerData.cookiePolicy.content || '<p>Cookie policy content not available.</p>'
    };
  }
  
  return {
    title: 'Policy',
    subtitle: '',
    content: '<p>Content not available.</p>'
  };
}

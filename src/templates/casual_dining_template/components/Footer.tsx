import React from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../../common/redux';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export function Footer() {
  const { rawApiResponse } = useAppSelector(state => state.siteContent);
  
  // Get site content from Redux state
  const siteContent = rawApiResponse ? 
    (typeof rawApiResponse === 'string' ? JSON.parse(rawApiResponse) : rawApiResponse) : 
    {};
  const fotter = siteContent?.fotter || {
    newsletter: {
      title: "Subscribe to our newsletter",
      description: "Stay updated with our latest news and offers"
    },
    linkGroups: [],
    copyright: {
      text: `© ${new Date().getFullYear()} Restaurant. All rights reserved.`
    },
    social: {
      links: [
        { icon: "Facebook", url: "https://facebook.com" },
        { icon: "Instagram", url: "https://instagram.com" },
        { icon: "Twitter", url: "https://twitter.com" }
      ]
    }
  };
  const brand = siteContent?.navigationBar?.brand || { name: "Restaurant" };

  return (
    <footer className="bg-zinc-900 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">{brand.name}</h3>
            <p className="text-white">
              {fotter?.newsletter?.description || "Subscribe to our newsletter for updates and special offers."}
            </p>
          </div>
          {fotter?.linkGroups?.length > 0 && fotter.linkGroups.map((group: any, index: number) => (
            <div key={index}>
              <h4 className="text-lg font-semibold text-white mb-4">{group.title}</h4>
              <div className="space-y-2">
                {group.links?.map((link: any, linkIndex: number) => (
                  <Link
                    key={linkIndex}
                    to={link.href || '#'}
                    className="block text-white hover:text-yellow-400 transition"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          {fotter?.social?.links?.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                {fotter.social.links.map((socialLink: any, index: number) => {
                  let IconComponent: React.FC<any> | null = null;
                  if (socialLink?.platform === 'Facebook' || socialLink?.icon === 'Facebook') {
                    IconComponent = Facebook;
                  } else if (socialLink?.platform === 'Instagram' || socialLink?.icon === 'Instagram') {
                    IconComponent = Instagram;
                  } else if (socialLink?.platform === 'Twitter' || socialLink?.icon === 'Twitter') {
                    IconComponent = Twitter;
                  } else {
                    return null;
                  }
                  return (
                    <a
                      key={index}
                      href={socialLink?.href || socialLink?.url || '#'}
                      className="text-yellow-400 hover:text-white transition"
                      aria-label={socialLink?.ariaLabel || socialLink?.platform || socialLink?.icon}
                    >
                      <IconComponent className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <div className="border-t border-zinc-800 mt-12 pt-8 text-center text-white">
          <p>{fotter?.copyright?.text || `© ${new Date().getFullYear()} Restaurant. All rights reserved.`}</p>
        </div>
      </div>
    </footer>
  );
}

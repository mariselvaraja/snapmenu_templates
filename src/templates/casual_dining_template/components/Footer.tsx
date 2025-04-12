import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ContentContext } from '../context/ContentContext';

export function Footer() {
  const { siteContent } = useContext(ContentContext) as any;
  const footerContent = siteContent.footer;

  return (
    <footer className="bg-zinc-900 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h3 className="text-2xl font-bold mb-4">{siteContent.brand.name}</h3>
            <p className="text-gray-400">
              {footerContent.newsletter.description}
            </p>
          </div>
          {footerContent.linkGroups.map((group: any, index: number) => (
            <div key={index}>
              <h4 className="text-lg font-semibold mb-4">{group.title}</h4>
              <div className="space-y-2">
                {group.links.map((link: any, linkIndex: number) => (
                  <Link
                    key={linkIndex}
                    to={link.href}
                    className="block text-gray-400 hover:text-yellow-400 transition"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              {footerContent.social.links.map((socialLink: any, index: number) => (
                <a
                  key={index}
                  href={socialLink.href}
                  className="text-gray-400 hover:text-yellow-400 transition"
                  aria-label={socialLink.ariaLabel}
                >
                  {socialLink.platform}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-zinc-800 mt-12 pt-8 text-center text-gray-400">
          <p>{footerContent.copyright.text}</p>
        </div>
      </div>
    </footer>
  );
}

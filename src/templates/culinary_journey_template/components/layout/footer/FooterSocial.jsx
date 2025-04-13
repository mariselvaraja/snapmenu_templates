import React from 'react';
import { Instagram, Facebook, Twitter } from 'lucide-react';
import { useContent } from '../../../context';

const iconComponents = {
  Instagram,
  Facebook,
  Twitter
};

export function FooterSocial() {
  const { content, rootContent, loading } = useContent();

  if (loading || !content) {
    return (
      <div className="flex gap-4">
        <div className="w-6 h-6 bg-gray-700/50 rounded-full animate-pulse"></div>
        <div className="w-6 h-6 bg-gray-700/50 rounded-full animate-pulse"></div>
        <div className="w-6 h-6 bg-gray-700/50 rounded-full animate-pulse"></div>
      </div>
    );
  }

  // Use rootContent if available, otherwise fall back to content
  const footerData = rootContent?.siteContent?.footer || content?.footer || {
    social: { links: [] }
  };
  
  const { links } = footerData.social || { links: [] };
  return (
    <div className="flex gap-4">
      {links && links.map((link) => {
        const IconComponent = link.icon && iconComponents[link.icon] ? iconComponents[link.icon] : Instagram;
        return (
          <a
            key={link.platform}
            href={link.href}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label={link.ariaLabel}
          >
            <IconComponent className="h-6 w-6" />
          </a>
        );
      })}
    </div>
  );
}

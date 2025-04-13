import React from 'react';
import { useContent } from '../../../context';

export function FooterLinks() {
  const { content, rootContent, loading } = useContent();

  if (loading || !content) {
    return (
      <div className="grid grid-cols-2 gap-8 lg:gap-16">
        <div>
          <h3 className="text-lg font-serif mb-4 text-white/50">Loading...</h3>
        </div>
      </div>
    );
  }

  // Use rootContent if available, otherwise fall back to content
  const footerData = rootContent?.siteContent?.footer || content?.footer || {
    linkGroups: []
  };
  
  const { linkGroups } = footerData;
  return (
    <div className="grid grid-cols-2 gap-8 lg:gap-16">
      {linkGroups && linkGroups.map((group, index) => (
        <div key={group.title}>
          <h3 className="text-lg font-serif mb-4 text-white">{group.title}</h3>
          <ul className="space-y-2">
            {group.links && group.links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

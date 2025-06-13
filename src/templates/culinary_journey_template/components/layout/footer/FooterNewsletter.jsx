import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useContent } from '../../../context';

export function FooterNewsletter() {
  const [email, setEmail] = useState('');
  const { content, rootContent, loading } = useContent();

  // Check if we have newsletter data from any source
  const rootNewsletter = rootContent?.siteContent?.footer?.newsletter;
  const localNewsletter = content?.footer?.newsletter;
  
  if (loading || (!rootNewsletter && !localNewsletter)) {
    return (
      <div className="mb-8 lg:mb-0">
        <h3 className="text-lg font-serif mb-4 text-white/50">Loading...</h3>
        <div className="h-20"></div>
      </div>
    );
  }

  // Use rootContent if available, otherwise fall back to content
  const newsletter = rootNewsletter || localNewsletter || {
    title: "Subscribe to Our Newsletter",
    description: "Stay updated with our latest news and special offers."
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    setEmail('');
  };

  return (
    <div className="mb-8 lg:mb-0">
      <h3 className="text-lg font-serif mb-4 text-white">{newsletter?.title}</h3>
      <p className="text-gray-400 text-sm mb-4">
        {newsletter?.description}
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="bg-white/10 text-white px-4 py-2 rounded-md flex-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button
          type="submit"
          className="bg-orange-600 text-white p-2 rounded-md hover:bg-orange-700 transition-colors"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
}

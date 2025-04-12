import React from 'react';
import { useContent } from '../context/ContentContext';
import { Navigation } from './Navigation';
import { Footer } from './Footer';

const Blog = () => {
  const { siteContent } = useContent();
  const blogData = siteContent.blog;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <header className="relative h-96">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80"
            alt="Blog background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30"></div>
        </div>

        <div className="relative z-10 flex items-center h-full max-w-7xl mx-auto px-6">
          <div className="max-w-2xl">
            <h2 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
              {blogData.header.title}
            </h2>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 animate-fade-in-delay-1">
              {blogData.header.description}
            </p>
          </div>
        </div>
      </header>
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogData.posts.map((post) => (
              <div key={post.id} className="bg-zinc-900 rounded-xl overflow-hidden group hover:scale-105 transition duration-300">
                <img src={post.image} alt={post.title} className="w-full h-64 object-cover" />
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">{post.title}</h3>
                  <h4 className="text-lg text-gray-300 mb-4">{post.subtitle}</h4>
                  <p className="text-gray-400 mb-2">Chef: {post.chef}</p>
                  <p className="text-gray-400 mb-2">Date: {post.date}</p>
                  <p className="text-gray-400 mb-2">Read Time: {post.readTime}</p>
                  <p className="text-gray-400">{post.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>
      <Footer />
    </div>
  );
};

export default Blog;

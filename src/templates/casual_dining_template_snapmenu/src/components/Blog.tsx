import React from 'react';
import { useRootSiteContent } from '../../../../context/RootSiteContentContext';
import { Navigation } from './Navigation';
import { Footer } from './Footer';

const Blog = () => {
  const { siteContent } = useRootSiteContent() as { siteContent: any };
  
  // Default blog data
  const defaultBlog = {
    header: {
      title: "Our Blog",
      description: "Latest news and updates from our restaurant."
    },
    posts: [
      {
        id: "1",
        title: "The Art of Cooking",
        subtitle: "Learn the secrets behind our perfect dishes",
        chef: "Marco Rossi",
        date: "2025-03-01",
        readTime: "5 min read",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80",
        content: "Cooking is an art form that has been perfected over generations..."
      },
      {
        id: "2",
        title: "Seasonal Ingredients: Spring Edition",
        subtitle: "Discover the fresh spring ingredients we're incorporating into our menu",
        chef: "Sophia Chen",
        date: "2025-03-15",
        readTime: "4 min read",
        image: "https://images.unsplash.com/photo-1542282811-943ef1a977c3?auto=format&fit=crop&q=80",
        content: "Spring brings an abundance of fresh ingredients that add vibrant flavors to our dishes..."
      },
      {
        id: "3",
        title: "Behind the Scenes: A Day in Our Kitchen",
        subtitle: "Take a peek into the daily operations of our busy restaurant kitchen",
        chef: "James Wilson",
        date: "2025-03-22",
        readTime: "6 min read",
        image: "https://images.unsplash.com/photo-1605478371310-a9f1e96b4ff4?auto=format&fit=crop&q=80",
        content: "Ever wondered what happens behind the scenes at a busy restaurant? Here's your chance to find out..."
      }
    ]
  };
  
  // Use blog data from siteContent with fallback to default
  const blogData = siteContent?.blog || defaultBlog;

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

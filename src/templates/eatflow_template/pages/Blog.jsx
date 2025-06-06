import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../../redux';

/**
 * Blog post structure:
 * @typedef {Object} BlogPost
 * @property {string|number} id - Unique identifier
 * @property {string} title - Post title
 * @property {string} excerpt - Short description
 * @property {string} author - Post author
 * @property {string} date - Publication date
 * @property {string} category - Post category
 * @property {string} image - Image URL
 */

export function Blog() {
  const { rawApiResponse } = useAppSelector(state => state.siteContent);
  
  // Get site content from Redux state
  const siteContent = rawApiResponse ? 
    (typeof rawApiResponse === 'string' ? JSON.parse(rawApiResponse) : rawApiResponse) : 
    {};
  
  // Default blog data in case API data is not available
  const defaultBlog = {
    header: {
      title: "Our Blog",
      description: "Culinary insights, recipes, and stories from our kitchen"
    },
    posts: [
      {
        id: "1",
        title: "The Benefits of Plant-Based Eating",
        subtitle: "Discover how incorporating more plants into your diet can improve your health and the planet",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80",
        videoThumbnail: "",
        videoUrl: "",
        chef: "Chef Maria Rodriguez",
        date: "2025-04-10",
        readTime: "5 min"
      },
      {
        id: "2",
        title: "Seasonal Eating: Why It Matters",
        subtitle: "Learn the benefits of eating foods that are naturally harvested at their peak",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
        image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80",
        videoThumbnail: "",
        videoUrl: "",
        chef: "Chef James Chen",
        date: "2025-04-05",
        readTime: "4 min"
      },
      {
        id: "3",
        title: "The Art of Mindful Eating",
        subtitle: "Transform your relationship with food by practicing mindfulness at mealtime",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
        image: "https://images.unsplash.com/photo-1493770348161-369560ae357d?auto=format&fit=crop&q=80",
        videoThumbnail: "",
        videoUrl: "",
        chef: "Chef Sarah Johnson",
        date: "2025-03-28",
        readTime: "6 min"
      }
    ]
  };
  
  // Use API data if available, otherwise use default data
  const blog = siteContent?.blog || defaultBlog;
  
  // Transform blog data from siteContent to match the format expected by the component
  const blogPosts = blog.posts.map((post) => ({
    id: post.id || Math.random().toString(36).substr(2, 9),
    title: post.title,
    excerpt: post.subtitle,
    author: post.chef,
    date: post.date,
    category: post.readTime.includes("min") ? "Culinary Techniques" : "Chef Stories",
    image: post.image
  }));
  
  // Use the first post as the featured post if available
  const featuredPost = blogPosts.length > 0 ? blogPosts[0] : null;
  
  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold mb-4">{blog.header.title}</h1>
          <p className="text-xl text-gray-600">
            {blog.header.description}
          </p>
        </motion.div>

        {/* Featured Post */}
        {featuredPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <div className="relative h-[500px] rounded-xl overflow-hidden">
              {featuredPost.image ? (
                <div className="w-full h-full">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target;
                      if (target instanceof HTMLImageElement) {
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.classList.add('bg-green-100', 'flex', 'items-center', 'justify-center');
                          const fallbackEl = document.createElement('span');
                          fallbackEl.className = 'text-8xl font-bold text-green-500';
                          fallbackEl.textContent = featuredPost.title && featuredPost.title.length > 0 
                            ? featuredPost.title.charAt(0).toUpperCase() 
                            : 'B';
                          parent.appendChild(fallbackEl);
                        }
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="w-full h-full bg-green-100 flex items-center justify-center">
                  <span className="text-8xl font-bold text-green-500">
                    {featuredPost.title && featuredPost.title.length > 0 
                      ? featuredPost.title.charAt(0).toUpperCase() 
                      : 'B'}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent">
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <span className="text-green-500 bg-white px-4 py-1 rounded-full text-sm font-semibold">
                    Featured
                  </span>
                  <h2 className="text-3xl font-bold text-white mt-4">
                    {featuredPost.title}
                  </h2>
                  <p className="text-gray-200 mt-2 mb-4">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center text-white gap-4">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      <span>{featuredPost.author}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{new Date(featuredPost.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white rounded-lg overflow-hidden shadow-lg"
            >
              {post.image ? (
                <div className="w-full h-48">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      const target = e.target;
                      if (target instanceof HTMLImageElement) {
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.classList.add('bg-green-100', 'flex', 'items-center', 'justify-center');
                          const fallbackEl = document.createElement('span');
                          fallbackEl.className = 'text-4xl font-bold text-green-500';
                          fallbackEl.textContent = post.title && post.title.length > 0 
                            ? post.title.charAt(0).toUpperCase() 
                            : 'B';
                          parent.appendChild(fallbackEl);
                        }
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="w-full h-48 bg-green-100 flex items-center justify-center">
                  <span className="text-4xl font-bold text-green-500">
                    {post.title && post.title.length > 0 
                      ? post.title.charAt(0).toUpperCase() 
                      : 'B'}
                  </span>
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <Link
                  to={`/blog/${post.id}`}
                  className="inline-flex items-center text-green-500 hover:text-green-600 transition-colors"
                >
                  Read More <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mt-20 bg-green-500 rounded-xl p-12 text-white text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-lg mb-8">
            Get the latest news, recipes, and special offers delivered to your inbox
          </p>
          <form className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-full text-gray-900 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-white text-green-500 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

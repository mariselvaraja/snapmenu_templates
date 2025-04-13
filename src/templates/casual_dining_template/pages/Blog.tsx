import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../../common/redux';
import { Navigation } from '../components/Navigation';

// Define interface for blog post with additional properties
interface BlogPost {
  id: string | number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  image: string;
}

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
      description: "Culinary insights, recipes, and stories from our kitchen to yours."
    },
    posts: [
      {
        id: "1",
        title: "The Art of Perfect Plating",
        subtitle: "Elevate your dining experience with professional presentation techniques",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
        image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80",
        videoThumbnail: "",
        videoUrl: "",
        chef: "Chef Michael Roberts",
        date: "2025-04-10",
        readTime: "5 min"
      },
      {
        id: "2",
        title: "Wine Pairing Fundamentals",
        subtitle: "Learn how to match the perfect wine with your meal",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
        image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80",
        videoThumbnail: "",
        videoUrl: "",
        chef: "Sommelier Sarah Chen",
        date: "2025-04-05",
        readTime: "4 min"
      },
      {
        id: "3",
        title: "Behind the Scenes: A Day in Our Kitchen",
        subtitle: "Experience the passion and precision that goes into every dish",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
        image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80",
        videoThumbnail: "",
        videoUrl: "",
        chef: "Executive Chef David Miller",
        date: "2025-03-28",
        readTime: "6 min"
      }
    ]
  };
  
  // Use API data if available, otherwise use default data
  const blog = siteContent?.blog || defaultBlog;
  
  // Transform blog data from siteContent to match the format expected by the component
  const blogPosts: BlogPost[] = blog.posts.map((post: any) => ({
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
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      <div className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{blog.header.title}</h1>
            <p className="text-xl text-gray-300">
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
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.classList.add('bg-yellow-900', 'flex', 'items-center', 'justify-center');
                          const fallbackEl = document.createElement('span');
                          fallbackEl.className = 'text-8xl font-bold text-yellow-500';
                          fallbackEl.textContent = featuredPost.title && featuredPost.title.length > 0 
                            ? featuredPost.title.charAt(0).toUpperCase() 
                            : 'B';
                          parent.appendChild(fallbackEl);
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-full h-full bg-yellow-900 flex items-center justify-center">
                    <span className="text-8xl font-bold text-yellow-500">
                      {featuredPost.title && featuredPost.title.length > 0 
                        ? featuredPost.title.charAt(0).toUpperCase() 
                        : 'B'}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <span className="text-yellow-400 bg-black px-4 py-1 rounded-full text-sm font-semibold">
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
                className="bg-zinc-900 rounded-lg overflow-hidden shadow-lg group hover:scale-105 transition duration-300"
              >
                {post.image ? (
                  <div className="w-full h-48">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.classList.add('bg-yellow-900', 'flex', 'items-center', 'justify-center');
                          const fallbackEl = document.createElement('span');
                          fallbackEl.className = 'text-4xl font-bold text-yellow-500';
                          fallbackEl.textContent = post.title && post.title.length > 0 
                            ? post.title.charAt(0).toUpperCase() 
                            : 'B';
                          parent.appendChild(fallbackEl);
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-yellow-900 flex items-center justify-center">
                    <span className="text-4xl font-bold text-yellow-500">
                      {post.title && post.title.length > 0 
                        ? post.title.charAt(0).toUpperCase() 
                        : 'B'}
                    </span>
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-white">{post.title}</h3>
                  <p className="text-gray-400 mb-4">{post.excerpt}</p>
                  <Link
                    to={`/blog/${post.id}`}
                    className="inline-flex items-center text-yellow-400 hover:text-yellow-300 transition-colors"
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
            className="mt-20 bg-zinc-800 rounded-xl p-12 text-white text-center"
          >
            <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
            <p className="text-lg mb-8 text-gray-300">
              Get the latest news, recipes, and special offers delivered to your inbox
            </p>
            <form className="max-w-md mx-auto flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 rounded-full bg-zinc-700 border border-zinc-600 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <button
                type="submit"
                className="bg-yellow-400 text-black px-8 py-3 rounded-full font-semibold hover:bg-yellow-300 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Blog;

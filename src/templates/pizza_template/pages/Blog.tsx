 import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useAppSelector } from '../../../common/redux';
import { useEffect } from 'react';

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

export default function Blog() {
  const { rawApiResponse } = useAppSelector(state => state.siteContent);
  const params = useParams();
  
  // Get franchise ID from params or sessionStorage
  const franchiseId = params.franchiseId || sessionStorage.getItem('franchise_id');
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Get site content from Redux state
  const siteContent = rawApiResponse ? 
    (typeof rawApiResponse === 'string' ? JSON.parse(rawApiResponse) : rawApiResponse) : 
    {};
  
  // Log the site content to debug
  console.log('Blog component: siteContent', siteContent);
  
  // Check if blog data is available
  const isBlogAvailable = siteContent?.blog !== undefined;
  
  // Only use API data for rendering
  const blog = isBlogAvailable ? siteContent.blog : null;
  
  // Log the blog data being used
  console.log('Blog component: Using blog data', blog);
  
  // Transform blog data from siteContent to match the format expected by the component
  const blogPosts: BlogPost[] = isBlogAvailable ? blog.posts.map((post: any) => ({
    id: post.id,
    title: post.title,
    excerpt: post.subtitle,
    author: post.chef,
    date: post.date,
    category: post.readTime.includes("min") ? "Culinary Techniques" : "Chef Stories",
    image: post.image
  })) : [];
  
  // Use the first post as the featured post if available
  const featuredPost = blogPosts.length > 0 ? blogPosts[0] : null;
  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isBlogAvailable ? (
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
        ) : (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl font-bold mb-4">Blog is not Available</h1>
            <p className="text-xl text-gray-600">
              Our blog content is currently unavailable. Please check back later.
            </p>
          </motion.div>
        )}

        {/* Featured Post - only show if blog is available */}
        {isBlogAvailable && featuredPost && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
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
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.classList.add('bg-red-100', 'flex', 'items-center', 'justify-center');
                        const fallbackEl = document.createElement('span');
                        fallbackEl.className = 'text-8xl font-bold text-red-500';
                        fallbackEl.textContent = featuredPost.title && featuredPost.title.length > 0 
                          ? featuredPost.title.charAt(0).toUpperCase() 
                          : 'B';
                        parent.appendChild(fallbackEl);
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="w-full h-full bg-red-100 flex items-center justify-center">
                  <span className="text-8xl font-bold text-red-500">
                    {featuredPost.title && featuredPost.title.length > 0 
                      ? featuredPost.title.charAt(0).toUpperCase() 
                      : 'B'}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent">
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <span className="text-red-500 bg-white px-4 py-1 rounded-full text-sm font-semibold">
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

        {/* Blog Posts Grid - only show if blog is available */}
        {isBlogAvailable ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
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
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          parent.classList.add('bg-red-100', 'flex', 'items-center', 'justify-center');
                          const fallbackEl = document.createElement('span');
                          fallbackEl.className = 'text-4xl font-bold text-red-500';
                          fallbackEl.textContent = post.title && post.title.length > 0 
                            ? post.title.charAt(0).toUpperCase() 
                            : 'B';
                          parent.appendChild(fallbackEl);
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-red-100 flex items-center justify-center">
                    <span className="text-4xl font-bold text-red-500">
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
                    to={franchiseId ? `/${franchiseId}/blog/${post.id}` : `/blog/${post.id}`}
                    className="inline-flex items-center text-red-500 hover:text-red-600 transition-colors"
                  >
                    Read More <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        ) : null}

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mt-20 bg-red-500 rounded-xl p-6 sm:p-8 md:p-12 text-white text-center"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-base sm:text-lg mb-6 sm:mb-8 px-4">
            Get the latest news, recipes, and special offers delivered to your inbox
          </p>
          <form className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 sm:px-6 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 text-sm sm:text-base"
                required
              />
              <button
                type="submit"
                className="bg-white text-red-500 px-6 sm:px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors text-sm sm:text-base whitespace-nowrap"
              >
                Subscribe
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useContent } from '../../context/contexts/ContentContext';

// Define interface for blog post with additional properties
const transformBlogPost = (post) => ({
  id: post.id,
  title: post.title,
  excerpt: post.subtitle,
  author: post.chef,
  date: post.date,
  category: post.readTime.includes("min") ? "Culinary Techniques" : "Chef Stories",
  image: post.image
});

// Define categories for blog posts
const categories = [
  "All Posts",
  "Culinary Techniques",
  "Chef Stories",
  "Food Trends",
  "Events",
  "Behind the Scenes"
];

export function BlogPage() {
  const { content } = useContent();
  const blogData = content?.blog || { header: {}, posts: [] };
  
  // Transform blog data from content to match the format expected by the component
  const blogPosts = blogData.posts.map(transformBlogPost);
  
  // Use the first post as the featured post
  const featuredPost = blogPosts[0];
  
  if (!featuredPost) {
    return (
      <div className="min-h-screen bg-neutral-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-serif text-gray-900 mb-4">
              {blogData.header.title || 'Our Blog'}
            </h1>
            <p className="text-xl text-gray-600">
              {blogData.header.description || 'Latest news and updates from our kitchen'}
            </p>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-500">No blog posts available at the moment.</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-neutral-50 py-12 mt-[100px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-serif text-gray-900 mb-4">
            {blogData.header.title || 'Culinary Insights'}
          </h1>
          <p className="text-xl text-gray-600">
            {blogData.header.description || 'Discover the techniques, stories, and passion behind our signature dishes'}
          </p>
        </motion.div>

        {/* Featured Post */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="relative h-[500px] rounded-xl overflow-hidden">
            <img
              src={featuredPost.image}
              alt={featuredPost.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent">
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <span className="text-orange-500 bg-white px-4 py-1 rounded-full text-sm font-semibold">
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
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{new Date(featuredPost.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Categories */}
        <div className="flex flex-wrap gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              className="px-6 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              {category}
            </button>
          ))}
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white rounded-lg overflow-hidden shadow-lg"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <Link
                  to={`/blog/${post.id}`}
                  className="inline-flex items-center text-orange-500 hover:text-orange-600 transition-colors"
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
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mt-20 bg-orange-500 rounded-xl p-12 text-white text-center"
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
              className="bg-white text-orange-500 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRootSiteContent } from '../../../../context/RootSiteContentContext';

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

// Define categories for blog posts
const categories = [
  "All Posts",
  "Culinary Techniques",
  "Chef Stories",
  "Food Trends",
  "Events",
  "Behind the Scenes"
];

export default function Blog() {
  // Get blog data directly from useRootSiteContent
  const { siteContent } = useRootSiteContent();
  
  // Default blog data with sample posts
  const defaultBlog = {
    header: {
      title: "Our Blog",
      description: "Latest news and updates from our restaurant."
    },
    posts: [
      {
        id: "1",
        title: "The Art of Pizza Making",
        subtitle: "Learn the secrets behind our perfect pizza dough and traditional techniques.",
        chef: "Marco Rossi",
        date: "2025-03-01",
        readTime: "5 min read",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80",
        content: "Pizza making is an art form that has been perfected over generations..."
      },
      {
        id: "2",
        title: "Seasonal Ingredients: Spring Edition",
        subtitle: "Discover the fresh spring ingredients we're incorporating into our menu this season.",
        chef: "Sophia Chen",
        date: "2025-03-15",
        readTime: "4 min read",
        image: "https://images.unsplash.com/photo-1542282811-943ef1a977c3?auto=format&fit=crop&q=80",
        content: "Spring brings an abundance of fresh ingredients that add vibrant flavors to our dishes..."
      },
      {
        id: "3",
        title: "Behind the Scenes: A Day in Our Kitchen",
        subtitle: "Take a peek into the daily operations of our busy restaurant kitchen.",
        chef: "James Wilson",
        date: "2025-03-22",
        readTime: "6 min read",
        image: "https://images.unsplash.com/photo-1605478371310-a9f1e96b4ff4?auto=format&fit=crop&q=80",
        content: "Ever wondered what happens behind the scenes at a busy restaurant? Here's your chance to find out..."
      },
      {
        id: "4",
        title: "Pizza and Wine Pairings",
        subtitle: "The perfect wines to complement your favorite pizza styles.",
        chef: "Emma Davis",
        date: "2025-03-29",
        readTime: "7 min read",
        image: "https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?auto=format&fit=crop&q=80",
        content: "Finding the right wine to pair with your pizza can elevate your dining experience..."
      }
    ]
  };
  
  // Use blog data from siteContent with fallback to default
  const blog = (siteContent as any)?.blog || defaultBlog;
  const blogHeader = blog.header || defaultBlog.header;
  
  // Default blog post for when there are no posts
  const defaultBlogPost: BlogPost = {
    id: "default",
    title: "Coming Soon",
    excerpt: "Our blog posts are coming soon. Stay tuned for exciting content!",
    author: "Chef",
    date: new Date().toISOString(),
    category: "Announcements",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80"
  };
  
  // Transform blog data from siteContent to match the format expected by the component
  const blogPosts: BlogPost[] = blog.posts && blog.posts.length > 0
    ? blog.posts.map(post => ({
        id: post.id || `post-${Math.random().toString(36).substr(2, 9)}`,
        title: post.title || "Untitled Post",
        excerpt: post.subtitle || "No description available",
        author: post.chef || "Restaurant Chef",
        date: post.date || new Date().toISOString(),
        category: post.readTime && post.readTime.includes("min") ? "Culinary Techniques" : "Chef Stories",
        image: post.image || "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80"
      }))
    : [defaultBlogPost];
  
  // Use the first post as the featured post
  const featuredPost = blogPosts[0] || defaultBlogPost;
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
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <Link
                  to={`/blog/${post.id}`}
                  className="inline-flex items-center text-red-500 hover:text-red-600 transition-colors"
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
          className="mt-20 bg-red-500 rounded-xl p-12 text-white text-center"
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
              className="bg-white text-red-500 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { BookOpen, ArrowRight, Calendar, User, Clock, Play } from 'lucide-react';
import { useRootSiteContent } from '../../../../context/RootSiteContentContext';

// Define interface for blog post with additional properties
const transformBlogPost = (post) => ({
  id: post.id,
  title: post.title,
  excerpt: post.subtitle,
  author: post.chef,
  date: post.date,
  category: post.readTime.includes("min") ? "Recipes" : "Nutrition",
  image: post.image,
  videoUrl: post.videoUrl
});

// Define categories for blog posts
const categories = [
  "All Categories",
  "Nutrition",
  "Recipes",
  "Wellness",
  "Lifestyle",
  "Sustainability"
];

export function Blog() {
  const { siteContent } = useRootSiteContent();
  
  // Default blog data
  const defaultBlog = {
    header: {
      title: "Our Blog",
      description: "Latest news and updates from our kitchen"
    },
    posts: [
      {
        id: "1",
        title: "The Art of Healthy Cooking",
        subtitle: "Learn the secrets behind our nutritious and delicious dishes",
        chef: "Sarah Johnson",
        date: "2025-03-01",
        readTime: "5 min read",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80",
        content: "Cooking healthy meals doesn't have to be complicated or boring. At EatFlow, we believe that nutritious food should also be delicious and satisfying."
      },
      {
        id: "2",
        title: "Seasonal Ingredients: Spring Edition",
        subtitle: "Discover the fresh spring ingredients we're incorporating into our menu",
        chef: "Michael Chen",
        date: "2025-03-15",
        readTime: "4 min read",
        image: "https://images.unsplash.com/photo-1542282811-943ef1a977c3?auto=format&fit=crop&q=80",
        content: "Spring brings an abundance of fresh ingredients that add vibrant flavors to our dishes."
      },
      {
        id: "3",
        title: "The Benefits of Plant-Based Eating",
        subtitle: "How incorporating more plants into your diet can improve your health",
        chef: "Emma Williams",
        date: "2025-03-22",
        readTime: "6 min read",
        image: "https://images.unsplash.com/photo-1605478371310-a9f1e96b4ff4?auto=format&fit=crop&q=80",
        content: "Plant-based eating has numerous health benefits, from reducing inflammation to improving heart health."
      }
    ]
  };
  
  // Default blog header
  const defaultBlogHeader = {
    title: "Our Blog",
    description: "Latest news and updates from our kitchen"
  };
  
  // Default blog post for when there are no posts
  const defaultBlogPost = {
    id: "default",
    title: "Coming Soon",
    excerpt: "Our blog posts are coming soon. Stay tuned for exciting content!",
    author: "Chef",
    date: new Date().toISOString(),
    category: "Announcements",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80"
  };

  // Safely access blog data with fallbacks
  const blogData = siteContent?.blog || { header: defaultBlogHeader, posts: [] };
  const blogHeader = blogData.header || defaultBlogHeader;
  
  // Transform blog data from siteContent to match the format expected by the component
  const blogPosts = blogData.posts && blogData.posts.length > 0
    ? blogData.posts.map(post => transformBlogPost({
        id: post.id || `post-${Math.random().toString(36).substr(2, 9)}`,
        title: post.title || "Untitled Post",
        subtitle: post.subtitle || "No description available",
        chef: post.chef || "Restaurant Chef",
        date: post.date || new Date().toISOString(),
        readTime: post.readTime || "5 min read",
        image: post.image || "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80",
        videoUrl: post.videoUrl || ""
      }))
    : [defaultBlogPost];
  
  // Use the first post as the featured post
  const featuredPost = blogPosts[0];
  
  if (!featuredPost) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="container mx-auto px-6 py-24">
          <h1 className="text-4xl font-bold mb-4 text-center">
            {blogData.header.title || 'Our Blog'}
          </h1>
          <p className="text-xl text-gray-600 text-center mb-8">
            {blogData.header.description || 'Latest news and updates from our kitchen'}
          </p>
          <div className="text-center py-12">
            <p className="text-gray-500">No blog posts available at the moment.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[70vh]">
        <div className="absolute inset-0">
          <img 
            src={blogPosts[0].image}
            alt="Blog background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>
        
        <Navigation />

        <div className="relative z-10 container mx-auto px-6 h-[calc(70vh-120px)] flex items-center justify-center text-center">
          <div>
            <div className="flex justify-center mb-6">
              <BookOpen className="w-16 h-16 text-green-400" />
            </div>
            <h1 className="text-7xl font-bold text-white mb-8">
              {blogHeader.title}
            </h1>
            <p className="text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              {blogHeader.description}
            </p>
          </div>
        </div>
      </div>

      {/* Categories */}
      {/* <div className="sticky top-0 z-20 bg-white shadow-md">
        <div className="container mx-auto px-6">
          <div className="flex overflow-x-auto space-x-8 py-6">
            {categories.map((category, index) => (
              <button
                key={index}
                className={`text-xl font-semibold whitespace-nowrap px-4 py-2 rounded-full transition-colors ${
                  index === 0 ? 'bg-green-500 text-white' : 'text-gray-600 hover:text-green-500'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div> */}

      {/* Featured Post */}
      {/* <motion.div
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
      </motion.div> */}

      {/* Blog Posts Grid */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-16 text-center">Featured Posts</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-white rounded-lg overflow-hidden shadow-lg group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
                  />
                  {post.videoUrl && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white bg-opacity-80 rounded-full p-4 cursor-pointer hover:bg-opacity-90 transition">
                        <Play className="w-8 h-8 text-green-600" />
                      </div>
                    </div>
                  )}
                </div>
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
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-green-600 transition">{post.title}</h3>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <Link
                    to={`/blog/${post.id}`}
                    className="inline-flex items-center text-green-600 font-semibold hover:text-green-700 transition"
                  >
                    Read More <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>


      {/* Newsletter Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-24"
      >
        <div className="container mx-auto px-6">
          <div className="bg-green-50 rounded-3xl p-12 text-center">
            <h2 className="text-4xl font-bold mb-6">Subscribe to Our Newsletter</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Stay updated with our latest recipes, nutrition tips, and wellness insights delivered straight to your inbox.
            </p>
            <form className="max-w-2xl mx-auto">
              <div className="flex gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 rounded-full border focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button className="bg-green-500 text-white px-8 py-4 rounded-full hover:bg-green-600 transition text-lg font-medium">
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>

      <Footer />
    </div>
  );
}

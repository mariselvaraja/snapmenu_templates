import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useRootSiteContent } from '../../../../context/RootSiteContentContext';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const { siteContent } = useRootSiteContent() as { siteContent: any };
  
  // Default blog data with sample posts
  const defaultBlogData = {
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
        content: "Cooking is an art form that has been perfected over generations. At our restaurant, we believe in combining traditional techniques with modern innovation to create dishes that are both familiar and exciting. Our chefs spend years mastering the fundamentals before they're allowed to experiment with new flavors and presentations. This dedication to craft is what sets our cuisine apart and keeps our customers coming back for more. From the perfect sear on a steak to the delicate balance of flavors in our signature sauces, every detail matters in our kitchen."
      },
      {
        id: "2",
        title: "Seasonal Ingredients: Spring Edition",
        subtitle: "Discover the fresh spring ingredients we're incorporating into our menu",
        chef: "Sophia Chen",
        date: "2025-03-15",
        readTime: "4 min read",
        image: "https://images.unsplash.com/photo-1542282811-943ef1a977c3?auto=format&fit=crop&q=80",
        content: "Spring brings an abundance of fresh ingredients that add vibrant flavors to our dishes. From tender asparagus and sweet peas to fragrant herbs like mint and dill, our spring menu celebrates the season's bounty. We work closely with local farmers to source the freshest produce, often harvested just hours before it reaches our kitchen. This commitment to freshness not only enhances the flavor of our dishes but also supports our local agricultural community. Our spring menu changes slightly each week to reflect what's at its peak, ensuring that every dish we serve captures the essence of the season."
      },
      {
        id: "3",
        title: "Behind the Scenes: A Day in Our Kitchen",
        subtitle: "Take a peek into the daily operations of our busy restaurant kitchen",
        chef: "James Wilson",
        date: "2025-03-22",
        readTime: "6 min read",
        image: "https://images.unsplash.com/photo-1605478371310-a9f1e96b4ff4?auto=format&fit=crop&q=80",
        content: "Ever wondered what happens behind the scenes at a busy restaurant? Our day starts long before the first customer arrives. The morning team begins prep work at 6 AM, chopping vegetables, making stocks, and preparing sauces that will form the foundation of the day's dishes. By mid-morning, the kitchen is a hive of activity as the lunch service team arrives and final preparations are made. During service, communication is key - our kitchen operates like a well-oiled machine, with each chef focused on their station but aware of the bigger picture. After lunch service ends, there's a brief period of calm before the dinner preparations begin. The evening service is typically our busiest, with the kitchen reaching a controlled frenzy of activity that continues until the last order is sent out, often late into the night."
      }
    ]
  };
  
  // Use blog data from siteContent with fallback to default
  const blogData = siteContent?.blog || defaultBlogData;
  
  // Find the blog post with the matching ID
  const post = blogData.posts?.find(post => post.id === id);
  
  // If post not found, show error message
  if (!post) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navigation />
        <div className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
            <p className="text-xl text-gray-400 mb-8">
              The blog post you're looking for doesn't exist or has been removed.
            </p>
            <Link
              to="/blog"
              className="inline-flex items-center text-red-500 hover:text-red-600 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Blog
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back to Blog Link */}
          <Link
            to="/blog"
            className="inline-flex items-center text-red-500 hover:text-red-600 transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Blog
          </Link>
          
          {/* Post Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            <div className="flex items-center gap-4 text-gray-400">
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                <span>{post.chef}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <span>{new Date(post.date).toLocaleDateString()}</span>
              </div>
              <div className="text-sm bg-zinc-800 px-3 py-1 rounded-full">
                {post.readTime}
              </div>
            </div>
          </motion.div>
          
          {/* Featured Image */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-auto rounded-xl"
            />
          </motion.div>
          
          {/* Post Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="prose prose-lg max-w-none prose-invert"
          >
            <h2 className="text-2xl font-semibold mb-4">{post.subtitle}</h2>
            <p className="mb-6">{post.content}</p>
            
            {/* Video Section (if available) */}
            {post.videoUrl && (
              <div className="my-8">
                <h3 className="text-xl font-semibold mb-4">Watch the Video</h3>
                <div className="relative pt-[56.25%] rounded-lg overflow-hidden">
                  <iframe
                    src={post.videoUrl}
                    title={post.title}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}
          </motion.div>
          
          {/* Related Posts Section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mt-16"
          >
            <h2 className="text-2xl font-bold mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {blogData.posts
                .filter(relatedPost => relatedPost.id !== post.id)
                .slice(0, 2)
                .map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    to={`/blog/${relatedPost.id}`}
                    className="group"
                  >
                    <div className="bg-zinc-900 rounded-lg overflow-hidden shadow-lg">
                      <div className="h-48 overflow-hidden">
                        <img
                          src={relatedPost.image}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2 group-hover:text-red-500 transition-colors">
                          {relatedPost.title}
                        </h3>
                        <p className="text-gray-400">{relatedPost.subtitle}</p>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BlogPost;

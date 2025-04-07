import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, Clock, ArrowLeft, ArrowRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { useRootSiteContent } from '../../../../context/RootSiteContentContext';

export function BlogPost() {
  const { id } = useParams();
  const { siteContent } = useRootSiteContent();
  
  // Default blog data with sample posts
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
        content: "Cooking healthy meals doesn't have to be complicated or boring. At EatFlow, we believe that nutritious food should also be delicious and satisfying. Our chefs are trained to create meals that are not only good for your body but also pleasing to your palate. We use fresh, locally-sourced ingredients and cooking techniques that preserve nutrients while enhancing flavors. From perfectly roasted vegetables to lean proteins cooked to perfection, every dish is designed to provide optimal nutrition without sacrificing taste. We also focus on balanced meals that include a variety of food groups to ensure you're getting all the nutrients your body needs."
      },
      {
        id: "2",
        title: "Seasonal Ingredients: Spring Edition",
        subtitle: "Discover the fresh spring ingredients we're incorporating into our menu",
        chef: "Michael Chen",
        date: "2025-03-15",
        readTime: "4 min read",
        image: "https://images.unsplash.com/photo-1542282811-943ef1a977c3?auto=format&fit=crop&q=80",
        content: "Spring brings an abundance of fresh ingredients that add vibrant flavors to our dishes. As the weather warms up, we're excited to incorporate seasonal produce like asparagus, peas, radishes, and spring greens into our menu. These ingredients not only taste better when they're in season but also provide maximum nutritional benefits. Our spring menu features dishes that highlight these seasonal stars, from crisp salads with tender spring greens to pasta dishes with fresh peas and asparagus. We also work closely with local farmers to ensure we're getting the freshest produce possible, often harvested just hours before it reaches our kitchen."
      },
      {
        id: "3",
        title: "The Benefits of Plant-Based Eating",
        subtitle: "How incorporating more plants into your diet can improve your health",
        chef: "Emma Williams",
        date: "2025-03-22",
        readTime: "6 min read",
        image: "https://images.unsplash.com/photo-1605478371310-a9f1e96b4ff4?auto=format&fit=crop&q=80",
        content: "Plant-based eating has numerous health benefits, from reducing inflammation to improving heart health. Research has shown that diets rich in fruits, vegetables, whole grains, and legumes can help prevent chronic diseases like heart disease, diabetes, and certain cancers. These foods are packed with vitamins, minerals, fiber, and antioxidants that support overall health and wellbeing. At EatFlow, we offer a variety of plant-based options that make it easy to incorporate more plants into your diet. Even if you're not ready to go fully plant-based, adding more plant foods to your meals can have significant health benefits. Our menu includes delicious plant-based dishes that even meat-lovers enjoy, proving that plant-based eating doesn't have to be boring or restrictive."
      }
    ]
  };
  
  // Use blog data from siteContent with fallback to default
  const blogData = siteContent?.blog || defaultBlog;
  
  // Find the blog post with the matching ID
  const post = blogData.posts.find(post => post.id === id);
  
  // If post not found, show error message
  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Post Not Found</h1>
          <p className="text-xl text-gray-600 mb-8">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center text-green-500 hover:text-green-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Blog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      
      
      {/* Hero Section */}
      <div className="relative h-[50vh]">
      <Navigation />
        <div className="absolute inset-0">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 h-[calc(50vh-120px)] flex items-center justify-center text-center">
          <div>
            <h1 className="text-5xl font-bold text-white mb-4">{post.title}</h1>
            <div className="flex items-center justify-center gap-4 text-white">
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                <span>{post.chef}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <span>{new Date(post.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        {/* Back to Blog Link */}
        <Link
          to="/blog"
          className="inline-flex items-center text-green-500 hover:text-green-600 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Blog
        </Link>
        
        {/* Post Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="prose prose-lg max-w-none"
        >
          <h2 className="text-2xl font-semibold mb-4">{post.subtitle}</h2>
          <p className="text-gray-700 leading-relaxed mb-8">{post.content}</p>
          
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
                  <div className="bg-white rounded-lg overflow-hidden shadow-lg">
                    <div className="h-48 overflow-hidden">
                      <img
                        src={relatedPost.image}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-green-500 transition-colors">
                        {relatedPost.title}
                      </h3>
                      <p className="text-gray-600">{relatedPost.subtitle}</p>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}

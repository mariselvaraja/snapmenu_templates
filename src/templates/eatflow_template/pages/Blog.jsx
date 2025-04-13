import React from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { BookOpen, ArrowRight, Calendar, User, Clock, Play } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

// Use blog posts from siteContent
const blogPosts = [];

const recentPosts = [
  {
    title: "Seasonal Cooking: Spring Edition",
    excerpt: "Make the most of spring produce with these fresh and delicious recipes that celebrate the season.",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80",
    author: "Emma Williams",
    date: "March 10, 2024",
    readTime: "6 min read",
    category: "Recipes"
  },
  {
    title: "Sustainable Food Practices",
    excerpt: "Explore how making sustainable food choices can benefit both your health and the planet.",
    image: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&q=80",
    author: "David Miller",
    date: "March 8, 2024",
    readTime: "7 min read",
    category: "Sustainability"
  },
  {
    title: "Meal Prep Tips for Busy Professionals",
    excerpt: "Save time and eat healthy with these effective meal preparation strategies.",
    image: "https://images.unsplash.com/photo-1543339318-b43dc53e19b3?auto=format&fit=crop&q=80",
    author: "Lisa Thompson",
    date: "March 5, 2024",
    readTime: "5 min read",
    category: "Lifestyle"
  }
];

const categories = [
  "All Categories",
  "Nutrition",
  "Recipes",
  "Wellness",
  "Lifestyle",
  "Sustainability"
];

export function Blog() {
  const { siteContent } = useSiteContent();
  const blogPosts = siteContent.blog.posts;

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
              {siteContent.blog.header.title}
            </h1>
            <p className="text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              {siteContent.blog.header.description}
            </p>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="sticky top-0 z-20 bg-white shadow-md">
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
      </div>

      {/* Featured Posts */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-16 text-center">Featured Posts</h2>
          <div className="grid md:grid-cols-2 gap-12">
            {blogPosts.map((post, index) => (
              <div key={index} className="group">
                <div className="relative h-96 mb-6 overflow-hidden rounded-2xl">
                  <img 
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition duration-500"></div>
                  {post.videoUrl && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white bg-opacity-80 rounded-full p-4 cursor-pointer hover:bg-opacity-90 transition">
                        <Play className="w-8 h-8 text-green-600" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {post.date}
                  </div>
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    {post.chef}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {post.readTime}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-green-600 transition">{post.title}</h3>
                <p className="text-gray-600 mb-6">{post.subtitle}</p>
                <Link
                  to={`/blog/${index}`}
                  className="inline-flex items-center text-green-600 font-semibold hover:text-green-700 transition"
                >
                  <span>Read More</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Posts */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-16 text-center">Recent Posts</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {recentPosts.map((post, index) => (
              <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-lg group">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition duration-500"></div>
                  <div className="absolute top-6 left-6">
                    <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {post.date}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {post.readTime}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-4 group-hover:text-green-600 transition">{post.title}</h3>
                  <p className="text-gray-600 mb-6">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2 text-gray-600" />
                      <span className="text-gray-600 text-sm">{post.author}</span>
                    </div>
                    <Link
                      to={`/blog/${index}`}
                      className="inline-flex items-center text-green-600 font-semibold hover:text-green-700 transition"
                    >
                      <span>Read More</span>
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24">
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
      </section>

      <Footer />
    </div>
  );
}

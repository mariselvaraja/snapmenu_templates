import React from 'react';
import { motion } from 'framer-motion';
import { Clock, User, ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useContent } from '../../context/contexts/ContentContext';
import { BlogPost } from './BlogPost';

export function BlogPostPage() {
  const { id } = useParams();
  const { content } = useContent();
  const blogData = content?.blog || { posts: [] };
  
  // Find the blog post with the matching ID
  const post = blogData.posts.find(post => post.id === id);
  
  // If post not found, show error message
  if (!post) {
    return (
      <div className="min-h-screen bg-neutral-50 py-12 mt-[150px]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-serif text-gray-900 mb-4">Post Not Found</h1>
          <p className="text-xl text-gray-600 mb-8">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center text-orange-500 hover:text-orange-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Blog
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-neutral-50 py-12 mt-[90px]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back to Blog Link */}
        <Link
          to="/blog"
          className="inline-flex items-center text-orange-500 hover:text-orange-600 transition-colors mb-8"
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
          <h1 className="text-4xl font-serif text-gray-900 mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-gray-600">
            <div className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              <span>{post.chef}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              <span>{new Date(post.date).toLocaleDateString()}</span>
            </div>
            <div className="text-sm bg-gray-100 px-3 py-1 rounded-full">
              {post.readTime}
            </div>
          </div>
        </motion.div>
        
        {/* Blog Post Component */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <BlogPost post={post} />
        </motion.div>
        
        {/* Related Posts Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mt-16"
        >
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-8">You Might Also Like</h2>
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
                      <h3 className="text-xl font-medium text-gray-900 mb-2 group-hover:text-orange-500 transition-colors">
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
    </div>
  );
}

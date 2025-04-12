import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useSiteContent } from '../context/SiteContentContext';

export default function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const siteContent = useSiteContent();
  const blog = siteContent?.blog || {
    header: {
      title: "Our Blog",
      description: "Culinary insights, recipes, and stories from our kitchen"
    },
    posts: [
      {
        id: "1",
        title: "The Art of Perfect Pizza",
        subtitle: "Secrets from our master chef",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80",
        videoThumbnail: "",
        videoUrl: "",
        chef: "Marco Rossi",
        date: "2025-04-01",
        readTime: "5 min"
      },
      {
        id: "2",
        title: "Seasonal Ingredients: Spring Edition",
        subtitle: "Fresh flavors for your table",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
        image: "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&q=80",
        videoThumbnail: "",
        videoUrl: "",
        chef: "Sophia Chen",
        date: "2025-03-15",
        readTime: "4 min"
      },
      {
        id: "3",
        title: "Wine Pairing Fundamentals",
        subtitle: "Elevate your dining experience",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl eu nisl.",
        image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80",
        videoThumbnail: "",
        videoUrl: "",
        chef: "Jean Dupont",
        date: "2025-02-28",
        readTime: "6 min"
      }
    ]
  };
  
  // Find the blog post with the matching ID
  const post = blog.posts.find(post => post.id === id);
  
  // If post not found, show error message
  if (!post) {
    return (
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <p className="text-xl text-gray-600 mb-8">
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
    );
  }
  
  return (
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
          <div className="flex items-center gap-4 text-gray-600">
            <div className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              <span>{post.chef}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              <span>{new Date(post.date).toLocaleDateString()}</span>
            </div>
            <div className="text-sm bg-gray-100 px-3 py-1 rounded-full">
              {post.readTime}
            </div>
          </div>
        </motion.div>
        
        {/* Featured Image - show image or first character placeholder */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          {post.image ? (
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-auto rounded-xl"
            />
          ) : (
            <div className="w-full h-[300px] bg-red-100 flex items-center justify-center rounded-xl">
              <span className="text-8xl font-bold text-red-500">
                {post.title && post.title.length > 0 
                  ? post.title.charAt(0).toUpperCase() 
                  : 'B'}
              </span>
            </div>
          )}
        </motion.div>
        
        {/* Post Content - only show if content exists */}
        {post.content ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="prose prose-lg max-w-none"
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
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="prose prose-lg max-w-none text-center"
          >
            <p className="mb-6 text-gray-500">No story found</p>
          </motion.div>
        )}
        
        {/* Related Posts Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mt-16"
        >
          <h2 className="text-2xl font-bold mb-8">You Might Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blog.posts
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
                      {relatedPost.image ? (
                        <img
                          src={relatedPost.image}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-red-100 flex items-center justify-center">
                          <span className="text-4xl font-bold text-red-500">
                            {relatedPost.title && relatedPost.title.length > 0 
                              ? relatedPost.title.charAt(0).toUpperCase() 
                              : 'B'}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-red-500 transition-colors">
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

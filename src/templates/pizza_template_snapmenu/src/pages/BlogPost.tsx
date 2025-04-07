import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useRootSiteContent } from '../../../../context/RootSiteContentContext';

export default function BlogPost() {
  const { id } = useParams<{ id: string }>();
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
        content: "Pizza making is an art form that has been perfected over generations. Our dough recipe has been passed down through generations of Italian pizza makers, and we're proud to continue this tradition at our restaurant.\n\nThe key to perfect pizza dough lies in the ingredients and the process. We use only the finest flour, water, salt, and yeast, and we let our dough ferment for at least 24 hours to develop its flavor and texture. This slow fermentation process results in a dough that's easy to digest and has a complex flavor profile.\n\nWhen it comes to shaping the dough, our pizza chefs have years of experience. They know exactly how to stretch the dough to achieve the perfect thickness - not too thick and not too thin. The edge of the pizza, known as the 'cornicione,' is slightly thicker to create a beautiful crust that's crispy on the outside and soft on the inside.\n\nOur wood-fired oven reaches temperatures of up to 900°F (480°C), allowing us to cook pizzas in just 90 seconds. This high heat is essential for creating the perfect pizza with a crispy base and perfectly cooked toppings.\n\nWe believe that the best pizzas are made with simple, high-quality ingredients. That's why we source our tomatoes from Italy, our mozzarella from local dairy farms, and our basil from our own herb garden. These fresh ingredients, combined with our traditional techniques, result in pizzas that are truly authentic and delicious."
      },
      {
        id: "2",
        title: "Seasonal Ingredients: Spring Edition",
        subtitle: "Discover the fresh spring ingredients we're incorporating into our menu this season.",
        chef: "Sophia Chen",
        date: "2025-03-15",
        readTime: "4 min read",
        image: "https://images.unsplash.com/photo-1542282811-943ef1a977c3?auto=format&fit=crop&q=80",
        content: "Spring brings an abundance of fresh ingredients that add vibrant flavors to our dishes. As the weather warms up and the days get longer, we're excited to incorporate seasonal produce into our menu.\n\nThis spring, we're featuring asparagus, peas, artichokes, and spring onions in many of our dishes. These vegetables are at their peak during this season, offering the best flavor and nutritional value.\n\nOur new Spring Vegetable Pizza is topped with asparagus, peas, and spring onions, along with fresh mozzarella and a light lemon zest. It's a celebration of the season on a plate!\n\nWe're also introducing a Spring Salad with artichokes, peas, and mint, dressed with a light lemon vinaigrette. It's the perfect starter or side dish to complement our pizzas.\n\nAt our restaurant, we believe in cooking with the seasons and supporting local farmers. By using seasonal ingredients, we not only create more flavorful dishes but also reduce our environmental impact.\n\nCome visit us this spring to taste these seasonal specialties before they're gone!"
      },
      {
        id: "3",
        title: "Behind the Scenes: A Day in Our Kitchen",
        subtitle: "Take a peek into the daily operations of our busy restaurant kitchen.",
        chef: "James Wilson",
        date: "2025-03-22",
        readTime: "6 min read",
        image: "https://images.unsplash.com/photo-1605478371310-a9f1e96b4ff4?auto=format&fit=crop&q=80",
        content: "Ever wondered what happens behind the scenes at a busy restaurant? Here's your chance to find out! Our kitchen is a bustling hub of activity from early morning until late at night.\n\nThe day starts at 7:00 AM when our prep team arrives. They begin by preparing the pizza dough, which needs to rest for several hours before it's ready to use. They also chop vegetables, make sauces, and prepare all the ingredients that will be used throughout the day.\n\nAt 10:00 AM, the line cooks arrive and start setting up their stations. Each cook is responsible for a specific section of the menu, ensuring that every dish is prepared with care and attention to detail.\n\nThe kitchen really comes alive when we open for lunch at 11:30 AM. Orders start coming in, and the kitchen transforms into a well-orchestrated symphony of activity. Our chefs work together seamlessly, communicating constantly to ensure that every dish goes out perfectly.\n\nBetween lunch and dinner service, there's a brief lull where the team restocks their stations and prepares for the evening rush. Dinner service starts at 5:00 PM and is typically our busiest time.\n\nThe wood-fired pizza oven is the heart of our kitchen. It's constantly monitored to maintain the perfect temperature, and our pizza chef can have up to six pizzas cooking at once, each requiring precise timing and attention.\n\nAfter the last customers leave around 10:00 PM, the cleaning begins. Every surface is scrubbed, every piece of equipment is sanitized, and the kitchen is prepared for the next day.\n\nIt's a demanding job that requires passion, skill, and teamwork, but seeing customers enjoy our food makes it all worthwhile."
      },
      {
        id: "4",
        title: "Pizza and Wine Pairings",
        subtitle: "The perfect wines to complement your favorite pizza styles.",
        chef: "Emma Davis",
        date: "2025-03-29",
        readTime: "7 min read",
        image: "https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?auto=format&fit=crop&q=80",
        content: "Finding the right wine to pair with your pizza can elevate your dining experience to new heights. While beer is often the go-to beverage for pizza, wine can offer complex flavors that complement and enhance the taste of your favorite pie.\n\nFor classic Margherita pizza, with its simple tomato sauce, mozzarella, and basil toppings, we recommend a light-bodied red wine like Chianti or Sangiovese. These Italian wines have bright acidity that pairs perfectly with the tomato sauce and doesn't overpower the delicate flavors of the pizza.\n\nIf you prefer pepperoni or other meat-topped pizzas, opt for a medium-bodied red wine with good tannin structure, such as Montepulciano d'Abruzzo or Nero d'Avola. The tannins in these wines help cut through the richness of the meat and cleanse your palate between bites.\n\nFor white pizza (pizza bianca) with ricotta, garlic, and herbs, a crisp white wine like Pinot Grigio or Vermentino is an excellent choice. These wines have enough acidity to balance the creaminess of the cheese while complementing the herbal notes.\n\nVegetable-topped pizzas pair beautifully with rosé wines. The versatility of rosé allows it to complement a wide range of vegetables, from bell peppers to mushrooms to artichokes.\n\nFor those who enjoy spicy pizzas with ingredients like hot peppers or spicy sausage, an off-dry Riesling can help tame the heat while adding a refreshing element to each bite.\n\nAt our restaurant, we offer a carefully curated wine list with options that pair perfectly with each of our specialty pizzas. Our staff is always happy to recommend the perfect wine to complement your meal.\n\nRemember, the best wine pairing is ultimately the one you enjoy the most. Don't be afraid to experiment and find your own perfect pizza and wine combination!"
      }
    ]
  };
  
  // Use blog data from siteContent with fallback to default
  const blog = (siteContent as any)?.blog || defaultBlog;
  
  // Find the blog post with the matching ID
  const post = blog.posts?.find((post: any) => post.id?.toString() === id);
  
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

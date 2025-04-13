import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

// Static blog post data
const staticBlogPosts = {
  "0": {
    "title": "The Benefits of Plant-Based Eating",
    "chef": "Chef Maria Rodriguez",
    "date": "April 10, 2025",
    "readTime": "5 min read",
    "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
    "content": "Plant-based eating has gained tremendous popularity in recent years, and for good reason. Research consistently shows that diets rich in fruits, vegetables, whole grains, and legumes can reduce the risk of heart disease, type 2 diabetes, and certain cancers. Beyond the health benefits, plant-based diets are also more environmentally sustainable, requiring fewer resources and producing fewer greenhouse gas emissions than diets heavy in animal products. At EatFlow, we believe in the power of plants and incorporate a wide variety of plant-based options in our menu. Whether you're a committed vegan or simply looking to incorporate more plant-based meals into your diet, we have delicious options that don't compromise on flavor or satisfaction. Our chefs are constantly innovating to create plant-based dishes that are not only nutritious but also incredibly tasty and satisfying."
  },
  "1": {
    "title": "Seasonal Eating: Why It Matters",
    "chef": "Chef James Chen",
    "date": "April 5, 2025",
    "readTime": "4 min read",
    "image": "https://images.unsplash.com/photo-1464226184884-fa280b87c399",
    "content": "Eating seasonally means consuming foods that are naturally harvested at the time you're eating them. This practice has numerous benefits for your health, the environment, and your taste buds. Seasonal produce is typically harvested at peak ripeness, which means it contains more nutrients and flavor than out-of-season alternatives that may have been picked early and transported long distances. Additionally, seasonal eating supports local farmers and reduces the carbon footprint associated with shipping foods across the globe. At EatFlow, we're committed to incorporating seasonal ingredients into our menu, which is why you'll notice our offerings change throughout the year. This approach not only ensures the highest quality and taste but also connects you to the natural rhythms of food production. Next time you visit, ask about our seasonal specials to experience the best of what's currently growing in our region."
  },
  "2": {
    "title": "The Art of Mindful Eating",
    "chef": "Chef Sarah Johnson",
    "date": "March 28, 2025",
    "readTime": "6 min read",
    "image": "https://images.unsplash.com/photo-1493770348161-369560ae357d",
    "content": "In our fast-paced world, meals are often rushed affairs, eaten while distracted by screens or on the go. Mindful eating offers an alternative approach that can transform your relationship with food. This practice involves paying full attention to the experience of eating, noticing colors, smells, flavors, and textures. Research suggests that mindful eating can help improve digestion, reduce overeating, and increase satisfaction with meals. It can also help you recognize your body's hunger and fullness cues, leading to a more balanced approach to nutrition. At EatFlow, we create an environment that encourages mindful eating, with thoughtfully prepared dishes that engage all your senses. We invite you to take a moment to truly appreciate the care that goes into each ingredient and preparation method. By slowing down and savoring each bite, you might discover new flavors and a deeper appreciation for the nourishment food provides."
  }
};

export function BlogPost() {
  const { id } = useParams();
  
  // Use static blog post data
  const post = staticBlogPosts[id];

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
 
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-semibold text-gray-800 mb-4">Blog Post Not Found</h1>
          <p className="text-gray-600">The requested blog post was not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <div className="relative h-[70vh]">
        <div className="absolute inset-0">
          <img
            src={post.image}
            alt="Blog background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 h-[calc(70vh-120px)] flex items-center justify-center text-center">
          <div>
            <h1 className="text-7xl font-bold text-white mb-8">{post.title}</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 bg-orange-200 inline-block px-2 py-1 rounded">{post.title}</h1>
          <div className="flex items-center text-gray-600 mt-2">
            <span className="mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 inline-block align-middle mr-1">
                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM15 8.25a3 3 0 11-6 0 3 3 0 016 0zm-3 6.75a7.5 7.5 0 1015 0v1.5a.75.75 0 01-.75.75H3.75a.75.75 0 01-.75-.75V15zM3 15.75a.75.75 0 00.75-.75V15h16.5v.75a.75.75 0 00.75.75v.75a.75.75 0 01-.75.75H3.75a.75.75 0 01-.75-.75v-.75z" clipRule="evenodd" />
              </svg>
              {post.chef}
            </span>
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 inline-block align-middle mr-1">
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12 6a.75.75 0 01.75.75v5.25H15a.75.75 0 010 1.5h-3.75V15a.75.75 0 01-1.5 0v-3.75H9a.75.75 0 010-1.5h3.75V6.75A.75.75 0 0112 6z" clipRule="evenodd" />
              </svg>
              {post.date} • {post.readTime}
            </span>
          </div>
        </div>
        <p className="text-gray-700 leading-relaxed text-lg mb-8">{post.content}</p>
        <div className="flex justify-between mt-12">
          <Link
            to={`/blog/${Number(id) - 1}`}
            className="inline-flex items-center bg-green-500 text-white px-5 py-3 rounded-lg shadow-md hover:bg-green-600 transition duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2">
              <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
            </svg>
            Previous
          </Link>
          <Link
            to={`/blog/${Number(id) + 1}`}
            className="inline-flex items-center bg-green-500 text-white px-5 py-3 rounded-lg shadow-md hover:bg-green-600 transition duration-300"
          >
            Next
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 ml-2">
              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

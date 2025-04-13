import { useParams } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { Link } from 'react-router-dom';
import { useSiteContent } from '../context/SiteContentContext';

export function BlogPost() {
  const { id } = useParams();
  const { siteContent, loading } = useSiteContent();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!siteContent) {
    return <div>Error: Site content not loaded.</div>;
  }

  const blogPosts = siteContent.blog?.posts;
  const post = blogPosts?.[id];

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
 
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-semibold text-gray-800 mb-4">Blog Post Not Found</h1>
          <p className="text-gray-600">The requested blog post was not found.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <div className="relative h-[70vh]">
      <Navigation />
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
      <Footer />
    </div>
  );
}

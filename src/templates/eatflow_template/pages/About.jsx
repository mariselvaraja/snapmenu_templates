import React from 'react';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { Leaf, ChefHat, UtensilsCrossed, Award, Users, Clock, Heart } from 'lucide-react';
import { useSiteContent } from '../context/SiteContentContext';

const stats = [
  {
    icon: <Award className="w-8 h-8 text-green-500" />,
    value: "10+",
    label: "Years Experience"
  },
  {
    icon: <Users className="w-8 h-8 text-green-500" />,
    value: "50k+",
    label: "Happy Customers"
  },
  {
    icon: <Clock className="w-8 h-8 text-green-500" />,
    value: "24/7",
    label: "Fast Delivery"
  }
];

const team = [
  {
    name: "Sarah Johnson",
    role: "Head Chef",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80",
    description: "With over 15 years of culinary experience, Sarah brings creativity and expertise to every dish."
  },
  {
    name: "Michael Chen",
    role: "Nutritionist",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80",
    description: "Michael ensures all our meals are perfectly balanced for optimal nutrition and taste."
  },
  {
    name: "Emma Williams",
    role: "Operations Manager",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80",
    description: "Emma oversees our daily operations to ensure the highest quality service."
  }
];

export function About() {
  const { siteContent } = useSiteContent();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[70vh]">
        <div className="absolute inset-0">
          <img 
            src={siteContent.story.hero.image}
            alt="About background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>
        
        <Navigation />

        <div className="relative z-10 container mx-auto px-6 h-[calc(70vh-120px)] flex items-center justify-center text-center">
          <div>
            <div className="flex justify-center mb-6">
              <Leaf className="w-16 h-16 text-green-400" />
            </div>
            <h1 className="text-7xl font-bold text-white mb-8">
              {siteContent.story.hero.title}
            </h1>
            <p className="text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              {siteContent.story.hero.description}
            </p>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl font-bold mb-8">Our Story</h2>
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                Founded in 2014, EatFlow began with a simple mission: to make healthy eating both delicious and convenient. We believed that nutritious food shouldn't compromise on taste, and that busy lifestyles shouldn't mean sacrificing health.
              </p>
              <p className="text-xl text-gray-600 mb-12 leading-relaxed">
                Today, we continue to innovate in the kitchen, creating meals that not only satisfy hunger but also contribute to overall wellness. Every dish is crafted with care, using locally-sourced ingredients and sustainable practices.
              </p>
              <div className="grid grid-cols-3 gap-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex justify-center mb-4">{stat.icon}</div>
                    <h4 className="text-3xl font-bold text-green-600 mb-2">{stat.value}</h4>
                    <p className="text-gray-600">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80"
                alt="Our story"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-8 -left-8 bg-white p-8 rounded-2xl shadow-xl">
                <div className="flex items-center space-x-4">
                  <ChefHat className="w-12 h-12 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">500+</p>
                    <p className="text-gray-600">Daily Orders</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These core principles guide everything we do at {siteContent.brand.name}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {siteContent.story.values.map((value, index) => {
              // Function to render the appropriate icon
              const renderValueIcon = (iconName) => {
                switch(iconName) {
                  case 'UtensilsCrossed':
                    return <UtensilsCrossed className="w-10 h-10 text-green-600" />;
                  case 'Heart':
                    return <Heart className="w-10 h-10 text-green-600" />;
                  case 'Users':
                    return <Users className="w-10 h-10 text-green-600" />;
                  default:
                    return <UtensilsCrossed className="w-10 h-10 text-green-600" />;
                }
              };
              
              return (
                <div key={index} className="bg-white p-12 rounded-2xl shadow-lg text-center">
                  <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    {renderValueIcon(value.icon)}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
                  <p className="text-gray-600 text-lg">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The passionate individuals behind EatFlow's success
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {team.map((member, index) => (
              <div key={index} className="text-center group">
                <div className="relative h-96 mb-6 overflow-hidden rounded-2xl">
                  <img 
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition duration-500"></div>
                </div>
                <h3 className="text-2xl font-bold mb-2">{member.name}</h3>
                <p className="text-green-600 font-semibold mb-4">{member.role}</p>
                <p className="text-gray-600 text-lg">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaWineGlass, FaUtensils, FaClock, FaCoffee, FaGlassMartini, 
  FaHamburger, FaPizzaSlice, FaConciergeBell, FaChair, FaFire, FaBreadSlice,
  FaTruck, FaMotorcycle, FaShoppingBag, FaMapMarkerAlt, FaCalendarAlt, FaUsers,
  FaStar, FaMoneyBillWave, FaMobileAlt, FaCarSide, FaShippingFast, FaPercent,
  FaUserTie, FaClipboardList, FaReceipt
} from 'react-icons/fa';
import { useAppSelector } from '../../../../common/redux';

// Define interfaces for the experienceCard data structure
interface ExperienceCardSection {
  title?: string;
  subtitle?: string;
}

interface ExperienceCardItem {
  icon: string;
  title: string;
  description: string;
  image: string;
}

interface ExperienceCard {
  section?: ExperienceCardSection;
  cards?: ExperienceCardItem[];
}

// Type for icon components
type IconComponent = React.ComponentType<React.SVGAttributes<SVGElement>>;

export const ExperienceSection: React.FC = () => {
  const { rawApiResponse } = useAppSelector(state => state.siteContent);
  
  // Get site content from Redux state
  const siteContent = rawApiResponse ? 
    (typeof rawApiResponse === 'string' ? JSON.parse(rawApiResponse) : rawApiResponse) : 
    {};
  const homepage = siteContent.homepage;
  const experienceCard: ExperienceCard = homepage?.experience || {};

  // Only render if experienceCard has data
  if (!experienceCard.cards || experienceCard.cards.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">{experienceCard.section?.title || "The Art of Fine Dining"}</h2>
          <p className="text-xl text-gray-600">{experienceCard.section?.subtitle || "Discover the pillars of our gastronomic excellence"}</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {experienceCard.cards.map((card: ExperienceCardItem, index: number) => {
            // Map string icon names to imported icon components
            const iconMap: Record<string, IconComponent> = {
              Wine: FaWineGlass,
              UtensilsCrossed: FaUtensils,
              Clock: FaClock,
              Coffee: FaCoffee,
              GlassMartini: FaGlassMartini,
              Hamburger: FaHamburger,
              Pizza: FaPizzaSlice,
              ConciergeBell: FaConciergeBell,
              Chair: FaChair,
              Fire: FaFire,
              BreadSlice: FaBreadSlice,
              Truck: FaTruck,
              Motorcycle: FaMotorcycle,
              ShoppingBag: FaShoppingBag,
              MapMarker: FaMapMarkerAlt,
              Calendar: FaCalendarAlt,
              Users: FaUsers,
              Star: FaStar,
              MoneyBill: FaMoneyBillWave,
              Mobile: FaMobileAlt,
              Car: FaCarSide,
              Shipping: FaShippingFast,
              Percent: FaPercent,
              UserTie: FaUserTie,
              Clipboard: FaClipboardList,
              Receipt: FaReceipt
            };
            
            const IconComponent = iconMap[card.icon] || FaUtensils; // Default to FaUtensils if icon not found
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-white p-6 text-center"
              >
                <IconComponent className="h-12 w-12 text-red-500 mx-auto my-4" />
                <h3 className="text-xl font-semibold mb-4">{card.title}</h3>
                <p className="text-gray-600">{card.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;

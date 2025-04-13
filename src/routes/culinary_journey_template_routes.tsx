import React from 'react';
import { Route } from 'react-router-dom';
import { commonRoutePaths } from './common_routes';

// Import components from culinary_journey_template
// @ts-ignore
import { Hero, FoodCarousel, Experience, Testimonials } from '../templates/culinary_journey_template/components/home';
// @ts-ignore
import { MenuCategories, MenuList, ProductDetail } from '../templates/culinary_journey_template/components/menu';
// @ts-ignore
import { StoryPage } from '../templates/culinary_journey_template/components/story/StoryPage';
// @ts-ignore
import { BlogPage } from '../templates/culinary_journey_template/components/blog/BlogPage';
// @ts-ignore
import { BlogPostPage } from '../templates/culinary_journey_template/components/blog/BlogPostPage';
// @ts-ignore
import { GalleryPage } from '../templates/culinary_journey_template/components/gallery';
// @ts-ignore
import { EventsPage } from '../templates/culinary_journey_template/components/events';
// @ts-ignore
import { ContactPage } from '../templates/culinary_journey_template/components/contact/ContactPage';
// @ts-ignore
import { ReservationPage, ReservationDetails, ReservationConfirmation, ReservationLookup } from '../templates/culinary_journey_template/components/reservation';
// @ts-ignore
import { CheckoutPage } from '../templates/culinary_journey_template/components/checkout/CheckoutPage';
// @ts-ignore
import { OrderConfirmation } from '../templates/culinary_journey_template/components/checkout/OrderConfirmation';
// @ts-ignore
import { LoginPage } from '../templates/culinary_journey_template/components/auth/LoginPage';
// @ts-ignore
import { AdminDashboard } from '../templates/culinary_journey_template/components/admin/AdminDashboard';
// @ts-ignore
import { Navbar, Footer } from '../templates/culinary_journey_template/components/layout';
// Import CulinaryJourneyLayout to access its components
// @ts-ignore
import { CulinaryJourneyLayout } from '../templates/culinary_journey_template/CulinaryJourneyLayout';

// Define PublicLayout and AdminRoute components similar to CulinaryJourneyLayout.jsx
function AdminRoute({ children }: { children: React.ReactNode }) {
  // Simplified version for routes
  return <>{children}</>;
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

/**
 * Define routes for the culinary journey template
 * These routes are used in the culinary_journey_template/App.jsx file
 */
const CulinaryJourneyTemplateRoutes = [
  // Home route
  <Route key="home" path={commonRoutePaths.home} element={
    <PublicLayout>
      <Hero />
      <section id="signature-dishes">
        <FoodCarousel />
      </section>
      <section id="culinary-journey">
        <Experience />
      </section>
      <section id="guest-testimonials">
        <Testimonials />
      </section>
    </PublicLayout>
  } />,
  
  // Menu routes
  <Route key="menu" path={commonRoutePaths.menu} element={<PublicLayout><MenuCategories /></PublicLayout>} />,
  <Route key="menu-category" path="/menu/:categoryId" element={<PublicLayout><MenuList /></PublicLayout>} />,
  <Route key="menu-item" path="/menu/:categoryId/:itemId" element={<PublicLayout><ProductDetail /></PublicLayout>} />,
  
  // About/Story route
  <Route key="about" path={commonRoutePaths.about} element={<PublicLayout><StoryPage /></PublicLayout>} />,
  
  // Reservation routes
  <Route key="reservation" path={commonRoutePaths.reservation} element={<PublicLayout><ReservationPage /></PublicLayout>} />,
  <Route key="reservation-details" path="/reservation/details" element={<PublicLayout><ReservationDetails /></PublicLayout>} />,
  <Route key="reservation-confirmation" path="/reservation/confirmation" element={<PublicLayout><ReservationConfirmation /></PublicLayout>} />,
  <Route key="reservation-lookup" path="/reservation/lookup" element={<PublicLayout><ReservationLookup /></PublicLayout>} />,
  
  // Checkout routes
  <Route key="checkout" path={commonRoutePaths.checkout} element={<PublicLayout><CheckoutPage /></PublicLayout>} />,
  <Route key="checkout-confirmation" path="/checkout/confirmation" element={<PublicLayout><OrderConfirmation /></PublicLayout>} />,
  
  // Blog routes
  <Route key="blog" path={commonRoutePaths.blog} element={<PublicLayout><BlogPage /></PublicLayout>} />,
  <Route key="blog-post" path={commonRoutePaths.blogPost} element={<PublicLayout><BlogPostPage /></PublicLayout>} />,
  
  // Other pages
  <Route key="contact" path={commonRoutePaths.contact} element={<PublicLayout><ContactPage /></PublicLayout>} />,
  <Route key="events" path={commonRoutePaths.events} element={<PublicLayout><EventsPage /></PublicLayout>} />,
  <Route key="gallery" path="/gallery" element={<PublicLayout><GalleryPage /></PublicLayout>} />,
  
  // Auth routes
  <Route key="login" path="/login" element={<LoginPage />} />,
  
  // Admin routes
  <Route key="admin" path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
];

export default CulinaryJourneyTemplateRoutes;

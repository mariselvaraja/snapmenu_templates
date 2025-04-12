import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PizzaTemplateRoutes from './routes/pizza_template_routes';
import CasualDiningTemplateRoutes from './routes/casual_dining_template_routes';
import TemplateNotFound from './templates/TemplateNotFound';

/**
 * Main Router component that handles routing based on the selected template
 * This component is used by App.jsx to render the appropriate template routes
 */
const AppRouter = ({ templateId }) => {
  // Render the appropriate template routes based on the templateId
  const renderTemplateRoutes = () => {
    switch (templateId) {
      case 'pizza_template':
        return (
          <Routes>
            {PizzaTemplateRoutes}
          </Routes>
        );
      case 'casual_dining_template':
        return (
          <Routes>
            {CasualDiningTemplateRoutes}
          </Routes>
        );
      default:
        // If no template is found, render a default route
        return (
          <Routes>
            <Route path="*" element={<TemplateNotFound/>} />
          </Routes>
        );
    }
  };

  return (
    <Router>
      {renderTemplateRoutes()}
    </Router>
  );
};

export default AppRouter;

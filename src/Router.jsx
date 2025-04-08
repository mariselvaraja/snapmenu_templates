import { Routes, Route, Navigate, BrowserRouter as Router } from 'react-router-dom';
import React from 'react';

// Import shared components
import TableReservation from './shared/components/reservation/tableReservation';

// Import template layouts
import { EatflowLayout } from './templates/eatflow_template_snapmenu/src/route';

// Import template layouts
import { PizzaLayout } from './templates/pizza_template_snapmenu/src/route';
import { CasualDiningLayout } from './templates/casual_dining_template_snapmenu/src/route';
import { CulinaryJourneyLayout } from './templates/culinary_journey_template_snapmenu/src/CulinaryJourneyLayout';

// Import context providers
import { SiteContentProvider } from './templates/eatflow_template_snapmenu/src/context/SiteContentContext';
import { MenuProvider } from './templates/eatflow_template_snapmenu/src/context/MenuContext';
import { CartProvider } from './templates/eatflow_template_snapmenu/src/context/CartContext';
import { SiteContentProvider as PizzaSiteContentProvider } from './templates/pizza_template_snapmenu/src/context/SiteContentContext';
import { MenuProvider as PizzaMenuProvider } from './templates/pizza_template_snapmenu/src/context/MenuContext';
import { MenuProvider as CasualDiningMenuProvider } from './templates/casual_dining_template_snapmenu/src/context/MenuContext';
import { ContentProvider as CasualDiningContentProvider } from './templates/casual_dining_template_snapmenu/src/context/ContentContext';

// Root Router component
function RouterComponent() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
      {/* Root route - show TableReservation component */}
      <Route path="/" element={<TableReservation />} />
      
      {/* Reserve Table route */}
      {/* <Route path="/reserveTable" element={<TableReservation />} /> */}

      {/* EatFlow Template Routes */}
      <Route path="/eatflow/*" element={
        <SiteContentProvider isPreview={false}>
          <MenuProvider isPreview={false}>
            <CartProvider>
              <EatflowLayout />
            </CartProvider>
          </MenuProvider>
        </SiteContentProvider>
      } />

      {/* Pizza Template Routes */}
      <Route path="/pizza/*" element={
        <PizzaSiteContentProvider>
          <PizzaMenuProvider>
            <PizzaLayout />
          </PizzaMenuProvider>
        </PizzaSiteContentProvider>
      } />

      {/* Casual Dining Template Routes */}
      <Route path="/casual-dining/*" element={
        <CasualDiningContentProvider>
          <CasualDiningMenuProvider>
            <CasualDiningLayout />
          </CasualDiningMenuProvider>
        </CasualDiningContentProvider>
      } />

      {/* Culinary Journey Template Routes */}
      <Route path="/culinary-journey/*" element={<CulinaryJourneyLayout />} />
      
      {/* Indian Culinary Journey Template Routes - Same template as culinary-journey */}
      <Route path="/indian/*" element={<CulinaryJourneyLayout />} />

      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default RouterComponent;

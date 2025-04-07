import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { PizzaLayout } from './route';
import { MenuProvider } from './context/MenuContext';
import { SiteContentProvider } from './context/SiteContentContext';
import { SearchProvider } from './context/SearchContext';

function App() {
  return (
    <SiteContentProvider>
      <MenuProvider>
        <SearchProvider>
          <Router>
            <PizzaLayout />
          </Router>
        </SearchProvider>
      </MenuProvider>
    </SiteContentProvider>
  );
}

export default App;

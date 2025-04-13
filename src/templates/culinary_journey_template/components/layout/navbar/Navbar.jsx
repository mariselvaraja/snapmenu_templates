import React, { useState, useEffect } from 'react';
import { Menu, Utensils, Settings, Search, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../../../context';
import { Link, useNavigate } from 'react-router-dom';
import { MobileMenu } from '../MobileMenu';
import { CartSummary } from '../../cart/CartSummary';
import SearchModal from '../../common/SearchModal';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();

  console.log('Navbar auth state:', { session: auth.session, loading: auth.loading });

  async function handleLogout() {
    try {
      console.log('Navbar: Logging out...');
      await auth.signOut();
      console.log('Navbar: Logout successful');
      navigate('/');
    } catch (err) {
      console.error('Navbar: Logout error:', err);
    }
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check if e.key exists before calling toLowerCase()
      if (e.key && e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // Using fallback data directly instead of useRootSiteContent
  const siteContent = {
    brand: {
      name: "Culinary Journey",
      logo: {
        url: null,
        text: "Culinary Journey"
      }
    },
    navigation: {
      links: [
        { label: "Home", path: "/", isEnabled: true },
        { label: "Menu", path: "/menu", isEnabled: true },
        { label: "Our Story", path: "/our-story", isEnabled: true },
        { label: "Reservations", path: "/reservation", isEnabled: true },
        { label: "Events", path: "/events", isEnabled: true },
        { label: "Blog", path: "/blog", isEnabled: true },
        { label: "Contact", path: "/contact", isEnabled: true }
      ]
    }
  };
  
  // Use links from siteContent
  const links = siteContent.navigation.links;

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Settings':
        return <Settings className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearchClick = () => {
    setIsSearchOpen(true);
  };

  const isAuthenticated = !!auth.session;

  // Use brand directly from siteContent
  const brand = siteContent.brand;

  return (
    <>
      <nav className="fixed w-full top-0 z-50 bg-black/80 backdrop-blur-sm">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center space-x-2 text-white">
              {brand?.logo?.url ? 
                <img src={brand.logo.url} alt={brand.logo.text || "Logo"} className='h-10 w-10'/> : 
                <Utensils className="h-6 w-6" />
              }
              <span className="text-2xl font-serif">{brand?.name || "Culinary Journey"}</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              {links && links.filter(link => link.isEnabled !== false).map((link, index) => {
                // Skip admin link from content if user is not authenticated
                if (link.path === '/admin' && !isAuthenticated) return null;
                // Skip admin link from content if it's already shown
                if (link.path === '/admin' && isAuthenticated) return null;
                return (
                  <Link
                    key={index}
                    to={link.path}
                    className="text-white/80 hover:text-white font-light flex items-center"
                    aria-label={link.ariaLabel || link.label}
                  >
                    {link.icon ? getIcon(link.icon) : link.label}
                  </Link>
                );
              })}
              {isAuthenticated && (
                <Link
                  to="/admin"
                  className="text-white/80 hover:text-white font-light flex items-center gap-2"
                >
                  <Settings className="h-5 w-5" />
                  <span className="hidden sm:inline">Admin</span>
                </Link>
              )}
              <button
                onClick={handleSearchClick}
                className="text-white/80 hover:text-white flex items-center gap-2 font-light group"
                aria-label="Search"
                data-testid="search-button"
              >
                <Search className="lucide lucide-search h-5 w-5 group-hover:scale-105 transition-transform" />
                <kbd className="hidden sm:inline-flex items-center gap-1 text-[10px] text-white/40 font-mono bg-white/5 px-1.5 py-0.5 rounded border border-white/10 group-hover:border-white/20 transition-colors">
                  <span className="text-[10px]">⌘</span>K
                </kbd>
              </button>
              {/* {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="text-white/80 hover:text-white flex items-center gap-2 font-light"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="text-white/80 hover:text-white flex items-center gap-2 font-light"
                >
                  <LogIn className="h-5 w-5" />
                  <span className="hidden sm:inline">Login</span>
                </Link>
              )} */}
              <CartSummary />
            </div>

            <div className="md:hidden flex items-center gap-4">
              <CartSummary />
              <button 
                onClick={() => setIsMobileMenuOpen(true)} 
                className="text-white"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <MobileMenu 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onNavigate={scrollToSection}
      />
      <SearchModal 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}

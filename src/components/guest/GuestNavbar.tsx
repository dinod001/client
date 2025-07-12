import { useEffect, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useUser, UserButton, SignInButton } from '@clerk/clerk-react';
import { 
  LeafIcon, 
  MenuIcon, 
  X, 
  PhoneIcon, 
  MailIcon,
  SparklesIcon,
  AwardIcon,
  ClockIcon,
  ShieldCheckIcon
} from 'lucide-react';
const GuestNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isSignedIn, user } = useUser();
  const { scrollY } = useScroll();
  
  // Dynamic background based on scroll with enhanced effects
  const backgroundColor = useTransform(
    scrollY, 
    [0, 100], 
    ['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.98)']
  );
  const boxShadow = useTransform(
    scrollY, 
    [0, 100], 
    ['0 0 0 rgba(0,0,0,0)', '0 8px 32px rgba(0,0,0,0.15)']
  );
  const backdropBlur = useTransform(
    scrollY,
    [0, 100],
    ['blur(0px)', 'blur(20px)']
  );

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { name: 'Home', path: '/', hasDropdown: false },
    { name: 'About', path: '/about', hasDropdown: false },
    { name: 'Services', path: '/services', hasDropdown: false },
    { name: 'Blog', path: '/blog', hasDropdown: false },
    { name: 'Inquiry', path: '/inquiry', hasDropdown: false }
  ];

  return (
    <>
      {/* Premium Top Bar */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-2.5 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2 group">
                <PhoneIcon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span className="hover:text-green-200 transition-colors">+94 11 234 5678</span>
              </div>
              <div className="flex items-center space-x-2 group">
                <MailIcon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span className="hover:text-green-200 transition-colors">info@ecoclean.lk</span>
              </div>
              <div className="flex items-center space-x-2 group">
                <ClockIcon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span className="hover:text-green-200 transition-colors">24/7 Service Available</span>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <AwardIcon className="h-4 w-4" />
                <span className="text-green-100 font-medium">ISO 9001 Certified</span>
              </div>
              <div className="text-green-100 font-medium">
                🌱 Making Sri Lanka cleaner, one service at a time
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Main Navigation */}
      <motion.header 
        style={{
          backgroundColor,
          boxShadow,
          backdropFilter: backdropBlur
        }} 
        className="sticky top-0 z-50 border-b border-green-100/20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-20">
            
            {/* Enhanced Logo */}
            <div className="flex-shrink-0">
              <NavLink to="/" className="flex items-center space-x-3 group">
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  animate={{
                    rotate: [0, 5, -5, 0]
                  }} 
                  transition={{
                    rotate: {
                      repeat: Infinity,
                      duration: 3,
                      ease: 'easeInOut'
                    }
                  }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-green-200 rounded-full opacity-20 group-hover:opacity-30 transition-opacity"></div>
                  <LeafIcon className="h-10 w-10 text-green-600 relative z-10" />
                </motion.div>
                <div className="flex flex-col">
                  <span className="font-bold text-2xl text-green-600 leading-none">EcoClean</span>
                  <span className="text-xs text-green-500 font-medium tracking-wide">Sri Lanka</span>
                </div>
              </NavLink>
            </div>

            {/* Center Navigation - Fixed Alignment */}
            <div className="hidden lg:flex flex-1 justify-center items-center">
              <nav className="flex items-center justify-center space-x-2">
                {navItems.map((item) => (
                  <div key={item.name} className="relative">
                    <NavLink
                      to={item.path}
                      className={({ isActive }) => `
                        relative px-8 py-3 rounded-xl font-semibold text-base transition-all duration-200 group
                        ${isActive 
                          ? 'text-green-600 bg-green-50' 
                          : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                        }
                      `}
                    >
                      {({ isActive }) => (
                        <>
                          <span className="relative z-10">{item.name}</span>
                          {isActive && (
                            <motion.div
                              layoutId="navbar-pill"
                              className="absolute inset-0 bg-green-100 rounded-xl -z-0"
                              initial={false}
                              transition={{ type: "spring", duration: 0.6 }}
                            />
                          )}
                        </>
                      )}
                    </NavLink>
                  </div>
                ))}
              </nav>
            </div>

            {/* Enhanced Desktop Auth Section */}
            <div className="hidden lg:flex items-center space-x-4 flex-shrink-0">
              {isSignedIn ? (
                <div className="flex items-center space-x-4">
                  <Link 
                    to="/dashboard" 
                    className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200 flex items-center space-x-2 group"
                  >
                    <ShieldCheckIcon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    <span>Dashboard</span>
                  </Link>
                  <div className="flex items-center space-x-3">
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-semibold text-gray-700">
                        {user?.firstName || 'User'}
                      </span>
                      <span className="text-xs text-green-600 font-medium">Premium Member</span>
                    </div>
                    <UserButton 
                      appearance={{
                        elements: {
                          avatarBox: "w-10 h-10 rounded-xl ring-2 ring-green-200 hover:ring-green-300 transition-all shadow-lg"
                        }
                      }}
                      showName={false}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <SignInButton mode="modal">
                    <button className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200 flex items-center space-x-2 group">
                      <span>Sign In</span>
                    </button>
                  </SignInButton>
                  <SignInButton mode="modal">
                    <button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2 group">
                      <span>Get Started</span>
                      <SparklesIcon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    </button>
                  </SignInButton>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-gray-600 hover:text-green-600 hover:bg-green-50 transition-all duration-200 ml-auto"
            >
              <motion.div
                animate={{ rotate: isMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
              </motion.div>
            </button>
          </div>
        </div>

        {/* Enhanced Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white/95 backdrop-blur-lg border-t border-green-100"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <div key={item.name}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => `
                      block px-4 py-3 rounded-xl font-medium transition-all duration-200
                      ${isActive 
                        ? 'text-green-600 bg-green-50' 
                        : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                      }
                    `}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </NavLink>
                </div>
              ))}

              {/* Enhanced Mobile Auth */}
              <div className="pt-4 border-t border-green-100 space-y-3">
                {isSignedIn ? (
                  <div className="space-y-2">
                    <Link
                      to="/dashboard"
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-xl font-medium transition-all duration-200 group"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <ShieldCheckIcon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      <span>Dashboard</span>
                    </Link>
                    <div className="px-4 py-2 bg-green-50 rounded-xl">
                      <p className="text-sm font-medium text-gray-700">Welcome back!</p>
                      <p className="text-xs text-green-600">{user?.firstName || 'User'}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <SignInButton mode="modal">
                      <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-xl font-medium transition-all duration-200">
                        <span>Sign In</span>
                      </button>
                    </SignInButton>
                    <SignInButton mode="modal">
                      <button className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg">
                        <span>Get Started</span>
                        <SparklesIcon className="h-4 w-4" />
                      </button>
                    </SignInButton>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </motion.header>
    </>
  );
};

export default GuestNavbar;
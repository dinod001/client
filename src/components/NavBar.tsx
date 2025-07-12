import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser, UserButton, SignInButton } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { LeafIcon } from 'lucide-react';

const NavBar: React.FC = () => {
  const { user, isSignedIn } = useUser();
  const location = useLocation();

  const guestNavItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={isSignedIn ? "/dashboard" : "/"} className="flex items-center space-x-2">
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0] }} 
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            >
              <LeafIcon className="h-7 w-7 text-green-500" />
            </motion.div>
            <span className="font-bold text-xl text-green-600">EcoClean</span>
          </Link>

          {/* Navigation Links for Guest Users */}
          {!isSignedIn && (
            <div className="hidden md:flex items-center space-x-8">
              {guestNavItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    location.pathname === item.path
                      ? 'text-green-600 border-b-2 border-green-600'
                      : 'text-gray-700 hover:text-green-600'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          )}

          {/* Authentication Section */}
          <div className="flex items-center space-x-4">
            {isSignedIn ? (
              <>
                {/* User Information */}
                <div className="flex items-center space-x-3">
                  <div className="text-sm">
                    <p className="text-gray-900 font-medium">
                      Welcome, {user?.firstName} {user?.lastName}
                    </p>
                  </div>
                  
                  {/* Clerk UserButton with dropdown */}
                  <UserButton 
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10"
                      }
                    }}
                    showName={false}
                  />
                </div>
              </>
            ) : (
              <>
                {/* Not signed in - Show Get Started button */}
                <SignInButton mode="modal">
                  <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200">
                    Get Started
                  </button>
                </SignInButton>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

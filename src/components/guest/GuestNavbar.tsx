
import { useEffect, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useUser, useAuth, UserButton, SignInButton } from '@clerk/clerk-react';
import { 
  LeafIcon, 
  MenuIcon, 
  XIcon, 
  PhoneIcon, 
  MailIcon,
  SparklesIcon,
  AwardIcon,
  ClockIcon,
  ShieldCheckIcon,
  StarIcon,
  TrendingUpIcon,
  GiftIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from 'lucide-react';

// Define interfaces for TypeScript
interface Booking {
  _id: string;
  serviceName: string;
  date: string;
  status: string;
}

interface Pickup {
  _id: string;
  scheduleDate?: string;
  createdAt: string;
  status: string;
}

// Milestone utilities (aligned with RewardPoints)
const milestoneIcons: { [key: number]: React.ComponentType<{ className?: string }> } = {
  0: StarIcon,
  20: TrendingUpIcon,
  40: AwardIcon,
  60: GiftIcon,
  80: ArrowRightIcon,
  100: CheckCircleIcon,
};

const milestoneLabels: { [key: number]: string } = {
  0: 'Eco Beginner',
  20: 'Eco Explorer',
  40: 'Eco Achiever',
  60: 'Eco Motivator',
  80: 'Eco Leader',
  100: 'Green Enthusiast',
};

const getCurrentMilestone = (points: number): number => {
  const milestones = [0, 20, 40, 60, 80, 100];
  let current = 0;
  for (let milestone of milestones) {
    if (points >= milestone) {
      current = milestone;
    } else {
      break;
    }
  }
  return current;
};

const GuestNavbar = () => {
  const [userPoints, setUserPoints] = useState<number>(0);
  const [loadingMilestone, setLoadingMilestone] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const { scrollY } = useScroll();

  // Dynamic background based on scroll
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

  // Fetch user points for milestone (guest view, only if signed in)
  useEffect(() => {
    const fetchPoints = async () => {
      if (!isSignedIn) {
        setUserPoints(0);
        setLoadingMilestone(false);
        return;
      }
      try {
        const token = await getToken();
        if (!token) throw new Error('No authentication token available');
        const bookingsRes = await fetch('http://localhost:5000/api/user/all-bookings', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!bookingsRes.ok) throw new Error('Failed to fetch bookings');
        const bookingsData = await bookingsRes.json();
        const completedBookings: Booking[] = (bookingsData.allBookings || []).filter(
          (b: Booking) => b.status === 'Completed'
        );

        const pickupsRes = await fetch('http://localhost:5000/api/user/get-all-pickup-request', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!pickupsRes.ok) throw new Error('Failed to fetch pickups');
        const pickupsData = await pickupsRes.json();
        const completedPickups: Pickup[] = (pickupsData.allPickups || []).filter(
          (p: Pickup) => p.status === 'Completed'
        );

        setUserPoints(completedBookings.length + completedPickups.length);
      } catch (error) {
        console.error('Error fetching points:', error);
        setUserPoints(0);
      } finally {
        setLoadingMilestone(false);
      }
    };
    fetchPoints();
  }, [isSignedIn, getToken]);

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
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Blog', path: '/blog' },
    { name: 'Inquiry', path: '/guest/inquiry' },
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
              {/* Motivational Milestone Badge replaces ISO 9001 Certified */}
              {isSignedIn && !loadingMilestone ? (
                (() => {
                  const currentMilestone = getCurrentMilestone(userPoints);
                  const Icon = milestoneIcons[currentMilestone];
                  return (
                    <span className="flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 text-white font-semibold text-xs shadow">
                      <Icon className="h-4 w-4 mr-1" />
                      {milestoneLabels[currentMilestone]}
                    </span>
                  );
                })()
              ) : null}
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
          backdropFilter: backdropBlur,
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
                    rotate: [0, 5, -5, 0],
                  }} 
                  transition={{
                    rotate: {
                      repeat: Infinity,
                      duration: 3,
                      ease: 'easeInOut',
                    },
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

            {/* Center Navigation */}
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
                              className="absolute inset-0 bg-green-100 rounded-xl -z-10"
                              initial={false}
                              transition={{ type: 'spring', duration: 0.6 }}
                            />
                          )}
                        </>
                      )}
                    </NavLink>
                  </div>
                ))}
              </nav>
            </div>

            {/* Desktop Auth Section */}
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
                          avatarBox: 'w-10 h-10 rounded-xl ring-2 ring-green-200 hover:ring-green-300 transition-all shadow-lg',
                        },
                      }}
                      showName={false}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <SignInButton>
                    <button className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200 flex items-center space-x-2 group">
                      <span>Sign In</span>
                    </button>
                  </SignInButton>
                  <SignInButton>
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
                {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
              </motion.div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
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
              {/* Mobile Auth */}
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
                    <div className="px-4 py-2 bg-green-50 rounded-xl flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Welcome back!</p>
                        <p className="text-xs text-green-600">{user?.firstName || 'User'}</p>
                      </div>
                      <UserButton 
                        appearance={{
                          elements: {
                            avatarBox: 'w-8 h-8 rounded-lg ring-2 ring-green-200',
                          },
                        }}
                        showName={false}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <SignInButton>
                      <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-xl font-medium transition-all duration-200">
                        <span>Sign In</span>
                      </button>
                    </SignInButton>
                    <SignInButton>
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
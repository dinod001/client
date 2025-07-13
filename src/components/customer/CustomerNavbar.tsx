
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, useUser, UserButton, SignInButton } from '@clerk/clerk-react';
import { 
  BellIcon, 
  LeafIcon, 
  MenuIcon, 
  StarIcon, 
  TrendingUpIcon, 
  AwardIcon, 
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

interface Notification {
  id: string;
  message: string;
  createdAt: string;
}

// Milestone utilities (aligned with RewardPoints and GuestNavbar)
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

const CustomerNavbar = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const [userPoints, setUserPoints] = useState<number>(0);
  const [loadingMilestone, setLoadingMilestone] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const { getToken } = useAuth();
  const { isSignedIn } = useUser();

  // Fetch user points for milestone
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
        setError('Failed to load points');
      } finally {
        setLoadingMilestone(false);
      }
    };
    fetchPoints();
  }, [isSignedIn, getToken]);

  // Fetch notifications from API
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!isSignedIn) {
        setNotifications([]);
        setNotificationCount(0);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const token = await getToken();
        if (!token) throw new Error('No authentication token available');
        const response = await fetch('http://localhost:5000/api/user/get-All-notifications', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) throw new Error('Failed to fetch notifications');
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          setNotifications(result.data);
          setNotificationCount(result.data.length);
        } else {
          setNotifications([]);
          setNotificationCount(0);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setNotifications([]);
        setNotificationCount(0);
        setError('Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [isSignedIn, getToken]);

  // Handle clicking outside the notification dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  return (
    <>
      {/* Premium Top Bar (same as GuestNavbar) */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-2.5 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2 group">
                <span className="hover:text-green-200 transition-colors">+94 11 234 5678</span>
              </div>
              <div className="flex items-center space-x-2 group">
                <span className="hover:text-green-200 transition-colors">info@ecoclean.lk</span>
              </div>
              <div className="flex items-center space-x-2 group">
                <span className="hover:text-green-200 transition-colors">24/7 Service Available</span>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              {/* Motivational Milestone Badge */}
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
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-16 left-0 right-0 bg-red-50 border border-red-200 rounded-lg p-3 mx-4 text-sm text-red-800 flex items-center"
              >
                <span>{error}</span>
              </motion.div>
            )}
            {/* Left Section - Logo & Menu */}
            <div className="flex items-center space-x-3">
              <button
                onClick={onMenuClick}
                className="p-2 rounded-lg text-gray-600 hover:text-green-600 hover:bg-gray-50 lg:hidden transition-colors"
              >
                <MenuIcon className="h-5 w-5" />
              </button>
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                  <LeafIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="font-bold text-xl text-gray-900">EcoClean</span>
                  <span className="text-xs text-gray-500 block leading-none">Professional Services</span>
                </div>
              </Link>
            </div>
            {/* Right Section - Notifications & Profile */}
            <div className="flex items-center space-x-4">
              {/* Notification Bell */}
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-lg text-gray-600 hover:text-green-600 hover:bg-gray-50 transition-colors"
                >
                  <BellIcon className="h-5 w-5" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-medium">
                      {notificationCount > 9 ? '9+' : notificationCount}
                    </span>
                  )}
                </button>
                {/* Notification Dropdown */}
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900">Notifications</h3>
                          {notificationCount > 0 && (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                              {notificationCount}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {loading ? (
                          <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
                            <span className="ml-2 text-gray-600 text-sm">Loading...</span>
                          </div>
                        ) : notifications.length === 0 ? (
                          <div className="text-center py-8">
                            <BellIcon className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                            <p className="text-gray-500 text-sm">No notifications</p>
                          </div>
                        ) : (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className="px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-b-0"
                            >
                              <p className="text-sm text-gray-800 line-clamp-2">{notification.message}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(notification.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                      {notifications.length > 0 && (
                        <div className="border-t border-gray-100">
                          <Link
                            to="/notifications"
                            className="block text-center text-sm text-green-600 hover:text-green-700 py-3 font-medium"
                            onClick={() => setShowNotifications(false)}
                          >
                            View all notifications
                          </Link>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {/* User Profile */}
              <div className="relative">
                {isSignedIn ? (
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: 'h-8 w-8 rounded-lg',
                        userButtonPopoverCard: 'shadow-lg border rounded-xl',
                        userButtonPopoverActionButton: 'hover:bg-gray-50 rounded-lg',
                        userButtonPopoverActionButtonText: 'text-sm',
                      },
                    }}
                    afterSignOutUrl="/"
                  />
                ) : (
                  <SignInButton>
                    <button className="text-sm text-gray-700 hover:text-green-600 hover:bg-gray-50 px-3 py-2 rounded-lg">
                      Sign In
                    </button>
                  </SignInButton>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.header>
    </>
  );
};

export default CustomerNavbar;
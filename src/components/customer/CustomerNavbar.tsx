import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, UserButton } from '@clerk/clerk-react';
import { BellIcon, LeafIcon, MenuIcon } from 'lucide-react';

const CustomerNavbar = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const notificationRef = useRef<HTMLDivElement>(null);
  const { getToken } = useAuth();

  // Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      
      if (!token) {
        console.error('No token available');
        return;
      }

      const response = await fetch('http://localhost:5000/api/user/get-All-notifications', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const result = await response.json();
      console.log('Notifications API Response:', result);
      
      if (result.success && result.data) {
        setNotifications(result.data);
        setNotificationCount(result.data.length);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
      setNotificationCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

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

  return <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
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
            {/* Notification Bell - Simplified */}
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
              
              {/* Simplified Notification Dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
                  >
                    {/* Header */}
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
                    
                    {/* Content */}
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
                        notifications.map((notification, index) => (
                          <div 
                            key={notification.id || index}
                            className="px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-b-0"
                          >
                            <p className="text-sm text-gray-800 line-clamp-2">
                              {notification.message || notification.title || 'New notification'}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {notification.time || notification.createdAt || 'Recent'}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                    
                    {/* Footer */}
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

            {/* Simplified User Profile */}
            <div className="relative">
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "h-8 w-8 rounded-lg",
                    userButtonPopoverCard: "shadow-lg border rounded-xl",
                    userButtonPopoverActionButton: "hover:bg-gray-50 rounded-lg",
                    userButtonPopoverActionButtonText: "text-sm"
                  }
                }}
                afterSignOutUrl="/"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.header>;
};
export default CustomerNavbar;
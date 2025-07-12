import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@clerk/clerk-react';
import { BellIcon, TruckIcon, CalendarIcon, StarIcon, AlertTriangleIcon, InfoIcon, RefreshCwIcon, SearchIcon } from 'lucide-react';

// Define notification interface
interface Notification {
  id: number | string;
  type: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const Notifications = () => {
  const { getToken } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch notifications from backend
  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const response = await fetch('http://localhost:5000/api/user/get-All-notifications', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      
      // Console log the complete response to see the data structure
      console.log('🔔 Notifications API Response:', {
        status: response.status,
        ok: response.ok,
        result: result
      });

      if (response.ok && result.success) {
        // Set the notifications data from result.data and sort by latest first
        const notificationsData = result.data || [];
        
        // Sort notifications by creation date/time (latest first)
        const sortedNotifications = notificationsData.sort((a: Notification, b: Notification) => {
          // Try to use createdAt first, then updatedAt, then date as fallback
          const dateA = new Date(a.createdAt || a.updatedAt || a.date || 0).getTime();
          const dateB = new Date(b.createdAt || b.updatedAt || b.date || 0).getTime();
          return dateB - dateA; // Latest first (descending order)
        });
        
        setNotifications(sortedNotifications);
        console.log('✅ Notifications fetched and sorted successfully:', sortedNotifications);
        console.log('📊 Number of notifications:', sortedNotifications.length);
        
        if (sortedNotifications.length === 0) {
          console.log('📭 No notifications found - user has no notifications yet');
        }
      } else {
        setError(result.message || 'Failed to fetch notifications');
        console.log('❌ Failed to fetch notifications:', result.message);
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      console.error('🚨 Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications();
  }, []);
  const [filter, setFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const getFilteredNotifications = () => {
    let filtered = notifications;
    
    // Filter by type
    if (filter === 'unread') {
      filtered = filtered.filter(n => !n.read);
    } else if (filter !== 'all') {
      filtered = filtered.filter(n => n.type === filter);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(query) || 
        n.message.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  };
  const filteredNotifications = getFilteredNotifications();

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Fetch fresh data from backend
    fetchNotifications().finally(() => {
      setIsRefreshing(false);
    });
  };
  const getNotificationIcon = (type: string) => {
    const iconProps = "h-5 w-5";
    switch (type) {
      case 'pickup':
        return <TruckIcon className={`${iconProps} text-blue-500`} />;
      case 'reward':
        return <StarIcon className={`${iconProps} text-yellow-500`} />;
      case 'service':
        return <CalendarIcon className={`${iconProps} text-purple-500`} />;
      case 'alert':
        return <AlertTriangleIcon className={`${iconProps} text-red-500`} />;
      case 'info':
        return <InfoIcon className={`${iconProps} text-green-500`} />;
      default:
        return <BellIcon className={`${iconProps} text-indigo-500`} />;
    }
  };

  const getNotificationColors = (type: string) => {
    switch (type) {
      case 'pickup':
        return {
          bg: 'from-blue-50 to-blue-100',
          border: 'border-blue-200',
          iconBg: 'bg-blue-100',
          accent: 'bg-blue-500'
        };
      case 'reward':
        return {
          bg: 'from-yellow-50 to-amber-100',
          border: 'border-yellow-200',
          iconBg: 'bg-yellow-100',
          accent: 'bg-yellow-500'
        };
      case 'service':
        return {
          bg: 'from-purple-50 to-purple-100',
          border: 'border-purple-200',
          iconBg: 'bg-purple-100',
          accent: 'bg-purple-500'
        };
      case 'alert':
        return {
          bg: 'from-red-50 to-red-100',
          border: 'border-red-200',
          iconBg: 'bg-red-100',
          accent: 'bg-red-500'
        };
      case 'info':
        return {
          bg: 'from-green-50 to-emerald-100',
          border: 'border-green-200',
          iconBg: 'bg-green-100',
          accent: 'bg-green-500'
        };
      default:
        return {
          bg: 'from-indigo-50 to-indigo-100',
          border: 'border-indigo-200',
          iconBg: 'bg-indigo-100',
          accent: 'bg-indigo-500'
        };
    }
  };

  const formatNotificationTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <BellIcon className="h-8 w-8 text-white" />
                  </div>
                  {notifications.length > 0 && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg"
                    >
                      <span className="text-white text-sm font-bold">
                        {notifications.length > 99 ? '99+' : notifications.length}
                      </span>
                    </motion.div>
                  )}
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    Notifications
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Stay updated with your EcoClean activities
                  </p>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50"
              >
                <RefreshCwIcon className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
              </motion.button>
            </div>
            
            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search Input */}
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all"
                />
              </div>
              
              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'all', label: 'All', icon: BellIcon },
                  { id: 'unread', label: 'Unread', icon: BellIcon },
                  { id: 'pickup', label: 'Pickups', icon: TruckIcon },
                  { id: 'reward', label: 'Rewards', icon: StarIcon },
                  { id: 'service', label: 'Services', icon: CalendarIcon },
                  { id: 'alert', label: 'Alerts', icon: AlertTriangleIcon }
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = filter === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setFilter(item.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                          : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
        {/* Content Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden"
        >
          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <BellIcon className="absolute inset-0 m-auto h-6 w-6 text-indigo-600" />
              </div>
              <span className="mt-4 text-gray-600 font-medium">Loading notifications...</span>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="m-6 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl p-6"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangleIcon className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-red-800">Unable to load notifications</h3>
                  <p className="text-red-600 mt-1">{error}</p>
                  <button
                    onClick={fetchNotifications}
                    className="mt-3 text-red-600 hover:text-red-700 underline font-medium"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Notifications List */}
          {!loading && !error && (
            <>
              {filteredNotifications.length > 0 ? (
                <div className="p-6">
                  <div className="space-y-4">
                    <AnimatePresence initial={false}>
                      {filteredNotifications.map((notification, index) => {
                        const colors = getNotificationColors(notification.type);
                        return (
                          <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, x: -20, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 20, scale: 0.95 }}
                            transition={{ 
                              duration: 0.3,
                              delay: index * 0.05,
                              type: "spring",
                              stiffness: 100
                            }}
                            className={`bg-gradient-to-r ${colors.bg} border ${colors.border} rounded-2xl p-6 relative overflow-hidden shadow-lg hover:shadow-xl transition-all group cursor-pointer`}
                          >
                            {/* Accent Line */}
                            <div className={`absolute left-0 top-0 w-1 h-full ${colors.accent}`}></div>
                            
                            <div className="flex items-start space-x-4">
                              {/* Icon */}
                              <div className={`${colors.iconBg} p-3 rounded-xl shrink-0 group-hover:scale-110 transition-transform`}>
                                {getNotificationIcon(notification.type)}
                              </div>
                              
                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                                      {notification.title}
                                    </h3>
                                    <p className="text-gray-600 mt-2 leading-relaxed">
                                      {notification.message}
                                    </p>
                                  </div>
                                  
                                  {/* Time */}
                                  <span className="text-sm text-gray-500 font-medium ml-4 shrink-0">
                                    {formatNotificationTime(notification.createdAt || notification.updatedAt || notification.date)}
                                  </span>
                                </div>
                                
                                {/* Type Badge */}
                                <div className="mt-4">
                                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${colors.accent} text-white`}>
                                    {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Hover Effect Overlay */}
                            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity"></div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                /* Empty State */
                <div className="text-center py-20">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 100 }}
                  >
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                      <BellIcon className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                      {filter !== 'all' || searchQuery.trim() ? 'No matching notifications' : 'No notifications yet'}
                    </h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      {filter !== 'all' || searchQuery.trim() 
                        ? `No notifications found for "${filter !== 'all' ? filter : searchQuery.trim()}". Try adjusting your filters or search terms.`
                        : "You're all caught up! New notifications will appear here when you have updates."
                      }
                    </p>
                    {(filter !== 'all' || searchQuery.trim()) && (
                      <div className="mt-6 space-x-3">
                        <button 
                          onClick={() => setFilter('all')}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          View all notifications
                        </button>
                        {searchQuery.trim() && (
                          <button 
                            onClick={() => setSearchQuery('')}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                          >
                            Clear search
                          </button>
                        )}
                      </div>
                    )}
                  </motion.div>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};
export default Notifications;
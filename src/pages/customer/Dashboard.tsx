import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useUser, useAuth } from '@clerk/clerk-react';

// Define interfaces for our data structures
interface Inquiry {
  _id: string;
  userId: string;
  subject: string;
  message: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  createdAt: string;
  updatedAt: string;
  response?: string;
}

interface ServiceBooking {
  _id: string;
  userId: string;
  userName: string;
  serviceName: string;
  contact: string;
  location: string;
  date: string;
  advance: number;
  price: number;
  balance: number;
  staff: string[];
  status: 'Pending' | 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled';
  createdAt: string;
  updatedAt: string;
}

interface PickupRequest {
  _id: string;
  userId: string;
  address: string;
  date: string;
  time: string;
  wasteType: string;
  quantity: string;
  instructions: string;
  status: 'Pending' | 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  createdAt: string;
  updatedAt: string;
}

interface Notification {
  _id?: string;
  id?: number | string;
  userId?: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt?: string;
  updatedAt?: string;
  date?: string;
}

interface Payment {
  _id: string;
  userId: string;
  serviceBookingId?: string;
  amount: number;
  method: 'card' | 'bank' | 'cash';
  status: 'Pending' | 'Completed' | 'Failed';
  description: string;
  createdAt: string;
}

const Dashboard = () => {
  // State management
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [serviceBookings, setServiceBookings] = useState<ServiceBooking[]>([]);
  const [pickupRequests, setPickupRequests] = useState<PickupRequest[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { user } = useUser();
  const { getToken } = useAuth();

  // Utility functions
  const formatDate = (dateInput: string | Date) => {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Enhanced user data with real-time stats
  const userStats = {
    name: user?.firstName || 'User',
    email: user?.emailAddresses?.[0]?.emailAddress || 'user@example.com',
    memberSince: user?.createdAt ? formatDate(user.createdAt) : 'Unknown',
    points:
      serviceBookings.filter((s: ServiceBooking) => s.status === 'Completed').length +
      pickupRequests.filter((p: PickupRequest) => p.status === 'Completed').length,
    level: user?.publicMetadata?.level || 'Member',
    totalInquiries: inquiries.length,
    activeServices: serviceBookings.filter((s: ServiceBooking) => ['Pending', 'Confirmed', 'In Progress'].includes(s.status)).length,
    pendingServiceBookings: serviceBookings.filter((s: ServiceBooking) => s.status === 'Pending').length,
    pendingPickups: pickupRequests.filter((p: PickupRequest) => p.status === 'Pending').length,
    unreadNotifications: notifications.filter((n: Notification) => !n.read).length,
    totalSpent: payments.filter((p: Payment) => p.status === 'Completed').reduce((sum: number, p: Payment) => sum + p.amount, 0)
  };

  // Fetch all data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchServiceBookings(),
          fetchPickupRequests(),
          fetchInquiries(),
          fetchNotifications(),
          fetchPayments()
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Fetch real service bookings using existing API
  const fetchServiceBookings = async () => {
    try {
      const token = await getToken();
      const response = await fetch('http://localhost:5000/api/user/all-bookings', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setServiceBookings(result.allBookings || []);
      } else {
        console.error('Failed to fetch bookings:', result.message);
      }
    } catch (err) {
      console.error('Error fetching service bookings:', err);
    }
  };

  // Fetch real pickup requests using existing API
  const fetchPickupRequests = async () => {
    try {
      const token = await getToken();
      const response = await fetch('http://localhost:5000/api/user/get-all-pickup-request', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      if (response.ok && result.success) {
        setPickupRequests(result.allPickups || []);
      } else {
        console.error('Failed to fetch pickup requests:', result.message);
      }
    } catch (err) {
      console.error('Error fetching pickup requests:', err);
    }
  };

  // Fetch real inquiries using existing API
  const fetchInquiries = async () => {
    try {
      const token = await getToken();
      const response = await fetch('http://localhost:5000/api/user/inquiries', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setInquiries(result.inquiries || []);
      } else {
        console.error('Failed to fetch inquiries:', result.message);
      }
    } catch (err) {
      console.error('Error fetching inquiries:', err);
    }
  };

  // Fetch real notifications using improved API and sort by latest
  const fetchNotifications = async () => {
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
      if (response.ok && result.success) {
        const notificationsData = result.data || [];
        // Sort notifications by creation date/time (latest first)
        const sortedNotifications = notificationsData.sort((a: Notification, b: Notification) => {
          const dateA = new Date(a.createdAt || a.updatedAt || a.date || 0).getTime();
          const dateB = new Date(b.createdAt || b.updatedAt || b.date || 0).getTime();
          return dateB - dateA;
        });
        setNotifications(sortedNotifications);
      } else {
        console.error('Failed to fetch notifications:', result.message);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  // Fetch real payments using existing API
  const fetchPayments = async () => {
    try {
      const token = await getToken();
      const response = await fetch('http://localhost:5000/api/user/payments', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setPayments(result.payments || []);
      } else {
        console.error('Failed to fetch payments:', result.message);
      }
    } catch (err) {
      console.error('Error fetching payments:', err);
    }
  };

  // Removed unused deleteBooking function

  // Initialize demo data for other sections

  // Utility functions

  const formatCurrency = (amount: number): string => {
    return `Rs. ${amount.toLocaleString()}`;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Confirmed': 'bg-blue-100 text-blue-800',
      'In Progress': 'bg-purple-100 text-purple-800',
      'Completed': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800',
      'Open': 'bg-yellow-100 text-yellow-800',
      'Resolved': 'bg-green-100 text-green-800',
      'Closed': 'bg-gray-100 text-gray-800',
      'Scheduled': 'bg-blue-100 text-blue-800',
      'Failed': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  // Format notification time (relative)
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

  // Notification type badge color
  const getNotificationBadgeColor = (type: string) => {
    switch (type) {
      case 'pickup': return 'bg-blue-500';
      case 'reward': return 'bg-yellow-500';
      case 'service': return 'bg-purple-500';
      case 'alert': return 'bg-red-500';
      case 'info': return 'bg-green-500';
      default: return 'bg-indigo-500';
    }
  };

  // Overview Component
  const OverviewComponent = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 rounded-xl text-white">
        <h2 className="text-2xl font-bold">Welcome back, {userStats.name}!</h2>
        <p className="mt-2 opacity-90">{`${userStats.level} • Member since ${userStats.memberSince}`}</p>
        <div className="mt-4 flex items-center space-x-4">
          <div className="bg-white/20 px-3 py-1 rounded-full">
            <span className="text-sm font-medium">{userStats.points} Reward Points</span>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Inquiries</p>
              <p className="text-2xl font-bold text-gray-900">{userStats.totalInquiries}</p>
            </div>
            <div className="text-3xl">💬</div>
          </div>
        </div>

        {/* Active Services card removed as requested */}

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Service Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{userStats.pendingServiceBookings}</p>
            </div>
            <div className="text-3xl">⏳</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Pickups</p>
              <p className="text-2xl font-bold text-gray-900">{userStats.pendingPickups}</p>
            </div>
            <div className="text-3xl">🚛</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(userStats.totalSpent)}</p>
            </div>
            <div className="text-3xl">💳</div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Services */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Recent Services</h3>
          <div className="space-y-3">
            {serviceBookings.slice(0, 3).map((service: ServiceBooking) => (
              <div key={service._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{service.serviceName}</p>
                  <p className="text-sm text-gray-600">{formatDate(service.date)}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}> 
                  {service.status}
                </span>
              </div>
            ))}
            {serviceBookings.length === 0 && (
              <p className="text-gray-500 text-center py-4">No services yet</p>
            )}
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Recent Notifications</h3>
          <div className="space-y-3">
            {notifications.slice(0, 3).map((notification: Notification) => (
              <div key={notification._id || notification.id} className={`p-3 rounded-lg flex flex-col gap-1 ${notification.read ? 'bg-gray-50' : 'bg-blue-50'}`}> 
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{notification.title}</p>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getNotificationBadgeColor(notification.type)} text-white ml-2`}>
                    {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500 mt-1">{formatNotificationTime(notification.createdAt ?? notification.updatedAt ?? notification.date ?? '')}</p>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full ml-2"></div>
                  )}
                </div>
              </div>
            ))}
            {notifications.length === 0 && (
              <p className="text-gray-500 text-center py-4">No notifications</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Main render with centered layout
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Only show overview by default, no tab navigation */}
            <OverviewComponent />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: 'pickup' | 'service' | 'reward' | 'alert' | 'info';
  read: boolean;
  createdAt: string;
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
  const [activeTab, setActiveTab] = useState<'overview' | 'inquiries' | 'services' | 'pickups' | 'notifications' | 'payments'>('overview');
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [serviceBookings, setServiceBookings] = useState<ServiceBooking[]>([]);
  const [pickupRequests, setPickupRequests] = useState<PickupRequest[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const { user } = useUser();
  const { getToken } = useAuth();

  // Enhanced user data with real-time stats
  const userStats = {
    name: user?.firstName || 'User',
    email: user?.emailAddresses?.[0]?.emailAddress || 'user@example.com',
    memberSince: 'January 2024',
    points: 1247,
    level: 'Gold Member',
    totalInquiries: inquiries.length,
    activeServices: serviceBookings.filter(s => ['Pending', 'Confirmed', 'In Progress'].includes(s.status)).length,
    pendingPickups: pickupRequests.filter(p => ['Pending', 'Scheduled'].includes(p.status)).length,
    unreadNotifications: notifications.filter(n => !n.read).length,
    totalSpent: payments.filter(p => p.status === 'Completed').reduce((sum, p) => sum + p.amount, 0)
  };

  // Fetch all data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchServiceBookings(),
          initializeDemoData()
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

  // Delete booking function
  const deleteBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
      return;
    }

    try {
      const token = await getToken();
      const response = await fetch(`http://localhost:5000/api/user/delete-booking/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Remove the deleted booking from state
        setServiceBookings(prev => prev.filter(booking => booking._id !== bookingId));
        alert('Booking deleted successfully!');
      } else {
        alert(`Failed to delete booking: ${result.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error deleting booking:', err);
      alert('Error deleting booking. Please try again.');
    }
  };

  // Initialize demo data for other sections
  const initializeDemoData = () => {
    // Demo inquiries
    setInquiries([
      {
        _id: '1',
        userId: user?.id || 'user1',
        subject: 'Pickup Schedule Issue',
        message: 'My scheduled pickup was missed yesterday. Can you please reschedule?',
        status: 'Open',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: '2',
        userId: user?.id || 'user1',
        subject: 'Service Quality Feedback',
        message: 'Very satisfied with the garden cleanup service. Excellent work!',
        status: 'Resolved',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
        response: 'Thank you for your positive feedback! We appreciate your business.'
      }
    ]);

    // Demo pickup requests
    setPickupRequests([
      {
        _id: '1',
        userId: user?.id || 'user1',
        address: '123 Green Street, Colombo 05',
        date: new Date(Date.now() + 172800000).toISOString(),
        time: '09:00',
        wasteType: 'Household Waste',
        quantity: '2-3 bags',
        instructions: 'Please collect from main gate',
        status: 'Scheduled',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]);

    // Demo notifications
    setNotifications([
      {
        _id: '1',
        userId: user?.id || 'user1',
        title: 'Pickup Confirmed',
        message: 'Your pickup request for tomorrow has been confirmed',
        type: 'pickup',
        read: false,
        createdAt: new Date().toISOString()
      },
      {
        _id: '2',
        userId: user?.id || 'user1',
        title: 'Service Completed',
        message: 'Your garden cleanup service has been completed successfully',
        type: 'service',
        read: true,
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ]);

    // Demo payments
    setPayments([
      {
        _id: '1',
        userId: user?.id || 'user1',
        serviceBookingId: '1',
        amount: 2000,
        method: 'card',
        status: 'Completed',
        description: 'Advance payment for Garden Cleanup',
        createdAt: new Date().toISOString()
      },
      {
        _id: '2',
        userId: user?.id || 'user1',
        amount: 3500,
        method: 'bank',
        status: 'Completed',
        description: 'Household waste collection - Monthly',
        createdAt: new Date(Date.now() - 604800000).toISOString()
      }
    ]);
  };

  // Utility functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
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

  // Tab configuration
  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'inquiries', label: 'Inquiries', icon: '💬', count: inquiries.length },
    { id: 'services', label: 'Services', icon: '🔧', count: serviceBookings.length },
    { id: 'pickups', label: 'Pickups', icon: '🚛', count: pickupRequests.length },
    { id: 'notifications', label: 'Notifications', icon: '🔔', count: userStats.unreadNotifications },
    { id: 'payments', label: 'Payments', icon: '💳', count: payments.length }
  ];

  // Overview Component
  const OverviewComponent = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 rounded-xl text-white">
        <h2 className="text-2xl font-bold">Welcome back, {userStats.name}!</h2>
        <p className="mt-2 opacity-90">{userStats.level} • Member since {userStats.memberSince}</p>
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

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Services</p>
              <p className="text-2xl font-bold text-gray-900">{userStats.activeServices}</p>
            </div>
            <div className="text-3xl">🔧</div>
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
            {serviceBookings.slice(0, 3).map((service) => (
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
            {notifications.slice(0, 3).map((notification) => (
              <div key={notification._id} className={`p-3 rounded-lg ${notification.read ? 'bg-gray-50' : 'bg-blue-50'}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{notification.title}</p>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(notification.createdAt)}</p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
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

  // Inquiries Component
  const InquiriesComponent = () => (
    <div className="space-y-6">        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Inquiries</h2>
          <button
            onClick={() => alert('Inquiry form will be implemented')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            New Inquiry
          </button>
        </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {inquiries.map((inquiry) => (
                <tr key={inquiry._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{inquiry.subject}</p>
                      <p className="text-sm text-gray-600 truncate max-w-xs">{inquiry.message}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(inquiry.status)}`}>
                      {inquiry.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDate(inquiry.createdAt)}
                  </td>                    <td className="px-6 py-4">
                      <button
                        onClick={() => alert(`Viewing inquiry: ${inquiry.subject}`)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View
                      </button>
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
          {inquiries.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No inquiries yet. Create your first inquiry!
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Services Component
  const ServicesComponent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Service Bookings</h2>
        <button
          onClick={() => window.location.href = '/customer/book-service'}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Book New Service
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {serviceBookings.map((service) => (
                <tr key={service._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{service.serviceName}</p>
                      <p className="text-sm text-gray-600">{service.location}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDate(service.date)}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{formatCurrency(service.price)}</p>
                      <p className="text-sm text-gray-600">Advance: {formatCurrency(service.advance)}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                      {service.status}
                    </span>
                  </td>                    <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => alert(`Viewing service: ${service.serviceName}`)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View Details
                      </button>
                      {/* Show delete button only for Pending bookings */}
                      {service.status === 'Pending' && (
                        <button
                          onClick={() => deleteBooking(service._id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {serviceBookings.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No service bookings yet. Book your first service!
            </div>
          )}
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
            {/* Tab Navigation */}
            <div className="bg-white rounded-xl shadow-sm border mb-8">
              <div className="flex flex-wrap border-b border-gray-200">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'border-b-2 border-green-600 text-green-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                    {tab.count !== undefined && tab.count > 0 && (
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'overview' && <OverviewComponent />}
                {activeTab === 'inquiries' && <InquiriesComponent />}
                {activeTab === 'services' && <ServicesComponent />}
                {/* Add other components as needed */}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
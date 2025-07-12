import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@clerk/clerk-react';
import { 
  CalendarIcon, 
  MapPinIcon, 
  PhoneIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon as PendingIcon,
  ClockIcon,
  RefreshCwIcon,
  AlertCircleIcon,
  TruckIcon,
  CreditCardIcon,
  EditIcon,
  SaveIcon
} from 'lucide-react';

// Define booking interface based on API response
interface Booking {
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
  __v: number;
}

// Custom Alert/Toast Component
interface AlertMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}

// Confirmation Modal Component
interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

const ConfirmationModal = ({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger'
}: ConfirmationModalProps) => {
  if (!isOpen) return null;

  const typeStyles = {
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-yellow-600 hover:bg-yellow-700',
    info: 'bg-blue-600 hover:bg-blue-700'
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start space-x-4">
          <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
            type === 'danger' ? 'bg-red-100' : 
            type === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
          }`}>
            {type === 'danger' && <XCircleIcon className="h-6 w-6 text-red-600" />}
            {type === 'warning' && <AlertCircleIcon className="h-6 w-6 text-yellow-600" />}
            {type === 'info' && <AlertCircleIcon className="h-6 w-6 text-blue-600" />}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="flex space-x-3 justify-end">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className={`px-4 py-2 text-white rounded-lg font-medium transition-colors ${typeStyles[type]}`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Toast Alert Component
const ToastAlert = ({ alert, onClose }: { alert: AlertMessage; onClose: (id: string) => void }) => {
  const typeStyles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  const iconStyles = {
    success: <CheckCircleIcon className="h-5 w-5 text-green-600" />,
    error: <XCircleIcon className="h-5 w-5 text-red-600" />,
    warning: <AlertCircleIcon className="h-5 w-5 text-yellow-600" />,
    info: <AlertCircleIcon className="h-5 w-5 text-blue-600" />
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      className={`border rounded-lg p-4 shadow-lg ${typeStyles[alert.type]} max-w-md`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {iconStyles[alert.type]}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold">{alert.title}</h4>
          <p className="text-sm mt-1">{alert.message}</p>
        </div>
        <button
          onClick={() => onClose(alert.id)}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600"
        >
          <XCircleIcon className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
};

const ServiceBookingDashboard = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentLoading, setPaymentLoading] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<AlertMessage[]>([]);
  const [editingBooking, setEditingBooking] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Booking>>({});
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });
  const { getToken } = useAuth();

  // Fetch user's bookings on component mount
  useEffect(() => {
    fetchBookings();
  }, []);

  // Auto-remove alerts after 5 seconds
  useEffect(() => {
    if (alerts.length > 0) {
      const timer = setTimeout(() => {
        setAlerts(prev => prev.slice(1));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alerts]);

  // Helper function to show alerts
  const showAlert = (type: AlertMessage['type'], title: string, message: string) => {
    const id = Date.now().toString();
    setAlerts(prev => [...prev, { id, type, title, message }]);
  };

  // Helper function to close alert
  const closeAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  // Helper function to show confirmation modal
  const showConfirmation = (title: string, message: string, onConfirm: () => void) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirm
    });
  };

  // Helper function to close confirmation modal
  const closeConfirmation = () => {
    setConfirmModal({
      isOpen: false,
      title: '',
      message: '',
      onConfirm: () => {}
    });
  };

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
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
        // Sort bookings by creation date (latest first)
        const sortedBookings = (result.allBookings || []).sort((a: Booking, b: Booking) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        setBookings(sortedBookings);
      } else {
        setError(result.message || 'Failed to fetch bookings');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle advance payment
  const handlePayAdvance = async (bookingId: string) => {
    setPaymentLoading(bookingId);
    console.log('🔄 Payment Request Started for booking:', bookingId);
    
    try {
      const token = await getToken();
      const response = await fetch('http://localhost:5000/api/user/purchase', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Origin': 'http://localhost:5000'
        },
        body: JSON.stringify({
          bookingId: bookingId
        })
      });

      const result = await response.json();
      
      // Log the complete response for debugging
      console.log('💰 Payment API Response:', {
        status: response.status,
        ok: response.ok,
        result: result
      });

      if (response.ok && result.success) {
        console.log('✅ Payment successful! Redirecting to Stripe checkout...');
        
        // Check if we have a session_url for Stripe checkout
        if (result.session_url) {
          console.log('🔗 Redirecting to Stripe:', result.session_url);
          // Redirect to Stripe checkout page
          window.location.href = result.session_url;
        } else {
          // If no session_url, just refresh bookings (old flow)
          console.log('📝 No session URL, refreshing bookings...');
          await fetchBookings();
          showAlert('success', 'Payment Successful', 'Your advance payment has been processed successfully!');
        }
      } else {
        console.log('❌ Payment failed:', result.message);
        showAlert('error', 'Payment Failed', result.message || 'Failed to process payment');
        setError(null);
      }
    } catch (err) {
      console.log('🚨 Payment error:', err);
      showAlert('error', 'Payment Error', 'Payment processing failed. Please try again.');
      setError(null);
      console.error('Error processing payment:', err);
    } finally {
      setPaymentLoading(null);
    }
  };

  // Handle balance payment for completed services
  const handlePayBalance = async (bookingId: string) => {
    setPaymentLoading(bookingId);
    console.log('🔄 Balance Payment Request Started for booking:', bookingId);
    
    try {
      const token = await getToken();
      const response = await fetch('http://localhost:5000/api/user/purchase', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Origin': 'http://localhost:5000'
        },
        body: JSON.stringify({
          bookingId: bookingId
        })
      });

      const result = await response.json();
      
      // Log the complete response for debugging
      console.log('💳 Balance Payment API Response:', {
        status: response.status,
        ok: response.ok,
        result: result
      });

      if (response.ok && result.success) {
        console.log('✅ Balance payment successful! Redirecting to Stripe checkout...');
        
        // Check if we have a session_url for Stripe checkout
        if (result.session_url) {
          console.log('🔗 Redirecting to Stripe for balance payment:', result.session_url);
          // Redirect to Stripe checkout page
          window.location.href = result.session_url;
        } else {
          // If no session_url, just refresh bookings (old flow)
          console.log('📝 No session URL, refreshing bookings...');
          await fetchBookings();
          showAlert('success', 'Payment Successful', 'Your balance payment has been processed successfully!');
        }
      } else {
        console.log('❌ Balance payment failed:', result.message);
        showAlert('error', 'Payment Failed', result.message || 'Failed to process balance payment');
        setError(null);
      }
    } catch (err) {
      console.log('🚨 Balance payment error:', err);
      showAlert('error', 'Payment Error', 'Balance payment processing failed. Please try again.');
      setError(null);
      console.error('Error processing balance payment:', err);
    } finally {
      setPaymentLoading(null);
    }
  };

  // Delete booking function for pending bookings
  const handleDeleteBooking = async (bookingId: string) => {
    const confirmDelete = () => {
      performDelete(bookingId);
      closeConfirmation();
    };

    showConfirmation(
      'Delete Booking',
      'Are you sure you want to delete this booking? This action cannot be undone.',
      confirmDelete
    );
  };

  const performDelete = async (bookingId: string) => {
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
        setBookings(prev => prev.filter(booking => booking._id !== bookingId));
        setError(null);
        showAlert('success', 'Booking Deleted', 'Your booking has been successfully deleted.');
        console.log('✅ Booking deleted successfully');
      } else {
        showAlert('error', 'Delete Failed', result.message || 'Failed to delete booking');
        console.log('❌ Delete booking failed:', result.message);
      }
    } catch (err) {
      showAlert('error', 'Delete Error', 'Error deleting booking. Please try again.');
      console.error('Error deleting booking:', err);
    }
  };

  // Handle edit booking
  const handleEditBooking = (booking: Booking) => {
    setEditingBooking(booking._id);
    setEditFormData({
      userName: booking.userName,
      serviceName: booking.serviceName,
      contact: booking.contact,
      location: booking.location,
      date: booking.date,
      advance: booking.advance,
      price: booking.price,
      balance: booking.balance
    });
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingBooking(null);
    setEditFormData({});
  };

  // Handle save edit
  const handleSaveEdit = async (bookingId: string) => {
    setUpdateLoading(true);
    
    try {
      const token = await getToken();
      const bookingToUpdate = bookings.find(b => b._id === bookingId);
      
      if (!bookingToUpdate) {
        showAlert('error', 'Update Failed', 'Booking not found');
        return;
      }

      const updatedBookingData = {
        ...bookingToUpdate,
        ...editFormData,
        _id: bookingId
      };

      const response = await fetch('http://localhost:5000/api/user/update-booking', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          serviceBookData: updatedBookingData
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Update the booking in state
        setBookings(prev => prev.map(booking => 
          booking._id === bookingId 
            ? { ...booking, ...editFormData }
            : booking
        ));
        setEditingBooking(null);
        setEditFormData({});
        showAlert('success', 'Booking Updated', 'Your booking has been successfully updated.');
        console.log('✅ Booking updated successfully');
      } else {
        showAlert('error', 'Update Failed', result.message || 'Failed to update booking');
        console.log('❌ Update booking failed:', result.message);
      }
    } catch (err) {
      showAlert('error', 'Update Error', 'Error updating booking. Please try again.');
      console.error('Error updating booking:', err);
    } finally {
      setUpdateLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (field: keyof Booking, value: string | number) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Get status color and icon
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'Pending':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: PendingIcon,
          bgColor: 'bg-yellow-500'
        };
      case 'Confirmed':
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: CheckCircleIcon,
          bgColor: 'bg-blue-500'
        };
      case 'In Progress':
        return {
          color: 'bg-purple-100 text-purple-800 border-purple-200',
          icon: TruckIcon,
          bgColor: 'bg-purple-500'
        };
      case 'Completed':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: CheckCircleIcon,
          bgColor: 'bg-green-500'
        };
      case 'Cancelled':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: XCircleIcon,
          bgColor: 'bg-red-500'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: AlertCircleIcon,
          bgColor: 'bg-gray-500'
        };
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      {/* Toast Alerts */}
      <div className="fixed top-4 right-4 z-50 space-y-3">
        <AnimatePresence>
          {alerts.map((alert) => (
            <ToastAlert key={alert.id} alert={alert} onClose={closeAlert} />
          ))}
        </AnimatePresence>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        <ConfirmationModal
          isOpen={confirmModal.isOpen}
          title={confirmModal.title}
          message={confirmModal.message}
          onConfirm={confirmModal.onConfirm}
          onCancel={closeConfirmation}
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
        />
      </AnimatePresence>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Service Bookings</h1>
            <p className="text-gray-600 mt-2">
              Track and manage all your service bookings
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchBookings}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <RefreshCwIcon className="h-4 w-4" />
            Refresh
          </motion.button>
        </div>
      </motion.div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading your bookings...</span>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8"
        >
          <div className="flex items-center">
            <XCircleIcon className="h-6 w-6 text-red-600 mr-2" />
            <p className="text-red-800">{error}</p>
          </div>
          <button
            onClick={fetchBookings}
            className="mt-3 text-red-600 hover:text-red-700 underline"
          >
            Try again
          </button>
        </motion.div>
      )}

      {/* No Bookings State */}
      {!loading && !error && bookings.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20"
        >
          <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <CalendarIcon className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Bookings Yet</h3>
          <p className="text-gray-500 mb-4">You haven't made any service bookings yet.</p>
          <motion.a
            href="/services"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Services
          </motion.a>
        </motion.div>
      )}

      {/* Bookings List */}
      {!loading && !error && bookings.length > 0 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {bookings.map((booking) => {
            const statusDisplay = getStatusDisplay(booking.status);
            const StatusIcon = statusDisplay.icon;

            return (
              <motion.div
                key={booking._id}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                {/* Status Header - Enhanced */}
                <div className={`${statusDisplay.bgColor} px-6 py-4 relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                  <div className="relative flex items-center justify-between text-white">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                        <StatusIcon className="h-5 w-5" />
                      </div>
                      <span className="font-bold text-lg">{booking.status}</span>
                    </div>
                    <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                      <span className="text-sm font-medium">
                        #{booking._id.slice(-8)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="p-6">
                  {/* Service Name - Compact */}
                  <div className="mb-4">
                    {editingBooking === booking._id ? (
                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-gray-700">Service Name</label>
                        <input
                          type="text"
                          value={editFormData.serviceName || ''}
                          onChange={(e) => handleInputChange('serviceName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white text-sm font-medium"
                          placeholder="Enter service name"
                        />
                      </div>
                    ) : (
                      <h3 className="text-lg font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {booking.serviceName}
                      </h3>
                    )}
                  </div>

                  <div className="space-y-4">
                    {/* User Info - Compact */}
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <UserIcon className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        {editingBooking === booking._id ? (
                          <div className="space-y-1">
                            <label className="block text-xs font-medium text-blue-700">Customer Name</label>
                            <input
                              type="text"
                              value={editFormData.userName || ''}
                              onChange={(e) => handleInputChange('userName', e.target.value)}
                              className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                              placeholder="Your full name"
                            />
                          </div>
                        ) : (
                          <div>
                            <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">Customer</p>
                            <p className="text-gray-900 font-semibold text-sm">{booking.userName}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Contact - Compact */}
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <PhoneIcon className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        {editingBooking === booking._id ? (
                          <div className="space-y-1">
                            <label className="block text-xs font-medium text-green-700">Contact Number</label>
                            <input
                              type="tel"
                              value={editFormData.contact || ''}
                              onChange={(e) => handleInputChange('contact', e.target.value)}
                              className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-sm"
                              placeholder="+94 XX XXX XXXX"
                            />
                          </div>
                        ) : (
                          <div>
                            <p className="text-xs text-green-600 font-medium uppercase tracking-wide">Contact</p>
                            <p className="text-gray-900 font-semibold text-sm">{booking.contact}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Date & Time - Compact */}
                    <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="flex-shrink-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                        <CalendarIcon className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        {editingBooking === booking._id ? (
                          <div className="space-y-2">
                            <label className="block text-xs font-semibold text-purple-700">📅 Service Date & Time</label>
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="date"
                                value={editFormData.date ? 
                                  (() => {
                                    const date = new Date(editFormData.date);
                                    const offset = date.getTimezoneOffset();
                                    const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000));
                                    return adjustedDate.toISOString().slice(0, 10);
                                  })() : ''
                                }
                                onChange={(e) => {
                                  const currentDate = editFormData.date ? new Date(editFormData.date) : new Date();
                                  const newDate = new Date(e.target.value);
                                  newDate.setHours(currentDate.getHours(), currentDate.getMinutes());
                                  handleInputChange('date', newDate.toISOString());
                                }}
                                className="px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white text-sm"
                                min={new Date().toISOString().slice(0, 10)}
                              />
                              <input
                                type="time"
                                value={editFormData.date ? 
                                  (() => {
                                    const date = new Date(editFormData.date);
                                    const offset = date.getTimezoneOffset();
                                    const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000));
                                    return adjustedDate.toISOString().slice(11, 16);
                                  })() : ''
                                }
                                onChange={(e) => {
                                  const currentDate = editFormData.date ? new Date(editFormData.date) : new Date();
                                  const [hours, minutes] = e.target.value.split(':');
                                  currentDate.setHours(parseInt(hours), parseInt(minutes));
                                  handleInputChange('date', currentDate.toISOString());
                                }}
                                className="px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white text-sm"
                              />
                            </div>
                          </div>
                        ) : (
                          <div>
                            <p className="text-xs text-purple-600 font-medium uppercase tracking-wide">Scheduled</p>
                            <p className="text-gray-900 font-semibold text-sm">{formatDate(booking.date)}</p>
                            <p className="text-purple-600 text-xs font-medium">{formatTime(booking.date)}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Location - Compact */}
                    <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mt-1">
                        <MapPinIcon className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        {editingBooking === booking._id ? (
                          <div className="space-y-1">
                            <label className="block text-xs font-medium text-orange-700">Service Location</label>
                            <textarea
                              value={editFormData.location || ''}
                              onChange={(e) => handleInputChange('location', e.target.value)}
                              className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none text-sm"
                              rows={2}
                              placeholder="Enter complete service address"
                            />
                          </div>
                        ) : (
                          <div>
                            <p className="text-xs text-orange-600 font-medium uppercase tracking-wide">Location</p>
                            <p className="text-gray-900 font-medium text-sm leading-relaxed">
                              {booking.location}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Staff Assignment - Enhanced */}
                    {booking.staff && booking.staff.length > 0 && (
                      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-4 mt-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <TruckIcon className="h-4 w-4 text-green-600" />
                          </div>
                          <p className="text-sm font-semibold text-green-800">
                            Assigned Team
                          </p>
                        </div>
                        <p className="text-sm text-green-700 ml-10">
                          {booking.staff.length} professional staff member(s) assigned to your service
                        </p>
                      </div>
                    )}

                    {/* Pricing Information - Compact */}
                    {(booking.price > 0 || booking.advance > 0 || booking.balance > 0) && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <CreditCardIcon className="h-3 w-3 text-white" />
                          </div>
                          <p className="text-xs font-semibold text-blue-800">Pricing Details</p>
                        </div>
                        <div className="space-y-2 ml-8">
                          {booking.price > 0 && (
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-700 font-medium">Total Price:</span>
                              {editingBooking === booking._id ? (
                                <div className="flex items-center space-x-1">
                                  <span className="text-xs text-gray-600">Rs.</span>
                                  <input
                                    type="number"
                                    value={editFormData.price || 0}
                                    onChange={(e) => handleInputChange('price', parseInt(e.target.value) || 0)}
                                    className="w-16 px-2 py-1 border border-gray-300 rounded text-right text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="0"
                                  />
                                </div>
                              ) : (
                                <span className="font-bold text-gray-900 text-sm">Rs. {booking.price.toLocaleString()}</span>
                              )}
                            </div>
                          )}
                          {booking.advance > 0 && (
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-700 font-medium">Advance Paid:</span>
                              {editingBooking === booking._id ? (
                                <div className="flex items-center space-x-1">
                                  <span className="text-xs text-gray-600">Rs.</span>
                                  <input
                                    type="number"
                                    value={editFormData.advance || 0}
                                    onChange={(e) => handleInputChange('advance', parseInt(e.target.value) || 0)}
                                    className="w-16 px-2 py-1 border border-gray-300 rounded text-right text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="0"
                                  />
                                </div>
                              ) : (
                                <span className="font-bold text-green-600 text-sm">Rs. {booking.advance.toLocaleString()}</span>
                              )}
                            </div>
                          )}
                          {booking.balance > 0 && (
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-700 font-medium">Balance Due:</span>
                              {editingBooking === booking._id ? (
                                <div className="flex items-center space-x-1">
                                  <span className="text-xs text-gray-600">Rs.</span>
                                  <input
                                    type="number"
                                    value={editFormData.balance || 0}
                                    onChange={(e) => handleInputChange('balance', parseInt(e.target.value) || 0)}
                                    className="w-16 px-2 py-1 border border-gray-300 rounded text-right text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="0"
                                  />
                                </div>
                              ) : (
                                <span className="font-bold text-red-600 text-sm">Rs. {booking.balance.toLocaleString()}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons for Pending Bookings - Enhanced */}
                    {booking.status === 'Pending' && (
                      <div className="mt-6 space-y-4">
                        {editingBooking === booking._id ? (
                          // Save/Cancel buttons when editing - Enhanced
                          <div className="flex space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleSaveEdit(booking._id)}
                              disabled={updateLoading}
                              className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-all duration-200 shadow-md ${
                                updateLoading
                                  ? 'bg-gray-400 cursor-not-allowed'
                                  : 'bg-green-500 hover:bg-green-600 text-white hover:shadow-lg'
                              }`}
                            >
                              {updateLoading ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                  Saving...
                                </>
                              ) : (
                                <>
                                  <SaveIcon className="h-4 w-4 mr-2" />
                                  Save
                                </>
                              )}
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={handleCancelEdit}
                              className="flex-1 flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-all duration-200 bg-gray-500 hover:bg-gray-600 text-white shadow-md hover:shadow-lg"
                            >
                              <XCircleIcon className="h-4 w-4 mr-2" />
                              Cancel
                            </motion.button>
                          </div>
                        ) : (
                          // Edit/Delete buttons when not editing - Enhanced
                          <div className="flex space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleEditBooking(booking)}
                              className="flex-1 flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-all duration-200 bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg"
                            >
                              <EditIcon className="h-4 w-4 mr-2" />
                              Edit
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleDeleteBooking(booking._id)}
                              className="flex-1 flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-all duration-200 bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg"
                            >
                              <XCircleIcon className="h-4 w-4 mr-2" />
                              Delete
                            </motion.button>
                          </div>
                        )}
                        {!editingBooking && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3">
                            <p className="text-xs text-yellow-800 text-center font-medium">
                              💡 You can edit or delete this booking while it's pending confirmation
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Payment Action for Confirmed Bookings - Enhanced */}
                    {booking.status === 'Confirmed' && booking.price > 0 && (
                      <div className="mt-6">
                        <motion.button
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handlePayAdvance(booking._id)}
                          disabled={paymentLoading === booking._id}
                          className={`w-full flex items-center justify-center px-6 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg ${
                            paymentLoading === booking._id
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-green-200'
                          }`}
                        >
                          {paymentLoading === booking._id ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                              Processing Payment...
                            </>
                          ) : (
                            <>
                              <CreditCardIcon className="h-5 w-5 mr-3" />
                              Pay Advance (Rs. {(booking.advance > 0 ? booking.advance : (booking.price * 0.3)).toLocaleString()})
                            </>
                          )}
                        </motion.button>
                      </div>
                    )}

                    {/* Payment Status for In Progress Services - Enhanced */}
                    {booking.status === 'In Progress' && (
                      <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircleIcon className="h-6 w-6 text-green-600" />
                          </div>
                          <div>
                            <span className="text-green-800 font-bold text-lg">Advance Payment Completed</span>
                            <p className="text-green-700 text-sm mt-1">
                              ✅ Service confirmed and scheduled. Our professional team will contact you soon.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Balance Payment for Completed Services - Enhanced */}
                    {booking.status === 'Completed' && booking.balance > 0 && (
                      <div className="mt-6">
                        <motion.button
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handlePayBalance(booking._id)}
                          disabled={paymentLoading === booking._id}
                          className={`w-full flex items-center justify-center px-6 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg ${
                            paymentLoading === booking._id
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-blue-200'
                          }`}
                        >
                          {paymentLoading === booking._id ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                              Processing Payment...
                            </>
                          ) : (
                            <>
                              <CreditCardIcon className="h-5 w-5 mr-3" />
                              Pay Remaining Balance (Rs. {booking.balance.toLocaleString()})
                            </>
                          )}
                        </motion.button>
                      </div>
                    )}

                    {/* Payment Completed Status for Fully Paid Services - Enhanced */}
                    {booking.status === 'Completed' && booking.balance === 0 && (
                      <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <CheckCircleIcon className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <span className="text-blue-800 font-bold text-lg">Payment Completed</span>
                            <p className="text-blue-700 text-sm mt-1">
                              🎉 Service completed and fully paid. Thank you for choosing EcoClean!
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Booking Date - Enhanced */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500 font-medium">
                        Booking ID: #{booking._id.slice(-8)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Created {formatDate(booking.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Summary Stats */}
      {!loading && !error && bookings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Booking Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'].map((status) => {
              const count = bookings.filter(b => b.status === status).length;
              const statusDisplay = getStatusDisplay(status);
              
              return (
                <div key={status} className="text-center">
                  <div className={`${statusDisplay.color} border rounded-lg px-3 py-2`}>
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-sm font-medium">{status}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ServiceBookingDashboard;
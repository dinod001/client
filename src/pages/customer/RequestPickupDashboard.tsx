
import { useState, useEffect, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@clerk/clerk-react';
import {
  ClockIcon,
  CheckCircleIcon,
  TruckIcon,
  XCircleIcon,
  AlertCircleIcon,
  PackageIcon,
  UserIcon,
  PhoneIcon,
  CalendarIcon,
  MapPinIcon,
  ImageIcon,
  EyeIcon,
  EditIcon,
  SaveIcon,
} from 'lucide-react';

// Define PickupRequest type based on schema
interface PickupRequest {
  _id: string;
  userId: string;
  userName: string;
  contact: string;
  address: string;
  scheduleDate: string;
  scheduleTime: string;
  itemDescription: string;
  imageUrl?: string;
  status: 'Pending' | 'Completed' | 'Canceled' | 'In Progress' | 'Confirmed';
  createdAt: string;
  updatedAt: string;
  priority?: string;
  advance?: number;
  balance?: number;
  price?: number;
  bookingId?: string;
}

interface AlertMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}

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

// Confirmation Modal Component
const ConfirmationModal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger',
}: ConfirmationModalProps) => {
  if (!isOpen) return null;

  const typeStyles = {
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-yellow-600 hover:bg-yellow-700',
    info: 'bg-blue-600 hover:bg-blue-700',
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
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start space-x-4">
          <div
            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
              type === 'danger' ? 'bg-red-100' : type === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
            }`}
          >
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
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const iconStyles = {
    success: <CheckCircleIcon className="h-5 w-5 text-green-600" />,
    error: <XCircleIcon className="h-5 w-5 text-red-600" />,
    warning: <AlertCircleIcon className="h-5 w-5 text-yellow-600" />,
    info: <AlertCircleIcon className="h-5 w-5 text-blue-600" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      className={`border rounded-lg p-4 shadow-lg ${typeStyles[alert.type]} max-w-md`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">{iconStyles[alert.type]}</div>
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

const RequestPickupDashboard = () => {
  const { getToken } = useAuth();
  const [pickupRequests, setPickupRequests] = useState<PickupRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<PickupRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<AlertMessage[]>([]);
  const [paymentLoading, setPaymentLoading] = useState<string | null>(null);
  const [editingRequest, setEditingRequest] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<PickupRequest>>({});
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Status display helper
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'Pending':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: ClockIcon,
          bgColor: 'bg-yellow-500',
        };
      case 'Confirmed':
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: CheckCircleIcon,
          bgColor: 'bg-blue-500',
        };
      case 'In Progress':
        return {
          color: 'bg-purple-100 text-purple-800 border-purple-200',
          icon: TruckIcon,
          bgColor: 'bg-purple-500',
        };
      case 'Completed':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: CheckCircleIcon,
          bgColor: 'bg-green-500',
        };
      case 'Canceled':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: XCircleIcon,
          bgColor: 'bg-red-500',
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: AlertCircleIcon,
          bgColor: 'bg-gray-500',
        };
    }
  };

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { staggerChildren: 0.08 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Format date and time for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Fetch pickup requests
  useEffect(() => {
    const fetchPickupRequests = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = await getToken();
        console.log('🔄 Fetching pickup requests with token:', token ? 'Token available' : 'No token');

        const response = await fetch('http://localhost:5000/api/user/get-all-pickup-request', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('📡 API Response Status:', response.status);
        const result = await response.json();
        console.log('📋 Raw API Response Data:', result);

        if (response.ok && result.success) {
          const mappedRequests = (result.allPickups || []).map((pickup: any) => ({
            _id: pickup._id,
            userId: pickup.userId,
            userName: pickup.userName,
            contact: pickup.contact,
            address: pickup.location,
            scheduleDate: pickup.date,
            scheduleTime: pickup.date,
            itemDescription: pickup.itemDescription || '',
            imageUrl: pickup.imageUrl,
            status: pickup.status,
            createdAt: pickup.createdAt,
            updatedAt: pickup.updatedAt,
            priority: pickup.priority,
            advance: pickup.advance,
            balance: pickup.balance,
            price: pickup.price,
            bookingId: pickup._id, // Assuming _id is used as bookingId for payments
          }));
          const sortedRequests = mappedRequests.sort((a: PickupRequest, b: PickupRequest) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });
          setPickupRequests(sortedRequests);
          setFilteredRequests(sortedRequests);
          showAlert('success', 'Data Loaded', `Found ${sortedRequests.length} pickup requests`);
        } else {
          setError(result.message || 'Failed to fetch pickup requests');
          showAlert('error', 'Fetch Failed', result.message || 'Could not fetch pickup requests.');
        }
      } catch (err) {
        setError('Network Error');
        showAlert('error', 'Network Error', 'Could not fetch pickup requests.');
      } finally {
        setLoading(false);
      }
    };

    fetchPickupRequests();
  }, [getToken]);

  // Auto-remove alerts after 5 seconds
  useEffect(() => {
    if (alerts.length > 0) {
      const timer = setTimeout(() => {
        setAlerts((prev) => prev.slice(1));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alerts]);

  // Helper function to show alerts
  const showAlert = (type: AlertMessage['type'], title: string, message: string) => {
    const id = Date.now().toString();
    setAlerts((prev) => [...prev, { id, type, title, message }]);
  };

  // Helper function to close alert
  const closeAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  // Helper function to show confirmation modal
  const showConfirmation = (title: string, message: string, onConfirm: () => void) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirm,
    });
  };

  // Helper function to close confirmation modal
  const closeConfirmation = () => {
    setConfirmModal({
      isOpen: false,
      title: '',
      message: '',
      onConfirm: () => {},
    });
  };

  // Handle image selection
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle edit pickup request
  const handleEdit = (request: PickupRequest) => {
    setEditingRequest(request._id);
    setEditFormData({
      userName: request.userName,
      contact: request.contact,
      address: request.address,
      scheduleDate: request.scheduleDate,
      scheduleTime: request.scheduleTime,
      itemDescription: request.itemDescription,
      imageUrl: request.imageUrl,
    });
    setImagePreview(request.imageUrl || null);
    setSelectedImage(null);
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingRequest(null);
    setEditFormData({});
    setSelectedImage(null);
    setImagePreview(null);
  };

  // Handle save edit
  const handleSaveEdit = async (requestId: string) => {
    setUpdateLoading(true);
    try {
      const token = await getToken();
      const requestToUpdate = pickupRequests.find((r) => r._id === requestId);

      if (!requestToUpdate) {
        showAlert('error', 'Update Failed', 'Pickup request not found');
        return;
      }

      const formData = new FormData();
      const requestPickupData = {
        userName: editFormData.userName,
        contact: editFormData.contact,
        location: editFormData.address,
        date: editFormData.scheduleDate,
        itemDescription: editFormData.itemDescription,
      };
      formData.append('requestPickupData', JSON.stringify(requestPickupData));
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      const response = await fetch(`http://localhost:5000/api/user/update-pickup-request/${requestId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setPickupRequests((prev) =>
          prev.map((request) =>
            request._id === requestId
              ? {
                  ...request,
                  userName: editFormData.userName || request.userName,
                  contact: editFormData.contact || request.contact,
                  address: editFormData.address || request.address,
                  scheduleDate: editFormData.scheduleDate || request.scheduleDate,
                  scheduleTime: editFormData.scheduleTime || request.scheduleTime,
                  itemDescription: editFormData.itemDescription || request.itemDescription,
                  imageUrl: result.data.imageUrl || request.imageUrl,
                }
              : request
          )
        );
        setFilteredRequests((prev) =>
          prev.map((request) =>
            request._id === requestId
              ? {
                  ...request,
                  userName: editFormData.userName || request.userName,
                  contact: editFormData.contact || request.contact,
                  address: editFormData.address || request.address,
                  scheduleDate: editFormData.scheduleDate || request.scheduleDate,
                  scheduleTime: editFormData.scheduleTime || request.scheduleTime,
                  itemDescription: editFormData.itemDescription || request.itemDescription,
                  imageUrl: result.data.imageUrl || request.imageUrl,
                }
              : request
          )
        );
        setEditingRequest(null);
        setEditFormData({});
        setSelectedImage(null);
        setImagePreview(null);
        showAlert('success', 'Request Updated', 'Your pickup request has been successfully updated.');
        console.log('✅ Pickup request updated successfully');
      } else {
        showAlert('error', 'Update Failed', result.message || 'Failed to update pickup request');
        console.log('❌ Update pickup request failed:', result.message);
      }
    } catch (err) {
      showAlert('error', 'Update Error', 'Error updating pickup request. Please try again.');
      console.error('Error updating pickup request:', err);
    } finally {
      setUpdateLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (field: keyof PickupRequest, value: string) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle delete pickup request
  const handleDelete = async (requestId: string) => {
    const confirmDelete = () => {
      performDelete(requestId);
      closeConfirmation();
    };

    showConfirmation(
      'Delete Pickup Request',
      'Are you sure you want to delete this pickup request? This action cannot be undone.',
      confirmDelete
    );
  };

  const performDelete = async (requestId: string) => {
    try {
      const token = await getToken();
      const response = await fetch(`http://localhost:5000/api/user/delete-pickup-request/${requestId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json();
      if (response.ok && result.success) {
        showAlert('success', 'Deleted', 'Pickup request deleted successfully.');
        setPickupRequests((prev) => prev.filter((r) => r._id !== requestId));
        setFilteredRequests((prev) => prev.filter((r) => r._id !== requestId));
      } else {
        showAlert('error', 'Delete Failed', result.message || 'Could not delete request.');
      }
    } catch (err) {
      showAlert('error', 'Network Error', 'Could not delete request.');
    }
  };

  // Pay Advance logic
  const handlePayAdvance = async (request: PickupRequest) => {
    if (!request.bookingId) {
      showAlert('error', 'Payment Error', 'No booking ID found for this pickup request.');
      return;
    }
    setPaymentLoading(request._id);
    console.log('🔄 Advance Payment Request Started for request:', request._id);

    try {
      const token = await getToken();
      const response = await fetch('http://localhost:5000/api/user/purchase', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Origin: 'http://localhost:5000',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestId: request.bookingId }),
      });
      const result = await response.json();

      console.log('💰 Advance Payment API Response:', {
        status: response.status,
        ok: response.ok,
        result,
      });

      if (response.ok && result.success) {
        console.log('✅ Advance payment successful! Redirecting to Stripe checkout...');
        if (result.session_url) {
          console.log('🔗 Redirecting to Stripe:', result.session_url);
          window.location.href = result.session_url;
        } else {
          console.log('📝 No session URL, refreshing requests...');
          const fetchPickupRequests = async () => {
            const token = await getToken();
            const response = await fetch('http://localhost:5000/api/user/get-all-pickup-request', {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });
            const result = await response.json();
            if (response.ok && result.success) {
              const mappedRequests = (result.allPickups || []).map((pickup: any) => ({
                _id: pickup._id,
                userId: pickup.userId,
                userName: pickup.userName,
                contact: pickup.contact,
                address: pickup.location,
                scheduleDate: pickup.date,
                scheduleTime: pickup.date,
                itemDescription: pickup.itemDescription || '',
                imageUrl: pickup.imageUrl,
                status: pickup.status,
                createdAt: pickup.createdAt,
                updatedAt: pickup.updatedAt,
                priority: pickup.priority,
                advance: pickup.advance,
                balance: pickup.balance,
                price: pickup.price,
                bookingId: pickup._id,
              }));
              const sortedRequests = mappedRequests.sort((a: PickupRequest, b: PickupRequest) => {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
              });
              setPickupRequests(sortedRequests);
              setFilteredRequests(sortedRequests);
            }
          };
          await fetchPickupRequests();
          showAlert('success', 'Advance Paid', 'Advance payment successful.');
        }
      } else {
        console.log('❌ Advance payment failed:', result.message);
        showAlert('error', 'Payment Failed', result.message || 'Could not pay advance.');
      }
    } catch (err) {
      console.log('🚨 Advance payment error:', err);
      showAlert('error', 'Network Error', 'Could not pay advance.');
    } finally {
      setPaymentLoading(null);
    }
  };

  // Pay Balance logic
  const handlePayBalance = async (request: PickupRequest) => {
    if (!request.bookingId) {
      showAlert('error', 'Payment Error', 'No booking ID found for this pickup request.');
      return;
    }
    setPaymentLoading(request._id);
    console.log('🔄 Balance Payment Request Started for request:', request._id);

    try {
      const token = await getToken();
      const response = await fetch('http://localhost:5000/api/user/purchase', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Origin: 'http://localhost:5000',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestId: request.bookingId }),
      });
      const result = await response.json();

      console.log('💳 Balance Payment API Response:', {
        status: response.status,
        ok: response.ok,
        result,
      });

      if (response.ok && result.success) {
        console.log('✅ Balance payment successful! Redirecting to Stripe checkout...');
        if (result.session_url) {
          console.log('🔗 Redirecting to Stripe:', result.session_url);
          window.location.href = result.session_url;
        } else {
          console.log('📝 No session URL, refreshing requests...');
          const fetchPickupRequests = async () => {
            const token = await getToken();
            const response = await fetch('http://localhost:5000/api/user/get-all-pickup-request', {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });
            const result = await response.json();
            if (response.ok && result.success) {
              const mappedRequests = (result.allPickups || []).map((pickup: any) => ({
                _id: pickup._id,
                userId: pickup.userId,
                userName: pickup.userName,
                contact: pickup.contact,
                address: pickup.location,
                scheduleDate: pickup.date,
                scheduleTime: pickup.date,
                itemDescription: pickup.itemDescription || '',
                imageUrl: pickup.imageUrl,
                status: pickup.status,
                createdAt: pickup.createdAt,
                updatedAt: pickup.updatedAt,
                priority: pickup.priority,
                advance: pickup.advance,
                balance: pickup.balance,
                price: pickup.price,
                bookingId: pickup._id,
              }));
              const sortedRequests = mappedRequests.sort((a: PickupRequest, b: PickupRequest) => {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
              });
              setPickupRequests(sortedRequests);
              setFilteredRequests(sortedRequests);
            }
          };
          await fetchPickupRequests();
          showAlert('success', 'Balance Paid', 'Balance payment successful.');
        }
      } else {
        console.log('❌ Balance payment failed:', result.message);
        showAlert('error', 'Payment Failed', result.message || 'Could not pay balance.');
      }
    } catch (err) {
      console.log('🚨 Balance payment error:', err);
      showAlert('error', 'Network Error', 'Could not pay balance.');
    } finally {
      setPaymentLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Alerts */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
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
            <h1 className="text-3xl font-bold text-gray-800">My Pickup Requests</h1>
            <p className="text-gray-600 mt-2">Track and manage all your pickup requests</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const fetchPickupRequests = async () => {
                setLoading(true);
                try {
                  const token = await getToken();
                  const response = await fetch('http://localhost:5000/api/user/get-all-pickup-request', {
                    method: 'GET',
                    headers: {
                      Authorization: `Bearer ${token}`,
                      'Content-Type': 'application/json',
                    },
                  });
                  const result = await response.json();
                  if (response.ok && result.success) {
                    const mappedRequests = (result.allPickups || []).map((pickup: any) => ({
                      _id: pickup._id,
                      userId: pickup.userId,
                      userName: pickup.userName,
                      contact: pickup.contact,
                      address: pickup.location,
                      scheduleDate: pickup.date,
                      scheduleTime: pickup.date,
                      itemDescription: pickup.itemDescription || '',
                      imageUrl: pickup.imageUrl,
                      status: pickup.status,
                      createdAt: pickup.createdAt,
                      updatedAt: pickup.updatedAt,
                      priority: pickup.priority,
                      advance: pickup.advance,
                      balance: pickup.balance,
                      price: pickup.price,
                      bookingId: pickup._id,
                    }));
                    const sortedRequests = mappedRequests.sort((a: PickupRequest, b: PickupRequest) => {
                      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                    });
                    setPickupRequests(sortedRequests);
                    setFilteredRequests(sortedRequests);
                    showAlert('success', 'Data Refreshed', `Pickup requests refreshed successfully.`);
                  }
                } catch (err) {
                  showAlert('error', 'Network Error', 'Could not refresh pickup requests.');
                } finally {
                  setLoading(false);
                }
              };
              fetchPickupRequests();
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.582m0 0a8.001 8.001 0 01-15.356-2m15.356 2H15"
              />
            </svg>
            Refresh
          </motion.button>
        </div>
      </motion.div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="inline-block w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"
          />
          <p className="mt-4 text-gray-600">Loading pickup requests...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8"
        >
          <div className="flex items-center">
            <XCircleIcon className="h-6 w-6 text-red-600 mr-2" />
            <p className="text-red-800">{error}</p>
          </div>
          <button
            onClick={() => {
              const fetchPickupRequests = async () => {
                setLoading(true);
                try {
                  const token = await getToken();
                  const response = await fetch('http://localhost:5000/api/user/get-all-pickup-request', {
                    method: 'GET',
                    headers: {
                      Authorization: `Bearer ${token}`,
                      'Content-Type': 'application/json',
                    },
                  });
                  const result = await response.json();
                  if (response.ok && result.success) {
                    const mappedRequests = (result.allPickups || []).map((pickup: any) => ({
                      _id: pickup._id,
                      userId: pickup.userId,
                      userName: pickup.userName,
                      contact: pickup.contact,
                      address: pickup.location,
                      scheduleDate: pickup.date,
                      scheduleTime: pickup.date,
                      itemDescription: pickup.itemDescription || '',
                      imageUrl: pickup.imageUrl,
                      status: pickup.status,
                      createdAt: pickup.createdAt,
                      updatedAt: pickup.updatedAt,
                      priority: pickup.priority,
                      advance: pickup.advance,
                      balance: pickup.balance,
                      price: pickup.price,
                      bookingId: pickup._id,
                    }));
                    const sortedRequests = mappedRequests.sort((a: PickupRequest, b: PickupRequest) => {
                      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                    });
                    setPickupRequests(sortedRequests);
                    setFilteredRequests(sortedRequests);
                    setError(null);
                    showAlert('success', 'Data Loaded', `Found ${sortedRequests.length} pickup requests`);
                  } else {
                    setError(result.message || 'Failed to fetch pickup requests');
                    showAlert('error', 'Fetch Failed', result.message || 'Could not fetch pickup requests.');
                  }
                } catch (err) {
                  setError('Network Error');
                  showAlert('error', 'Network Error', 'Could not fetch pickup requests.');
                } finally {
                  setLoading(false);
                }
              };
              fetchPickupRequests();
            }}
            className="mt-3 text-red-600 hover:text-red-700 underline"
          >
            Try again
          </button>
        </motion.div>
      )}

      {/* No Requests State */}
      {!loading && !error && filteredRequests.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20"
        >
          <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <PackageIcon className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {pickupRequests.length === 0 ? 'No Pickup Requests Yet' : 'No Matching Requests'}
          </h3>
          <p className="text-gray-500 mb-4">
            {pickupRequests.length === 0
              ? "You haven't made any pickup requests yet."
              : 'Try adjusting your search or filter criteria.'}
          </p>
          {pickupRequests.length === 0 && (
            <motion.a
              href="/services"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Request Pickup
            </motion.a>
          )}
        </motion.div>
      )}

      {/* Pickup Requests List */}
      {!loading && !error && filteredRequests.length > 0 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {filteredRequests.map((request) => {
            const statusDisplay = getStatusDisplay(request.status);
            const StatusIcon = statusDisplay.icon;

            return (
              <motion.div
                key={request._id}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                {/* Status Header */}
                <div className={`${statusDisplay.bgColor} px-6 py-4 relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                  <div className="relative flex items-center justify-between text-white">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                        <StatusIcon className="h-5 w-5" />
                      </div>
                      <span className="font-bold text-lg">{request.status}</span>
                    </div>
                    <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                      <span className="text-sm font-medium">#{request._id.slice(-8)}</span>
                    </div>
                  </div>
                </div>

                {/* Request Details */}
                <div className="p-6">
                  {/* Customer Info */}
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg mb-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <UserIcon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      {editingRequest === request._id ? (
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
                          <p className="text-gray-900 font-semibold text-sm">{request.userName}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg mb-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <PhoneIcon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      {editingRequest === request._id ? (
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
                          <p className="text-gray-900 font-semibold text-sm">{request.contact}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Schedule */}
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg border border-purple-200 mb-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <CalendarIcon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      {editingRequest === request._id ? (
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-purple-700">📅 Pickup Date & Time</label>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="date"
                              value={
                                editFormData.scheduleDate
                                  ? (() => {
                                      const date = new Date(editFormData.scheduleDate);
                                      const offset = date.getTimezoneOffset();
                                      const adjustedDate = new Date(date.getTime() - offset * 60 * 1000);
                                      return adjustedDate.toISOString().slice(0, 10);
                                    })()
                                  : ''
                              }
                              onChange={(e) => {
                                const currentDate = editFormData.scheduleDate
                                  ? new Date(editFormData.scheduleDate)
                                  : new Date();
                                const newDate = new Date(e.target.value);
                                newDate.setHours(currentDate.getHours(), currentDate.getMinutes());
                                handleInputChange('scheduleDate', newDate.toISOString());
                                handleInputChange('scheduleTime', newDate.toISOString());
                              }}
                              className="px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white text-sm"
                              min={new Date().toISOString().slice(0, 10)}
                            />
                            <input
                              type="time"
                              value={
                                editFormData.scheduleTime
                                  ? (() => {
                                      const date = new Date(editFormData.scheduleTime);
                                      const offset = date.getTimezoneOffset();
                                      const adjustedDate = new Date(date.getTime() - offset * 60 * 1000);
                                      return adjustedDate.toISOString().slice(11, 16);
                                    })()
                                  : ''
                              }
                              onChange={(e) => {
                                const currentDate = editFormData.scheduleTime
                                  ? new Date(editFormData.scheduleTime)
                                  : new Date();
                                const [hours, minutes] = e.target.value.split(':');
                                currentDate.setHours(parseInt(hours), parseInt(minutes));
                                handleInputChange('scheduleTime', currentDate.toISOString());
                                handleInputChange('scheduleDate', currentDate.toISOString());
                              }}
                              className="px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white text-sm"
                            />
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className="text-xs text-purple-600 font-medium uppercase tracking-wide">Scheduled</p>
                          <p className="text-gray-900 font-semibold text-sm">{formatDate(request.scheduleDate)}</p>
                          <p className="text-purple-600 text-xs font-medium">{formatTime(request.scheduleTime)}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg mb-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mt-1">
                      <MapPinIcon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      {editingRequest === request._id ? (
                        <div className="space-y-1">
                          <label className="block text-xs font-medium text-orange-700">Pickup Address</label>
                          <textarea
                            value={editFormData.address || ''}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none text-sm"
                            rows={2}
                            placeholder="Enter complete pickup address"
                          />
                        </div>
                      ) : (
                        <div>
                          <p className="text-xs text-orange-600 font-medium uppercase tracking-wide">Address</p>
                          <p className="text-gray-900 font-medium text-sm leading-relaxed">{request.address}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Item Description */}
                  <div className="mb-4">
                    {editingRequest === request._id ? (
                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-teal-700">Item Description</label>
                        <textarea
                          value={editFormData.itemDescription || ''}
                          onChange={(e) => handleInputChange('itemDescription', e.target.value)}
                          className="w-full px-3 py-2 border border-teal-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all resize-none text-sm"
                          rows={2}
                          placeholder="Describe the items for pickup"
                        />
                      </div>
                    ) : (
                      request.itemDescription && (
                        <div>
                          <p className="text-gray-900 font-medium text-sm leading-relaxed">
                            {request.itemDescription}
                          </p>
                        </div>
                      )
                    )}
                  </div>

                  {/* Image Upload/Preview */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <ImageIcon className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Item Image</span>
                    </div>
                    {editingRequest === request._id ? (
                      <div className="space-y-2">
                        <div className="flex flex-col items-center justify-center">
                          <label
                            htmlFor="image-upload"
                            className="w-full flex flex-col items-center justify-center border-2 border-dashed border-blue-300 rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition-all py-6 px-4 text-center"
                            style={{ minHeight: '120px' }}
                          >
                            {imagePreview ? (
                              <img
                                src={imagePreview}
                                alt="Item preview"
                                className="w-32 h-32 object-cover rounded-lg border border-gray-200 mx-auto mb-2 shadow-md"
                              />
                            ) : (
                              <>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-10 w-10 text-blue-400 mx-auto mb-2"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M4 12l4-4a2 2 0 012.828 0l2.344 2.344a2 2 0 002.828 0L20 8m-4 4v4" />
                                </svg>
                                <span className="text-blue-700 font-medium">Drag & drop or click to upload image</span>
                                <span className="text-xs text-gray-500 mt-1">(JPG, PNG, max 2MB)</span>
                              </>
                            )}
                            <input
                              id="image-upload"
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="hidden"
                            />
                          </label>
                          {imagePreview && (
                            <button
                              type="button"
                              onClick={() => { setImagePreview(null); setSelectedImage(null); }}
                              className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-medium hover:bg-red-200 transition-all"
                            >
                              Remove Image
                            </button>
                          )}
                        </div>
                      </div>
                    ) : request.imageUrl ? (
                      <div className="relative group">
                        <img
                          src={request.imageUrl}
                          alt="Pickup item"
                          className="w-full h-32 object-cover rounded-lg border border-gray-200"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 rounded-lg flex items-center justify-center">
                          <EyeIcon className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No image provided</p>
                    )}
                  </div>

                  {/* Pricing Information */}
                  {(request.price ?? 0) > 0 || (request.advance ?? 0) > 0 || (request.balance ?? 0) > 0 ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 9V7a5 5 0 00-10 0v2M5 13h14l-1.5 7h-11L5 13z"
                            />
                          </svg>
                        </div>
                        <p className="text-xs font-semibold text-blue-800">Pricing Details</p>
                      </div>
                      <div className="space-y-2 ml-8">
                        {(request.price ?? 0) > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-700 font-medium">Total Price:</span>
                            <span className="font-bold text-gray-900 text-sm">
                              Rs. {(request.price ?? 0).toLocaleString()}
                            </span>
                          </div>
                        )}
                        {(request.advance ?? 0) > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-700 font-medium">Advance Paid:</span>
                            <span className="font-bold text-green-600 text-sm">
                              Rs. {(request.advance ?? 0).toLocaleString()}
                            </span>
                          </div>
                        )}
                        {(request.balance ?? 0) > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-700 font-medium">Balance Due:</span>
                            <span className="font-bold text-red-600 text-sm">
                              Rs. {(request.balance ?? 0).toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : null}

                  {/* Action Buttons for Pending Requests */}
                  {request.status === 'Pending' && (
                    <div className="mt-6 space-y-4">
                      {editingRequest === request._id ? (
                        <div className="flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSaveEdit(request._id)}
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
                        <div className="flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleEdit(request)}
                            className="flex-1 flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-all duration-200 bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg"
                          >
                            <EditIcon className="h-4 w-4 mr-2" />
                            Edit
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleDelete(request._id)}
                            className="flex-1 flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-all duration-200 bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg"
                          >
                            <XCircleIcon className="h-4 w-4 mr-2" />
                            Delete
                          </motion.button>
                        </div>
                      )}
                      {!editingRequest && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3">
                          <p className="text-xs text-yellow-800 text-center font-medium">
                            💡 You can edit or delete this request while it's pending confirmation
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Payment Action for Confirmed Requests */}
                  {request.status === 'Confirmed' && (request.price ?? 0) > 0 && (
                    <div className="mt-6">
                      <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handlePayAdvance(request)}
                        disabled={paymentLoading === request._id}
                        className={`w-full flex items-center justify-center px-6 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg ${
                          paymentLoading === request._id
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-green-200'
                        }`}
                      >
                        {paymentLoading === request._id ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                            Processing Payment...
                          </>
                        ) : (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 mr-3"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 9V7a5 5 0 00-10 0v2M5 13h14l-1.5 7h-11L5 13z"
                              />
                            </svg>
                            Pay Advance (Rs. {(request.advance ?? Math.round((request.price ?? 0) * 0.3)).toLocaleString()})
                          </>
                        )}
                      </motion.button>
                    </div>
                  )}

                  {/* Payment Status for In Progress Requests */}
                  {request.status === 'In Progress' && (
                    <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircleIcon className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <span className="text-green-800 font-bold text-lg">Advance Payment Completed</span>
                          <p className="text-green-700 text-sm mt-1">
                            ✅ Pickup confirmed and scheduled. Our team will contact you soon.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Balance Payment for Completed Requests */}
                  {request.status === 'Completed' && (request.balance ?? 0) > 0 && (
                    <div className="mt-6">
                      <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handlePayBalance(request)}
                        disabled={paymentLoading === request._id}
                        className={`w-full flex items-center justify-center px-6 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg ${
                          paymentLoading === request._id
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-blue-200'
                        }`}
                      >
                        {paymentLoading === request._id ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                            Processing Payment...
                          </>
                        ) : (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 mr-3"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 9V7a5 5 0 00-10 0v2M5 13h14l-1.5 7h-11L5 13z"
                              />
                            </svg>
                            Pay Remaining Balance (Rs. {(request.balance ?? 0).toLocaleString()})
                          </>
                        )}
                      </motion.button>
                    </div>
                  )}

                  {/* Payment Completed Status for Fully Paid Requests */}
                  {request.status === 'Completed' && (request.balance ?? 0) === 0 && (
                    <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <CheckCircleIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <span className="text-blue-800 font-bold text-lg">Payment Completed</span>
                          <p className="text-blue-700 text-sm mt-1">
                            🎉 Pickup completed and fully paid. Thank you for your request!
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Request Date */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500 font-medium">Request ID: #{request._id.slice(-8)}</p>
                      <p className="text-xs text-gray-500">Created {formatDate(request.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Summary Stats */}
      {!loading && !error && pickupRequests.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Request Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {['Pending', 'Confirmed', 'In Progress', 'Completed', 'Canceled'].map((status) => {
              const count = pickupRequests.filter((r) => r.status === status).length;
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

export default RequestPickupDashboard;

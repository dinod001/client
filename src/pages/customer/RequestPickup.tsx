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
  AlertCircleIcon,
  ImageIcon,
  TruckIcon,
  SendIcon,
  UploadIcon,
  RefreshCwIcon,
  ClockIcon,
  PackageIcon,
  FilterIcon,
  SearchIcon,
  EyeIcon,
  SaveIcon,
  CreditCardIcon,
  PlusIcon
} from 'lucide-react';

// Define pickup request interface based on API response
interface PickupRequest {
  _id: string;
  userId: string;
  userName: string;
  contact: string;
  location: string;
  imageUrl: string;
  date: string;
  advance: number;
  price: number;
  balance: number;
  staff: string[];
  status: 'Pending' | 'Confirmed' | 'In Progress' | 'Completed' | 'Canceled';
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

interface RequestPickupProps {
  status?: 'Pending' | 'Confirmed' | 'In Progress' | 'Completed' | 'Canceled';
}

const RequestPickup = ({ status = 'Pending' }: RequestPickupProps) => {
  const [formData, setFormData] = useState({
    userName: '',
    contact: '',
    location: '',
    date: '',
    time: ''
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [alerts, setAlerts] = useState<AlertMessage[]>([]);
  const { getToken } = useAuth();

  // Helper function to show alerts
  const showAlert = (type: AlertMessage['type'], title: string, message: string) => {
    const id = Date.now().toString();
    setAlerts(prev => [...prev, { id, type, title, message }]);
  };

  // Helper function to close alert
  const closeAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  // Auto-remove alerts after 5 seconds
  useEffect(() => {
    if (alerts.length > 0) {
      const timer = setTimeout(() => {
        setAlerts(prev => prev.slice(1));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alerts]);

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle image selection
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showAlert('error', 'File Too Large', 'Please select an image smaller than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        showAlert('error', 'Invalid File Type', 'Please select a valid image file');
        return;
      }

      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove selected image
  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.userName.trim()) {
      showAlert('error', 'Validation Error', 'Please enter your name');
      return;
    }
    
    if (!formData.contact.trim()) {
      showAlert('error', 'Validation Error', 'Please enter your contact number');
      return;
    }
    
    if (!formData.location.trim()) {
      showAlert('error', 'Validation Error', 'Please enter pickup location');
      return;
    }
    
    if (!formData.date || !formData.time) {
      showAlert('error', 'Validation Error', 'Please select pickup date and time');
      return;
    }

    // Check if date is in the future
    const selectedDateTime = new Date(`${formData.date}T${formData.time}`);
    const now = new Date();
    if (selectedDateTime <= now) {
      showAlert('error', 'Invalid Date', 'Please select a future date and time');
      return;
    }

    setLoading(true);

    try {
      const token = await getToken();
      
      // Prepare form data for submission
      const submitFormData = new FormData();
      
      // Create the request object
      const requestPickupData = {
        userName: formData.userName.trim(),
        contact: formData.contact.trim(),
        location: formData.location.trim(),
        date: selectedDateTime.toISOString(),
        staff: []
      };

      submitFormData.append('requestPickupData', JSON.stringify(requestPickupData));
      
      if (selectedImage) {
        submitFormData.append('image', selectedImage);
      }

      const response = await fetch('http://localhost:5000/api/user/add-pickup-request', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: submitFormData
      });

      const result = await response.json();

      if (response.ok && result.success) {
        showAlert('success', 'Request Submitted', 'Your pickup request has been submitted successfully!');
        
        // Reset form
        setFormData({
          userName: '',
          contact: '',
          location: '',
          date: '',
          time: ''
        });
        setSelectedImage(null);
        setImagePreview(null);
        
        console.log('✅ Pickup request submitted successfully');
      } else {
        showAlert('error', 'Submission Failed', result.message || 'Failed to submit pickup request');
        console.log('❌ Pickup request failed:', result.message);
      }
    } catch (err) {
      showAlert('error', 'Network Error', 'Failed to submit request. Please try again.');
      console.error('Error submitting pickup request:', err);
    } finally {
      setLoading(false);
    }
  };

  // Disable editing if status is not 'Pending'
  const isEditable = status === 'Pending';

  return (
    <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 min-h-screen">
      {/* Toast Alerts */}
      <div className="fixed top-4 right-4 z-50 space-y-3">
        <AnimatePresence>
          {alerts.map((alert) => (
            <ToastAlert key={alert.id} alert={alert} onClose={closeAlert} />
          ))}
        </AnimatePresence>
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 rounded-full shadow-lg">
              <TruckIcon className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Request Pickup Service</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Schedule a convenient pickup time for our team to collect your items. 
            Fill in the details below and we'll take care of the rest!
          </p>
        </div>
      </motion.div>

      {/* Show message and hide form if not editable */}
      {!isEditable ? (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-400 to-gray-600 px-8 py-6">
              <h2 className="text-2xl font-bold text-white">Editing Disabled</h2>
              <p className="text-gray-100 mt-1">This pickup request can no longer be edited because its status is <span className="font-bold">{status}</span>.</p>
            </div>
            <div className="p-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-center">
                <AlertCircleIcon className="h-5 w-5 inline-block mr-2 text-red-600" />
                Editing is disabled for requests that are not in <span className="font-bold">Pending</span> status.
              </div>
            </div>
          </div>
        </div>
      ) : (
// ...existing code...
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-6">
              <h2 className="text-2xl font-bold text-white">Pickup Request Form</h2>
              <p className="text-green-100 mt-1">Please provide accurate information for better service</p>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                  Personal Information
                </h3>
                {/* Name Field */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <UserIcon className="h-4 w-4 mr-2 text-green-600" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.userName}
                    onChange={(e) => handleInputChange('userName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                {/* Contact Field */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <PhoneIcon className="h-4 w-4 mr-2 text-green-600" />
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.contact}
                    onChange={(e) => handleInputChange('contact', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    placeholder="+94 XX XXX XXXX"
                    required
                  />
                </div>
              </div>
              {/* Pickup Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                  Pickup Details
                </h3>
                {/* Location Field */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <MapPinIcon className="h-4 w-4 mr-2 text-green-600" />
                    Pickup Location *
                  </label>
                  <textarea
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all resize-none"
                    rows={3}
                    placeholder="Enter complete pickup address with landmarks"
                    required
                  />
                </div>
                {/* Date and Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <CalendarIcon className="h-4 w-4 mr-2 text-green-600" />
                      Pickup Date *
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <CalendarIcon className="h-4 w-4 mr-2 text-green-600" />
                      Pickup Time *
                    </label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) => handleInputChange('time', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      required
                    />
                  </div>
                </div>
              </div>
              {/* Image Upload */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                  Additional Information
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <ImageIcon className="h-4 w-4 mr-2 text-green-600" />
                    Upload Image (Optional)
                  </label>
                  <p className="text-xs text-gray-500">
                    Upload an image to help us understand what needs to be picked up (Max 5MB)
                  </p>
                  {!imagePreview ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer flex flex-col items-center space-y-2"
                      >
                        <UploadIcon className="h-8 w-8 text-gray-400" />
                        <span className="text-sm text-gray-600">Click to upload image</span>
                        <span className="text-xs text-gray-400">PNG, JPG, GIF up to 5MB</span>
                      </label>
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <XCircleIcon className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {/* Information Note */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircleIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800">Important Note</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Our team will contact you to confirm the pickup details and provide pricing information. 
                      Staff assignment and final pricing will be determined by our admin team.
                    </p>
                  </div>
                </div>
              </div>
              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className={`w-full flex items-center justify-center px-6 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white hover:shadow-xl'
                }`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Submitting Request...
                  </>
                ) : (
                  <>
                    <SendIcon className="h-5 w-5 mr-3" />
                    Submit Pickup Request
                  </>
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default RequestPickup;

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useUser, useAuth } from '@clerk/clerk-react';
import { CalendarIcon, MapPinIcon, PhoneIcon, UserIcon, ArrowLeftIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

interface BookingFormData {
  userName: string;
  contact: string;
  location: string;
  date: string;
  time: string;
}

interface Service {
  id: string;
  name: string;
  description: string;
  pricing: string;
  image: string;
}

const BookService = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const service = location.state?.service as Service;

  const [formData, setFormData] = useState<BookingFormData>({
    userName: user?.fullName || '',
    contact: '',
    location: '',
    date: '',
    time: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If no service data is passed, redirect back
  if (!service) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <XCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Service Not Found</h2>
          <p className="text-gray-600 mb-4">Please select a service from the services page.</p>
          <Link 
            to="/services" 
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Go to Services
          </Link>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Combine date and time into ISO string
      const combinedDateTime = new Date(`${formData.date}T${formData.time}:00.000Z`).toISOString();

      // Extract numeric price from service.pricing if possible
      let price = 0;
      if (service.pricing) {
        // Try to extract price from string like 'Rs. 2500' or 'Rs. 2125 (15% off Rs. 2500)'
        const match = service.pricing.match(/Rs\.\s*(\d+)/);
        if (match) price = parseInt(match[1], 10);
      }

      const bookingData = {
        serviceBookData: {
          userId: user?.id || '',
          userName: formData.userName,
          serviceName: service.name,
          contact: formData.contact,
          location: formData.location,
          date: combinedDateTime,
          staff: [], // Empty array - will be assigned by admin
          status: 'Pending', // Default status
          price // Store actual price
        }
      };

      const response = await fetch('http://localhost:5000/api/user/book-service', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getToken()}` // Get Clerk token
        },
        body: JSON.stringify(bookingData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSuccess(true);
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setError(result.message || 'Failed to book service. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      console.error('Booking error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md"
        >
          <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-4">
            Your booking for <strong>{service.name}</strong> has been submitted successfully.
          </p>
          <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link 
            to="/services" 
            className="inline-flex items-center text-green-600 hover:text-green-700 mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Services
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Book Service</h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Service Details */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">Service Details</h2>
            <div className="space-y-4">
              <img 
                src={service.image} 
                alt={service.name}
                className="w-full h-48 object-cover rounded-lg"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{service.name}</h3>
                <p className="text-gray-600 mt-2">{service.description}</p>
                <p className="text-lg font-bold text-green-600 mt-3">{service.pricing}</p>
              </div>
            </div>
          </motion.div>

          {/* Booking Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-6">Booking Information</h2>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <XCircleIcon className="h-5 w-5 text-red-600 mr-2" />
                  <p className="text-red-800">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* User Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <UserIcon className="h-4 w-4 inline mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Contact */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <PhoneIcon className="h-4 w-4 inline mr-2" />
                  Contact Number
                </label>
                <input
                  type="tel"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="+94xxxxxxxxx"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPinIcon className="h-4 w-4 inline mr-2" />
                  Service Location
                </label>
                <textarea
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter complete address including street, city, and postal code"
                />
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <CalendarIcon className="h-4 w-4 inline mr-2" />
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    min={today}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Time
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-colors ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {loading ? 'Booking...' : 'Confirm Booking'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BookService;

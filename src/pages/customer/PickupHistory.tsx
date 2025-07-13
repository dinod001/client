import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, useUser } from '@clerk/clerk-react';
import { 
  TruckIcon, 
  CalendarIcon, 
  FilterIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  XCircleIcon, 
  StarIcon, 
  SearchIcon, 
  MapPinIcon, 
  ChevronRightIcon, 
  XIcon 
} from 'lucide-react';

// Define interfaces for TypeScript
interface Booking {
  _id: string;
  serviceName: string;
  date: string;
  time?: string;
  status: 'Completed' | 'Confirmed' | 'Cancelled' | 'Scheduled';
  location?: string;
  address?: string;
  weight?: string;
  recyclables?: string;
  staff?: string[];
  notes?: string;
  createdAt?: string;
}

interface Pickup {
  _id: string;
  type?: string;
  scheduleDate?: string;
  time?: string;
  createdAt: string;
  status: 'Completed' | 'Confirmed' | 'Cancelled' | 'Scheduled';
  address?: string;
  location?: string;
  pickupAddress?: string;
  deliveryAddress?: string;
  weight?: string;
  recyclables?: string;
  driver?: string;
  notes?: string;
}

interface PickupData {
id: string;
type: string;
date: string;
time: string;
status: 'completed' | 'cancelled' | 'scheduled' | 'confirmed';
address: string;
}

type FilterType = 'all' | 'completed' | 'confirmed' | 'cancelled' | 'scheduled';

const PickupHistory = () => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'completed'>('all');
  const [showDetails, setShowDetails] = useState<PickupData | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [pickupHistory, setPickupHistory] = useState<PickupData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();
  const { isSignedIn } = useUser();

  // Fetch bookings and pickup requests
  useEffect(() => {
    const fetchHistory = async () => {
      if (!isSignedIn) {
        setPickupHistory([]);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const token = await getToken();
        if (!token) throw new Error('No authentication token available');

        // Fetch service bookings
        const bookingsRes = await fetch('http://localhost:5000/api/user/all-bookings', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!bookingsRes.ok) throw new Error('Failed to fetch bookings');
        const bookingsData = await bookingsRes.json();
        const bookings: Booking[] = bookingsData.allBookings || [];

        // Fetch pickup requests
        const pickupsRes = await fetch('http://localhost:5000/api/user/get-all-pickup-request', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!pickupsRes.ok) throw new Error('Failed to fetch pickups');
        const pickupsData = await pickupsRes.json();
        const pickups: Pickup[] = pickupsData.allPickups || [];

        // Normalize and merge
        const formatDate = (dateStr: string) => {
          const d = new Date(dateStr);
          return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        };
        const formatTime = (dateStr: string, timeStr?: string) => {
          if (timeStr && timeStr !== 'N/A') return timeStr;
          const d = new Date(dateStr);
          return isNaN(d.getTime()) ? 'N/A' : d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        };

        const bookingHistory: PickupData[] = bookings.map((b, idx) => ({
          id: b._id || `booking-${idx + 1000}`,
          type: b.serviceName || 'Service Booking',
          date: formatDate(b.date || b.createdAt || ''),
          time: formatTime(b.date || b.createdAt || '', b.time),
          status: b.status.toLowerCase() as PickupData['status'],
          address: b.location || b.address || 'No address provided',
        }));
        const pickupHistoryArr: PickupData[] = pickups.map((p, idx) => ({
          id: p._id || `pickup-${idx + 2000}`,
          type: p.type || 'Pickup Request',
          date: formatDate(p.scheduleDate || p.createdAt || ''),
          time: formatTime(p.scheduleDate || p.createdAt || '', p.time),
          status: p.status.toLowerCase() as PickupData['status'],
          address: p.address || p.location || p.pickupAddress || p.deliveryAddress || 'No address provided',
        }));
        setPickupHistory([...bookingHistory, ...pickupHistoryArr].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        ));
        setError(null);
      } catch (err) {
        console.error('Error fetching history:', err);
        setPickupHistory([]);
        setError('Failed to load pickup history. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [isSignedIn, getToken]);

  const filteredPickups = pickupHistory.filter((pickup) => {
    // Only show completed items
    if (pickup.status !== 'completed') return false;
    // Apply search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      return (
        pickup.type.toLowerCase().includes(query) ||
        pickup.date.toLowerCase().includes(query) ||
        pickup.address.toLowerCase().includes(query)
      );
    }
    // If filter is 'completed', already filtered above
    return true;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'confirmed':
        return <CheckCircleIcon className="h-5 w-5 text-blue-500" />;
      case 'cancelled':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'scheduled':
        return <ClockIcon className="h-5 w-5 text-amber-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'confirmed':
        return 'Confirmed';
      case 'cancelled':
        return 'Cancelled';
      case 'scheduled':
        return 'Scheduled';
      default:
        return 'Unknown';
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'scheduled':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const viewDetails = (pickup: PickupData) => {
    setShowDetails(pickup);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
      >
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6">
          <div className="flex items-center mb-2">
            <div className="bg-white bg-opacity-30 p-3 rounded-xl mr-3 shadow-lg">
              <TruckIcon className="h-7 w-7 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight drop-shadow">Pickup History</h2>
          </div>
          <p className="text-emerald-100 text-lg">View your past waste collection history</p>
        </div>
        <div className="p-6">
          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center shadow"
            >
              <XCircleIcon className="h-5 w-5 text-red-600 mr-2" />
              <p className="text-red-800 font-semibold">{error}</p>
            </motion.div>
          )}
          {/* Loading Indicator */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-emerald-500"></div>
              <span className="ml-3 text-gray-600 text-lg font-medium">Loading history...</span>
            </div>
          )}
          {!loading && (
            <>
              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search pickups..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div className="flex space-x-2">
                  <div className="flex items-center">
                    <FilterIcon className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-500">Filter:</span>
                  </div>
                  {(['all', 'completed'] as const).map((filter) => (
                    <motion.button
                      key={filter}
                      whileHover={{ y: -2 }}
                      whileTap={{ y: 0 }}
                      onClick={() => setSelectedFilter(filter)}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedFilter === filter
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {filter === 'all' ? 'All' : 'Completed'}
                    </motion.button>
                  ))}
                </div>
              </div>
              {/* Pickup List */}
              {filteredPickups.length > 0 ? (
                <div className="space-y-6">
                  <AnimatePresence>
                    {filteredPickups.map((pickup) => (
                      <motion.div
                        key={pickup.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-gradient-to-br from-white via-emerald-50 to-white rounded-2xl p-5 shadow-lg hover:shadow-emerald-200 hover:-translate-y-1 transition-all cursor-pointer border border-gray-100"
                        onClick={() => viewDetails(pickup)}
                      >
                        <div className="flex items-start">
                          <div className="bg-emerald-100 p-3 rounded-xl mr-3 mt-1 shadow">
                            <CalendarIcon className="h-6 w-6 text-emerald-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                              <h4 className="font-semibold text-gray-900 text-lg">{pickup.type}</h4>
                              <div className="flex items-center mt-1 sm:mt-0">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center ${getStatusClass(
                                    pickup.status
                                  )}`}
                                >
                                  {getStatusIcon(pickup.status)}
                                  <span className="ml-1">{getStatusText(pickup.status)}</span>
                                </span>
                              </div>
                            </div>
                            <div className="mt-2 flex flex-col sm:flex-row sm:items-center text-sm text-gray-500">
                              <div className="flex items-center">
                                <CalendarIcon className="h-4 w-4 mr-1" />
                                <span>{pickup.date}</span>
                                <span className="mx-2 hidden sm:inline">•</span>
                              </div>
                              <div className="flex items-center mt-1 sm:mt-0">
                                <ClockIcon className="h-4 w-4 mr-1" />
                                <span>{pickup.time}</span>
                              </div>
                            </div>
                            <div className="mt-1 flex items-center text-sm text-gray-500">
                              <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                              <span className="truncate">{pickup.address}</span>
                            </div>
                          </div>
                          <div className="ml-2">
                            <ChevronRightIcon className="h-6 w-6 text-gray-300" />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="bg-gray-100 p-4 rounded-full inline-flex mb-4">
                    <SearchIcon className="h-8 w-8 text-gray-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No Results Found</h3>
                  <p className="text-gray-600">
                    {searchQuery
                      ? `No pickups match "${searchQuery}"`
                      : "You don't have any pickup history yet."}
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedFilter('all');
                    }}
                    className="mt-4 text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
      {/* Pickup Details Modal */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black bg-opacity-50"
            style={{ backdropFilter: 'blur(5px)' }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 20 }}
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full mx-auto overflow-hidden relative border border-gray-100"
            >
              <button
                onClick={() => setShowDetails(null)}
                className="absolute top-4 right-4 bg-gray-200 p-2 rounded-full hover:bg-gray-300 transition-colors z-10"
                aria-label="Close details"
              >
                <XIcon className="h-5 w-5 text-gray-600" />
              </button>
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6">
                <div className="flex items-center mb-2">
                  <div className="bg-white bg-opacity-30 p-3 rounded-xl mr-3 shadow-lg">
                    <TruckIcon className="h-7 w-7 text-white" />
                  </div>
                  <h2 className="text-2xl font-extrabold text-white tracking-tight drop-shadow">Pickup/Booking Details</h2>
                </div>
                <div className="flex flex-wrap gap-2 items-center mt-2">
                  <span className="px-4 py-2 rounded-full text-sm font-semibold flex items-center bg-white bg-opacity-20 text-white shadow">
                    {getStatusIcon(showDetails.status)}
                    <span className="ml-2">{getStatusText(showDetails.status)}</span>
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Type</div>
                      <div className="font-bold text-gray-900 text-lg">{showDetails.type}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Date</div>
                      <div className="font-bold text-gray-900 text-lg">{showDetails.date}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Time</div>
                      <div className="font-bold text-gray-900 text-lg">{showDetails.time}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Address</div>
                      <div className="font-bold text-gray-900 text-lg">{showDetails.address}</div>
                    </div>
                  </div>
                  <div className="pt-6">
                    <hr className="border-t border-gray-200 mb-6" />
                    <div className="flex justify-end">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowDetails(null)}
                        className="px-7 py-2 bg-emerald-500 text-white rounded-xl font-semibold shadow hover:bg-emerald-600 transition"
                      >
                        Close
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PickupHistory;
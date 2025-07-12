import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TruckIcon, CalendarIcon, FilterIcon, CheckCircleIcon, ClockIcon, XCircleIcon, StarIcon, SearchIcon, MapPinIcon, ChevronRightIcon, XIcon } from 'lucide-react';

// Define interfaces for TypeScript
interface PickupData {
  id: number;
  type: string;
  date: string;
  time: string;
  status: 'completed' | 'cancelled' | 'scheduled' | 'confirmed';
  address: string;
  points: number;
  weight: string;
  recyclables: string;
  driver: string;
  notes: string;
}

type FilterType = 'all' | 'completed' | 'cancelled' | 'scheduled' | 'confirmed';
const PickupHistory = () => {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [showDetails, setShowDetails] = useState<PickupData | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Demo data
  const pickupHistory: PickupData[] = [{
    id: 1,
    type: 'Household Waste',
    date: 'June 15, 2023',
    time: '2:15 PM',
    status: 'completed',
    address: '123 Green Street, Colombo 05',
    points: 30,
    weight: '12kg',
    recyclables: '4kg',
    driver: 'Nuwan Perera',
    notes: 'Customer requested to place bins back in garage'
  }, {
    id: 2,
    type: 'Garden Waste',
    date: 'June 10, 2023',
    time: '10:30 AM',
    status: 'completed',
    address: '123 Green Street, Colombo 05',
    points: 45,
    weight: '25kg',
    recyclables: '0kg',
    driver: 'Amal Silva',
    notes: 'Large amount of branches and leaves'
  }, {
    id: 3,
    type: 'Recyclables',
    date: 'June 5, 2023',
    time: '9:00 AM',
    status: 'completed',
    address: '123 Green Street, Colombo 05',
    points: 50,
    weight: '8kg',
    recyclables: '8kg',
    driver: 'Malini Fernando',
    notes: 'Well sorted recyclables - customer received bonus points'
  }, {
    id: 4,
    type: 'Bulk Items',
    date: 'June 3, 2023',
    time: '1:00 PM',
    status: 'confirmed',
    address: '123 Green Street, Colombo 05',
    points: 0,
    weight: '0kg',
    recyclables: '0kg',
    driver: 'Saman Kumara',
    notes: 'Pickup confirmed and scheduled for tomorrow'
  }, {
    id: 5,
    type: 'Household Waste',
    date: 'June 1, 2023',
    time: '3:45 PM',
    status: 'cancelled',
    address: '123 Green Street, Colombo 05',
    points: 0,
    weight: '0kg',
    recyclables: '0kg',
    driver: 'N/A',
    notes: 'Customer cancelled due to unexpected travel'
  }, {
    id: 6,
    type: 'Electronic Waste',
    date: 'May 25, 2023',
    time: '11:20 AM',
    status: 'completed',
    address: '123 Green Street, Colombo 05',
    points: 75,
    weight: '15kg',
    recyclables: '15kg',
    driver: 'Nuwan Perera',
    notes: 'Old computer equipment and batteries'
  }];
  const filteredPickups = pickupHistory.filter(pickup => {
    // Apply status filter
    if (selectedFilter !== 'all' && pickup.status !== selectedFilter) {
      return false;
    }
    // Apply search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      return pickup.type.toLowerCase().includes(query) || pickup.date.toLowerCase().includes(query) || pickup.address.toLowerCase().includes(query);
    }
    return true;
  });
  const handleFilterChange = (filter: FilterType) => {
    setSelectedFilter(filter);
  };
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
  return <div className="max-w-4xl mx-auto">
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.5
    }} className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6">
          <div className="flex items-center mb-2">
            <div className="bg-white bg-opacity-20 p-2 rounded-full mr-3">
              <TruckIcon className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Pickup History</h2>
          </div>
          <p className="text-emerald-100">
            View your past waste collection history
          </p>
        </div>
        <div className="p-6">
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input type="text" placeholder="Search pickups..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 w-full py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500" />
            </div>
            <div className="flex space-x-2">
              <div className="flex items-center">
                <FilterIcon className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-sm text-gray-500">Filter:</span>
              </div>
              {(['all', 'completed', 'confirmed', 'cancelled', 'scheduled'] as FilterType[]).map(filter => <motion.button key={filter} whileHover={{
              y: -2
            }} whileTap={{
              y: 0
            }} onClick={() => handleFilterChange(filter)} className={`px-3 py-1 rounded-full text-sm font-medium ${selectedFilter === filter ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                </motion.button>)}
            </div>
          </div>
          {/* Pickup List */}
          {filteredPickups.length > 0 ? <div className="space-y-4">
              <AnimatePresence>
                {filteredPickups.map(pickup => <motion.div key={pickup.id} initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} exit={{
              opacity: 0,
              height: 0
            }} transition={{
              duration: 0.3
            }} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => viewDetails(pickup)}>
                    <div className="flex items-start">
                      <div className="bg-emerald-100 p-2 rounded-full mr-3 mt-1">
                        <CalendarIcon className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                          <h4 className="font-medium text-gray-800">
                            {pickup.type}
                          </h4>
                          <div className="flex items-center mt-1 sm:mt-0">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${getStatusClass(pickup.status)}`}>
                              {getStatusIcon(pickup.status)}
                              <span className="ml-1">
                                {getStatusText(pickup.status)}
                              </span>
                            </span>
                            {pickup.status === 'completed' && <div className="ml-2 flex items-center text-amber-600 font-medium text-sm">
                                <StarIcon className="h-4 w-4 mr-1" />
                                <span>+{pickup.points}</span>
                              </div>}
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
                        <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </motion.div>)}
              </AnimatePresence>
            </div> : <div className="text-center py-10">
              <div className="bg-gray-100 p-4 rounded-full inline-flex mb-4">
                <SearchIcon className="h-8 w-8 text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No Results Found
              </h3>
              <p className="text-gray-600">
                {searchQuery ? `No pickups match "${searchQuery}"` : "You don't have any pickup history yet."}
              </p>
              <button onClick={() => {
            setSearchQuery('');
            setSelectedFilter('all');
          }} className="mt-4 text-emerald-600 hover:text-emerald-700 font-medium">
                Clear filters
              </button>
            </div>}
        </div>
      </motion.div>
      {/* Pickup Details Modal */}
      <AnimatePresence>
        {showDetails && <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4" style={{
        backdropFilter: 'blur(5px)'
      }}>
            <motion.div initial={{
          opacity: 0,
          scale: 0.9
        }} animate={{
          opacity: 1,
          scale: 1
        }} exit={{
          opacity: 0,
          scale: 0.9
        }} transition={{
          type: 'spring',
          damping: 20
        }} className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto overflow-hidden relative">
              <button onClick={() => setShowDetails(null)} className="absolute top-4 right-4 bg-gray-200 p-2 rounded-full hover:bg-gray-300 transition-colors z-10">
                <XIcon className="h-5 w-5 text-gray-600" />
              </button>
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6">
                <div className="flex items-center mb-2">
                  <div className="bg-white bg-opacity-20 p-2 rounded-full mr-3">
                    <TruckIcon className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    Pickup Details
                  </h2>
                </div>
                <div className="flex items-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center bg-white bg-opacity-20 text-white`}>
                    {getStatusIcon(showDetails.status)}
                    <span className="ml-1">
                      {getStatusText(showDetails.status)}
                    </span>
                  </span>
                  {showDetails.status === 'completed' && <div className="ml-2 flex items-center text-white font-medium">
                      <StarIcon className="h-5 w-5 mr-1 text-yellow-300" />
                      <span>+{showDetails.points} points</span>
                    </div>}
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {showDetails.type}
                    </h3>
                    <div className="flex items-center mt-1 text-gray-600">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <span>{showDetails.date}</span>
                      <span className="mx-2">•</span>
                      <ClockIcon className="h-4 w-4 mr-1" />
                      <span>{showDetails.time}</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <div className="text-sm text-gray-500 mb-1">
                      Pickup Address
                    </div>
                    <div className="flex items-start">
                      <MapPinIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-800">
                        {showDetails.address}
                      </span>
                    </div>
                  </div>
                  {showDetails.status === 'completed' && <>
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-sm text-gray-500 mb-1">
                            Total Weight
                          </div>
                          <div className="text-lg font-semibold text-gray-800">
                            {showDetails.weight}
                          </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-sm text-gray-500 mb-1">
                            Recyclables
                          </div>
                          <div className="text-lg font-semibold text-gray-800">
                            {showDetails.recyclables}
                          </div>
                        </div>
                      </div>
                      <div className="pt-2">
                        <div className="text-sm text-gray-500 mb-1">
                          Pickup Agent
                        </div>
                        <div className="font-medium text-gray-800">
                          {showDetails.driver}
                        </div>
                      </div>
                    </>}
                  {showDetails.notes && <div className="pt-2">
                      <div className="text-sm text-gray-500 mb-1">Notes</div>
                      <div className="bg-gray-50 p-3 rounded-lg text-gray-700">
                        {showDetails.notes}
                      </div>
                    </div>}
                  {showDetails.status === 'completed' && <div className="pt-4">
                      <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4">
                        <div className="flex items-start">
                          <div className="bg-emerald-100 p-2 rounded-full mr-3">
                            <CheckCircleIcon className="h-5 w-5 text-emerald-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-emerald-800">
                              Environmental Impact
                            </h4>
                            <p className="text-sm text-emerald-700 mt-1">
                              By recycling {showDetails.recyclables}, you've
                              helped save approximately 2kg of CO₂ emissions!
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>}
                  <div className="pt-4 flex justify-end">
                    <motion.button whileHover={{
                  scale: 1.05
                }} whileTap={{
                  scale: 0.95
                }} onClick={() => setShowDetails(null)} className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium">
                      Close
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>}
      </AnimatePresence>
    </div>;
};
export default PickupHistory;
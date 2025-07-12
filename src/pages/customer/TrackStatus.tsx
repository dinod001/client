import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TruckIcon, ClockIcon, CheckCircleIcon, CalendarIcon, MapPinIcon, PhoneIcon, MessageCircleIcon, RefreshCwIcon, ArrowRightIcon } from 'lucide-react';
const TrackStatus = () => {
  const [activePickup, setActivePickup] = useState(null);
  const [statusProgress, setStatusProgress] = useState(2); // 0: Scheduled, 1: En Route, 2: Arrived, 3: Completed
  const [isRefreshing, setIsRefreshing] = useState(false);
  // Demo data
  const pickups = [{
    id: 1,
    type: 'Household Waste',
    date: 'Today, 2:00 PM',
    address: '123 Green Street, Colombo 05',
    driver: {
      name: 'Nuwan Perera',
      phone: '+94 71 234 5678',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    }
  }, {
    id: 2,
    type: 'Garden Waste',
    date: 'Tomorrow, 9:00 AM',
    address: '123 Green Street, Colombo 05',
    driver: null
  }];
  useEffect(() => {
    // Set the first pickup as active by default
    if (pickups.length > 0 && !activePickup) {
      setActivePickup(pickups[0]);
    }
  }, []);
  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refreshing data
    setTimeout(() => {
      // Randomly advance the status (for demo purposes)
      if (statusProgress < 3) {
        setStatusProgress(Math.min(statusProgress + 1, 3));
      }
      setIsRefreshing(false);
    }, 1500);
  };
  const getStatusText = () => {
    switch (statusProgress) {
      case 0:
        return 'Scheduled';
      case 1:
        return 'En Route';
      case 2:
        return 'Arrived';
      case 3:
        return 'Completed';
      default:
        return 'Unknown';
    }
  };
  const getStatusColor = () => {
    switch (statusProgress) {
      case 0:
        return 'text-blue-500';
      case 1:
        return 'text-amber-500';
      case 2:
        return 'text-purple-500';
      case 3:
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };
  const getStatusBg = () => {
    switch (statusProgress) {
      case 0:
        return 'bg-blue-500';
      case 1:
        return 'bg-amber-500';
      case 2:
        return 'bg-purple-500';
      case 3:
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };
  const getStatusLightBg = () => {
    switch (statusProgress) {
      case 0:
        return 'bg-blue-100';
      case 1:
        return 'bg-amber-100';
      case 2:
        return 'bg-purple-100';
      case 3:
        return 'bg-green-100';
      default:
        return 'bg-gray-100';
    }
  };
  const getETA = () => {
    switch (statusProgress) {
      case 0:
        return 'Arriving today at 2:00 PM';
      case 1:
        return 'Arriving in ~15 minutes';
      case 2:
        return 'Currently at your location';
      case 3:
        return 'Pickup completed at 2:15 PM';
      default:
        return 'Unknown';
    }
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
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-6">
          <div className="flex items-center mb-2">
            <div className="bg-white bg-opacity-20 p-2 rounded-full mr-3">
              <ClockIcon className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Track Status</h2>
          </div>
          <p className="text-amber-100">
            Monitor the status of your waste collection requests
          </p>
        </div>
        {activePickup ? <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">
                Active Pickup
              </h3>
              <motion.button whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }} onClick={handleRefresh} disabled={isRefreshing} className="flex items-center text-amber-600 hover:text-amber-700">
                <RefreshCwIcon className={`h-5 w-5 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
              </motion.button>
            </div>
            {/* Status Card */}
            <div className="bg-gradient-to-br from-gray-50 to-amber-50 rounded-xl p-6 mb-6 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-200 rounded-full opacity-20"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-200 rounded-full opacity-20"></div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 relative z-10">
                <div>
                  <div className="flex items-center mb-2">
                    <motion.div animate={{
                  scale: statusProgress === 1 ? [1, 1.1, 1] : 1
                }} transition={{
                  repeat: statusProgress === 1 ? Infinity : 0,
                  duration: 2
                }} className={`${getStatusLightBg()} p-2 rounded-full mr-2`}>
                      <TruckIcon className={`h-5 w-5 ${getStatusColor()}`} />
                    </motion.div>
                    <div>
                      <h4 className="font-bold text-gray-800">
                        {activePickup.type} Pickup
                      </h4>
                      <p className="text-sm text-gray-600">
                        {activePickup.date}
                      </p>
                    </div>
                  </div>
                </div>
                <div className={`${getStatusLightBg()} px-4 py-2 rounded-full flex items-center mt-2 md:mt-0`}>
                  <span className={`font-medium ${getStatusColor()}`}>
                    {getStatusText()}
                  </span>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="relative">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div initial={{
                  width: 0
                }} animate={{
                  width: `${statusProgress / 3 * 100}%`
                }} transition={{
                  duration: 1,
                  ease: 'easeOut'
                }} className={`h-full ${getStatusBg()}`} />
                  </div>
                  <div className="flex justify-between mt-2">
                    {['Scheduled', 'En Route', 'Arrived', 'Completed'].map((status, i) => <div key={i} className="flex flex-col items-center">
                          <motion.div initial={{
                    scale: 0
                  }} animate={{
                    scale: statusProgress >= i ? 1 : 0
                  }} transition={{
                    delay: 0.5 + i * 0.2,
                    duration: 0.5,
                    type: 'spring'
                  }} className={`w-6 h-6 rounded-full flex items-center justify-center ${statusProgress >= i ? getStatusBg() : 'bg-gray-200'}`}>
                            <CheckCircleIcon className="h-4 w-4 text-white" />
                          </motion.div>
                          <span className={`text-xs mt-1 ${statusProgress >= i ? getStatusColor() : 'text-gray-400'}`}>
                            {status}
                          </span>
                        </div>)}
                  </div>
                </div>
              </div>
              {/* ETA */}
              <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <ClockIcon className={`h-5 w-5 mr-2 ${getStatusColor()}`} />
                  <div>
                    <h5 className="font-medium text-gray-800">
                      Estimated Time
                    </h5>
                    <p className={`text-sm ${getStatusColor()} font-medium`}>
                      {getETA()}
                    </p>
                  </div>
                </div>
              </div>
              {/* Address */}
              <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <MapPinIcon className="h-5 w-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="font-medium text-gray-800">
                      Pickup Location
                    </h5>
                    <p className="text-sm text-gray-600">
                      {activePickup.address}
                    </p>
                  </div>
                </div>
              </div>
              {/* Driver Info (only show if en route or arrived) */}
              {statusProgress >= 1 && statusProgress <= 2 && activePickup.driver && <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5
          }} className="bg-white bg-opacity-70 backdrop-blur-sm rounded-lg p-4">
                    <h5 className="font-medium text-gray-800 mb-3">
                      Your Pickup Agent
                    </h5>
                    <div className="flex items-center">
                      <img src={activePickup.driver.avatar} alt={activePickup.driver.name} className="w-12 h-12 rounded-full mr-3" />
                      <div>
                        <p className="font-medium text-gray-800">
                          {activePickup.driver.name}
                        </p>
                        <div className="flex mt-1">
                          <a href={`tel:${activePickup.driver.phone}`} className="bg-amber-100 text-amber-600 px-3 py-1 rounded-full text-xs font-medium flex items-center mr-2">
                            <PhoneIcon className="h-3 w-3 mr-1" />
                            <span>Call</span>
                          </a>
                          <a href="#" className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-medium flex items-center">
                            <MessageCircleIcon className="h-3 w-3 mr-1" />
                            <span>Message</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.div>}
            </div>
            {/* Actions */}
            <div className="flex flex-wrap gap-4">
              <motion.button whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }} className="flex-1 bg-amber-100 text-amber-700 py-3 px-4 rounded-lg font-medium flex items-center justify-center">
                <MessageCircleIcon className="h-5 w-5 mr-2" />
                <span>Contact Support</span>
              </motion.button>
              <motion.button whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }} className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium flex items-center justify-center">
                <span>View Details</span>
                <ArrowRightIcon className="h-5 w-5 ml-2" />
              </motion.button>
            </div>
          </div> : <div className="p-6 text-center">
            <div className="py-10">
              <div className="bg-amber-100 p-4 rounded-full inline-flex mb-4">
                <ClockIcon className="h-8 w-8 text-amber-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No Active Pickups
              </h3>
              <p className="text-gray-600 mb-6">
                You don't have any active waste collection requests.
              </p>
              <motion.a whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }} href="/request-pickup" className="inline-flex items-center justify-center px-6 py-3 bg-amber-500 text-white font-medium rounded-lg">
                <TruckIcon className="h-5 w-5 mr-2" />
                <span>Request a Pickup</span>
              </motion.a>
            </div>
          </div>}
      </motion.div>
      {/* Upcoming Pickups */}
      {pickups.length > 1 && <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      delay: 0.3,
      duration: 0.5
    }} className="mt-6 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">
              Upcoming Pickups
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {pickups.filter(p => p.id !== activePickup?.id).map(pickup => <motion.div key={pickup.id} whileHover={{
          backgroundColor: 'rgba(251, 191, 36, 0.05)'
        }} className="p-4 cursor-pointer" onClick={() => setActivePickup(pickup)}>
                  <div className="flex items-start">
                    <div className="bg-amber-100 p-2 rounded-full mr-3 mt-1">
                      <CalendarIcon className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium text-gray-800">
                          {pickup.type}
                        </h4>
                        <span className="text-sm text-amber-600 font-medium">
                          Scheduled
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{pickup.date}</p>
                      <p className="text-sm text-gray-500 mt-1 flex items-center">
                        <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="truncate">{pickup.address}</span>
                      </p>
                    </div>
                  </div>
                </motion.div>)}
          </div>
        </motion.div>}
    </div>;
};
export default TrackStatus;
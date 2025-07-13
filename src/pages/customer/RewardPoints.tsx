import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@clerk/clerk-react';
import { 
  StarIcon, 
  GiftIcon, 
  TrendingUpIcon, 
  CheckCircleIcon, 
  ArrowRightIcon, 
  AwardIcon, 
  XIcon,
  ShoppingBagIcon,
  TicketIcon,
  CoffeeIcon,
  ShirtIcon,
  BoxIcon
} from 'lucide-react';

// Define interfaces for TypeScript
interface HistoryItem {
  id: string;
  type: string;
  date: string;
  points: number;
}

interface Reward {
  id: number;
  name: string;
  points: number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  image: string;
}

interface Booking {
  _id: string;
  serviceName: string;
  date: string;
  status: string;
}

interface Pickup {
  _id: string;
  scheduleDate?: string;
  createdAt: string;
  status: string;
}

// Define interface for milestone icons
interface MilestoneIcons {
  [key: number]: React.ComponentType<{ className?: string }>;
}

const RewardPoints = () => {
  const navigate = useNavigate();
  // Icon mapping for each milestone
  const milestoneIcons: MilestoneIcons = {
    0: StarIcon,
    20: TrendingUpIcon,
    40: AwardIcon,
    60: GiftIcon,
    80: ArrowRightIcon,
    100: CheckCircleIcon,
  };

  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [redeemSuccess, setRedeemSuccess] = useState(false);
  const [userPoints, setUserPoints] = useState<number>(0);
  const [userHistory, setUserHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();

  // Rewards data
  const rewards: Reward[] = [
    {
      id: 1,
      name: 'Eco-Friendly Water Bottle',
      points: 150,
      description: 'Reusable stainless steel water bottle with EcoClean logo',
      icon: CoffeeIcon,
      color: 'from-blue-400 to-blue-600',
      image: 'https://img.freepik.com/free-vector/reusable-water-bottle-concept-illustration_114360-7417.jpg',
    },
    {
      id: 2,
      name: 'Organic Cotton T-Shirt',
      points: 250,
      description: 'Comfortable eco-friendly t-shirt made from 100% organic cotton',
      icon: ShirtIcon,
      color: 'from-green-400 to-green-600',
      image: 'https://img.freepik.com/free-vector/hand-drawn-clothing-store-logo-design_23-2149499592.jpg',
    },
    {
      id: 3,
      name: 'Plant a Tree',
      points: 100,
      description: "We'll plant a tree in your name in a deforested area of Sri Lanka",
      icon: BoxIcon,
      color: 'from-emerald-400 to-emerald-600',
      image: 'https://img.freepik.com/free-vector/people-planting-trees-together-illustration_52683-66082.jpg',
    },
    {
      id: 4,
      name: 'Free Pickup Voucher',
      points: 200,
      description: 'One free pickup service of any type (household, garden, or electronic waste)',
      icon: TicketIcon,
      color: 'from-purple-400 to-purple-600',
      image: 'https://img.freepik.com/free-vector/coupon-design-template-with-scissors_23-2147926184.jpg',
    },
    {
      id: 5,
      name: 'Eco-Store Discount',
      points: 300,
      description: '15% discount on your next purchase at our partner eco-stores',
      icon: ShoppingBagIcon,
      color: 'from-amber-400 to-amber-600',
      image: 'https://img.freepik.com/free-vector/shop-with-sign-we-are-open_52683-38687.jpg',
    },
  ];

  // Fetch completed service bookings and pickup requests
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken();
        // Fetch completed service bookings
        const bookingsRes = await fetch('http://localhost:5000/api/user/all-bookings', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!bookingsRes.ok) throw new Error('Failed to fetch bookings');
        const bookingsData = await bookingsRes.json();
        const completedBookings: Booking[] = (bookingsData.allBookings || []).filter(
          (b: Booking) => b.status === 'Completed'
        );

        // Fetch completed pickup requests
        const pickupsRes = await fetch('http://localhost:5000/api/user/get-all-pickup-request', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!pickupsRes.ok) throw new Error('Failed to fetch pickups');
        const pickupsData = await pickupsRes.json();
        const completedPickups: Pickup[] = (pickupsData.allPickups || []).filter(
          (p: Pickup) => p.status === 'Completed'
        );

        // Calculate total points: 1 point per completed booking or pickup
        const totalPoints = completedBookings.length + completedPickups.length;
        setUserPoints(totalPoints);

        // Build history for display
        const history: HistoryItem[] = [
          ...completedBookings.map((b: Booking) => ({
            id: b._id,
            type: b.serviceName,
            date: new Date(b.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            points: 1,
          })),
          ...completedPickups.map((p: Pickup) => {
            let dateStr = 'Unknown Date';
            const scheduleDate = p.scheduleDate ? new Date(p.scheduleDate) : null;
            if (scheduleDate && !isNaN(scheduleDate.getTime())) {
              dateStr = scheduleDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            } else if (p.createdAt) {
              const createdDate = new Date(p.createdAt);
              if (!isNaN(createdDate.getTime())) {
                dateStr = createdDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
              }
            }
            return {
              id: p._id,
              type: 'Pickup Request',
              date: dateStr,
              points: 1,
            };
          }),
        ];
        setUserHistory(history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load reward points. Please try again.');
        setUserPoints(0);
        setUserHistory([]);
      }
    };
    fetchData();
  }, [getToken]);

  // Rank levels
  const rankLevels = [
    { name: 'Eco Novice', min: 0, max: 99, color: 'bg-gray-200' },
    { name: 'Green Enthusiast', min: 100, max: 299, color: 'bg-green-200' },
    { name: 'Green Hero', min: 300, max: 499, color: 'bg-green-400' },
    { name: 'Earth Guardian', min: 500, max: 999, color: 'bg-emerald-400' },
    { name: 'Eco Champion', min: 1000, max: Infinity, color: 'bg-emerald-600' },
  ];

  // Milestones for Green Enthusiast
  const greenEnthusiastMilestones = [0, 20, 40, 60, 80, 100];

  const milestoneLabels: { [key: number]: string } = {
    0: 'Eco Beginner',
    20: 'Eco Explorer',
    40: 'Eco Achiever',
    60: 'Eco Motivator',
    80: 'Eco Leader',
    100: 'Green Enthusiast',
  };

  const getCurrentRank = (points: number) => {
    return rankLevels.find(rank => points >= rank.min && points <= rank.max) || rankLevels[0];
  };

  const getNextRank = (points: number) => {
    const currentRankIndex = rankLevels.findIndex(rank => points >= rank.min && points <= rank.max);
    return rankLevels[currentRankIndex + 1] || null;
  };

  const getCurrentMilestone = (points: number) => {
    let current = 0;
    for (let milestone of greenEnthusiastMilestones) {
      if (points >= milestone) {
        current = milestone;
      } else {
        break;
      }
    }
    return milestoneLabels[current];
  };

  const currentRank = getCurrentRank(userPoints);
  const currentMilestoneLabel = getCurrentMilestone(userPoints);
  const nextRank = getNextRank(userPoints);
  const pointsToNextRank = nextRank ? nextRank.min - userPoints : 0;
  const progressToNextRank = nextRank ? ((userPoints - currentRank.min) / (nextRank.min - currentRank.min)) * 100 : 100;

  const handleRedeemClick = (reward: Reward) => {
    if (userPoints < reward.points) return;
    setSelectedReward(reward);
    setShowRedeemModal(true);
    setRedeemSuccess(false);
  };

  const handleConfirmRedeem = async () => {
    if (!selectedReward) return;
    setIsRedeeming(true);
    try {
      // Simulate API call to redeem reward
      const token = await getToken();
      // Placeholder: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setUserPoints(prev => prev - selectedReward.points);
      setUserHistory(prev => [
        {
          id: Date.now().toString(),
          type: `Redeemed ${selectedReward.name}`,
          date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          points: -selectedReward.points,
        },
        ...prev,
      ]);
      setIsRedeeming(false);
      setRedeemSuccess(true);
      setTimeout(() => {
        setShowRedeemModal(false);
        setSelectedReward(null);
        setRedeemSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Error redeeming reward:', err);
      setIsRedeeming(false);
      setError('Failed to redeem reward. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center"
        >
          <XIcon className="h-5 w-5 text-red-600 mr-2" />
          <p className="text-red-800">{error}</p>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6">
          <div className="flex items-center mb-2">
            <div className="bg-white bg-opacity-20 p-2 rounded-full mr-3">
              <StarIcon className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Reward Points</h2>
          </div>
          <p className="text-pink-100">
            Earn points for eco-friendly actions and redeem exclusive rewards
          </p>
        </div>
        <div className="p-6">
          {/* Points Summary */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 mb-8 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-200 rounded-full opacity-20"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-200 rounded-full opacity-20"></div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 relative z-10">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  Your Eco Points
                </h3>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-purple-600">
                    {userPoints}
                  </span>
                  <span className="ml-2 text-gray-600">points</span>
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="flex items-center">
                  <AwardIcon className="h-5 w-5 text-purple-500 mr-2" />
                  <span className="font-medium text-gray-800">Current Milestone:</span>
                  <span className="ml-2 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                    {currentMilestoneLabel}
                  </span>
                </div>
                {nextRank && (
                  <div className="flex items-center mt-2 text-sm text-gray-600">
                    <TrendingUpIcon className="h-4 w-4 mr-1 text-pink-500" />
                    <span>
                      {pointsToNextRank} points to reach {nextRank.name}
                    </span>
                  </div>
                )}
              </div>
            </div>
            {/* Rank Progress Bar */}
            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">{currentRank.name}</span>
                {nextRank && (
                  <span className="font-medium text-gray-700">{nextRank.name}</span>
                )}
              </div>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressToNextRank}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-pink-500 to-purple-600"
                />
              </div>
            </div>
            {/* Milestones */}
            <div className="flex justify-between mt-6">
              {greenEnthusiastMilestones.map((milestone, i) => {
                const Icon = milestoneIcons[milestone];
                const milestoneRank = rankLevels.find(
                  rank => milestone >= rank.min && milestone <= rank.max
                ) || rankLevels[0];
                return (
                  <div key={milestone} className="flex flex-col items-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.1, duration: 0.5, type: 'spring' }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center relative shadow ${milestoneRank.color} ${
                        userPoints >= milestone ? 'opacity-100' : 'opacity-40'
                      }`}
                    >
                      <Icon className={`h-6 w-6 text-white`} />
                      {userPoints >= milestone && (
                        <span className="absolute top-0 right-0 bg-white rounded-full p-1 shadow-md">
                          <CheckCircleIcon className="h-4 w-4 text-green-500" />
                        </span>
                      )}
                    </motion.div>
                    <span
                      className={`text-xs mt-1 text-center ${
                        userPoints >= milestone ? 'font-medium text-gray-800' : 'text-gray-500'
                      }`}
                      style={{ maxWidth: '90px' }}
                    >
                      {milestoneLabels[milestone]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Points History */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Points History</h3>
              <button
                onClick={() => navigate('/pickup-history')}
                className="text-purple-600 hover:text-purple-700 text-sm flex items-center"
              >
                <span>View all</span>
                <ArrowRightIcon className="h-4 w-4 ml-1" />
              </button>
            </div>
            <div className="bg-gray-50 rounded-xl overflow-hidden">
              {userHistory.length === 0 ? (
                <p className="p-4 text-gray-500 text-center">No history available.</p>
              ) : (
                <div className="divide-y divide-gray-200">
                  {userHistory.map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { delay: i * 0.1 } }}
                      className="p-4 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium text-gray-800">{item.type}</h4>
                          <p className="text-sm text-gray-500">{item.date}</p>
                        </div>
                        <div className="flex items-center font-semibold" style={{ color: item.points > 0 ? '#9333EA' : '#EF4444' }}>
                          <StarIcon className="h-4 w-4 mr-1" />
                          <span>{item.points > 0 ? `+${item.points}` : item.points}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
      {/* Redeem Modal */}
      <AnimatePresence>
        {showRedeemModal && selectedReward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', damping: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto overflow-hidden relative"
            >
              <button
                onClick={() => setShowRedeemModal(false)}
                className="absolute top-4 right-4 bg-gray-200 p-2 rounded-full hover:bg-gray-300 transition-colors z-10"
              >
                <XIcon className="h-5 w-5 text-gray-600" />
              </button>
              {redeemSuccess ? (
                <div className="p-8 text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircleIcon className="h-12 w-12 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Reward Redeemed!</h2>
                  <p className="text-gray-600 mb-6">
                    You've successfully redeemed {selectedReward.name} for {selectedReward.points} points.
                  </p>
                  <motion.div
                    className="w-full h-2 bg-green-100 rounded-full overflow-hidden mb-6"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2.5 }}
                  >
                    <div className="h-full bg-green-500" />
                  </motion.div>
                  <p className="text-sm text-gray-500">
                    Check your email for redemption details.
                  </p>
                </div>
              ) : (
                <>
                  <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6">
                    <div className="flex items-center mb-2">
                      <div className="bg-white bg-opacity-20 p-2 rounded-full mr-3">
                        <GiftIcon className="h-6 w-6 text-white" />
                      </div>
                      <h2 className="text-xl font-bold text-white">Redeem Reward</h2>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-6">
                      <div className={`bg-gradient-to-r ${selectedReward.color} p-3 rounded-full mr-4`}>
                        <selectedReward.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{selectedReward.name}</h3>
                        <div className="flex items-center text-purple-600 font-bold">
                          <StarIcon className="h-4 w-4 mr-1" />
                          <span>{selectedReward.points} points</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-6">{selectedReward.description}</p>
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Your current points</span>
                        <span className="font-semibold text-gray-800">{userPoints}</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-gray-600">Reward cost</span>
                        <span className="font-semibold text-gray-800">-{selectedReward.points}</span>
                      </div>
                      <div className="border-t border-gray-200 my-2 pt-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Remaining points</span>
                          <span className="font-semibold text-gray-800">{userPoints - selectedReward.points}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowRedeemModal(false)}
                        className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleConfirmRedeem}
                        disabled={isRedeeming || userPoints < selectedReward.points}
                        className={`px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium flex items-center ${
                          isRedeeming || userPoints < selectedReward.points ? 'opacity-80 cursor-not-allowed' : ''
                        }`}
                      >
                        {isRedeeming ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <GiftIcon className="h-5 w-5 mr-2" />
                            <span>Confirm Redemption</span>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RewardPoints;
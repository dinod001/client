import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HomeIcon, 
  CalendarIcon, 
  BookOpenIcon, 
  TruckIcon, 
  ClockIcon, 
  StarIcon, 
  MessageCircleIcon, 
  BellIcon, 
  UserIcon, 
  X,
  SparklesIcon,
  HeadphonesIcon
} from 'lucide-react';
const menuItems = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: HomeIcon,
    category: 'main'
  },
  {
    name: 'Request Pickup',
    path: '/request-pickup',
    icon: TruckIcon,
    category: 'services'
  },
  {
    name: 'Book Services',
    path: '/service-booking',
    icon: CalendarIcon,
    category: 'services'
  },
  {
    name: 'Track Status',
    path: '/track-status',
    icon: ClockIcon,
    category: 'services'
  },
  {
    name: 'Pickup History',
    path: '/pickup-history',
    icon: BookOpenIcon,
    category: 'history'
  },
  {
    name: 'Reward Points',
    path: '/rewards',
    icon: StarIcon,
    category: 'rewards'
  },
  {
    name: 'Support',
    path: '/inquiry',
    icon: MessageCircleIcon,
    category: 'support'
  },
  {
    name: 'Notifications',
    path: '/notifications',
    icon: BellIcon,
    category: 'account'
  },
  {
    name: 'Profile',
    path: '/profile',
    icon: UserIcon,
    category: 'account'
  }
];
const Sidebar = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) => {
  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40
      }
    },
    closed: {
      x: '-100%',
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40
      }
    }
  };

  const menuItemVariants = {
    open: (i: number) => ({
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40,
        delay: 0.1 + i * 0.05
      }
    }),
    closed: {
      opacity: 0,
      y: 20,
      x: -20
    }
  };

  const containerVariants = {
    open: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    },
    closed: {
      transition: {
        staggerChildren: 0.02,
        staggerDirection: -1
      }
    }
  };

  return (
    <>
      {/* Mobile Sidebar Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden" 
            onClick={() => setIsOpen(false)} 
          />
        )}
      </AnimatePresence>
      
      {/* Mobile Sidebar */}
      <motion.aside 
        variants={sidebarVariants} 
        initial="closed" 
        animate={isOpen ? 'open' : 'closed'} 
        className="fixed inset-y-0 left-0 w-72 bg-slate-900 shadow-2xl z-40 overflow-hidden lg:hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                <SparklesIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">EcoClean</h2>
                <p className="text-slate-400 text-sm">Customer Portal</p>
              </div>
            </div>
            <motion.button 
              onClick={() => setIsOpen(false)} 
              className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="h-5 w-5" />
            </motion.button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-6 px-4">
          <motion.nav 
            variants={containerVariants}
            initial="closed"
            animate={isOpen ? 'open' : 'closed'}
          >
            <ul className="space-y-2">
              {menuItems.map((item, index) => (
                <motion.li key={item.path} variants={menuItemVariants} custom={index}>
                  <NavLink 
                    to={item.path} 
                    className={({ isActive }) => 
                      `group flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive 
                          ? 'bg-emerald-500 text-white' 
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`
                    } 
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </NavLink>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        </div>

        {/* Support Card */}
        <div className="p-4 border-t border-slate-700">
          <div className="bg-slate-800 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <HeadphonesIcon className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Need Help?</p>
                <p className="text-xs text-slate-400">24/7 Support</p>
              </div>
            </div>
            <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-72 lg:flex-col bg-slate-900 shadow-xl border-r border-slate-700">
        {/* Header */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
              <SparklesIcon className="h-7 w-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">EcoClean</h2>
              <p className="text-slate-400 text-sm">Customer Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink 
                  to={item.path} 
                  className={({ isActive }) => 
                    `group flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-emerald-500 text-white' 
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`
                  }
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Support Card */}
        <div className="p-4 border-t border-slate-700">
          <div className="bg-slate-800 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <HeadphonesIcon className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Need Help?</p>
                <p className="text-xs text-slate-400">24/7 Support</p>
              </div>
            </div>
            <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
export default Sidebar;
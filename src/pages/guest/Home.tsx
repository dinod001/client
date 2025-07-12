import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser, SignInButton } from '@clerk/clerk-react';
import { 
  TruckIcon, 
  RecycleIcon, 
  CheckCircleIcon, 
  ArrowRightIcon, 
  StarIcon,
  ShieldCheckIcon,
  AwardIcon,
  TreesIcon,
  SparklesIcon,
  UsersIcon,
  ClockIcon,
  HeartIcon,
  BadgeCheckIcon,
  PhoneCallIcon,
  PlayIcon,
  ChevronRightIcon,
  GlobeIcon
} from 'lucide-react';
const Home = () => {
  const { isSignedIn } = useUser();
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [0, -15, 0],
      rotate: [0, 3, -3, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  const stats = [
    { number: '10,000+', label: 'Happy Customers', icon: UsersIcon },
    { number: '50,000+', label: 'Tons Recycled', icon: RecycleIcon },
    { number: '99.9%', label: 'On-Time Pickup', icon: ClockIcon },
    { number: '25+', label: 'Service Areas', icon: GlobeIcon }
  ];

  const services = [
    {
      icon: TruckIcon,
      title: 'Smart Waste Collection',
      description: 'AI-powered route optimization for efficient waste pickup across Sri Lanka',
      features: ['Real-time tracking', 'Flexible scheduling', 'Eco-friendly vehicles'],
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50'
    },
    {
      icon: RecycleIcon,
      title: 'Advanced Recycling',
      description: 'Comprehensive recycling solutions with reward-based incentives',
      features: ['Material separation', 'Reward points', 'Environmental impact tracking'],
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50'
    },
    {
      icon: SparklesIcon,
      title: 'Premium Cleaning',
      description: 'Professional cleaning services for residential and commercial spaces',
      features: ['Deep cleaning', 'Sanitization', 'Quality guarantee'],
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50'
    }
  ];

  const testimonials = [
    {
      name: 'Priya Fernandez',
      role: 'Homeowner, Colombo',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?w=150&h=150&fit=crop&crop=face',
      content: 'EcoClean has transformed our neighborhood. The service is reliable, and I love earning points for being eco-friendly!',
      rating: 5
    },
    {
      name: 'Sunil Perera',
      role: 'Business Owner, Kandy',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      content: 'Outstanding service! Their team is professional, punctual, and truly cares about environmental sustainability.',
      rating: 5
    },
    {
      name: 'Anushka Silva',
      role: 'Community Leader, Galle',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      content: 'Thanks to EcoClean, our community is cleaner than ever. The app makes scheduling so convenient!',
      rating: 5
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
          <div className="absolute inset-0 opacity-40">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Hero Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="space-y-8"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-green-200 rounded-full px-4 py-2 shadow-lg"
              >
                <AwardIcon className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-800">Sri Lanka's #1 Waste Management Platform</span>
              </motion.div>

              {/* Main Heading */}
              <div className="space-y-4">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
                >
                  <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Transform Your
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    Community
                  </span>
                </motion.h1>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl md:text-2xl text-gray-600 max-w-xl leading-relaxed"
                >
                  Join the eco-revolution with smart waste management, premium cleaning services, and rewarding sustainability programs across Sri Lanka.
                </motion.p>
              </div>

              {/* Action Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                {isSignedIn ? (
                  <Link to="/dashboard">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="group relative bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center space-x-2">
                        <span>Go to Dashboard</span>
                        <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </motion.button>
                  </Link>
                ) : (
                  <SignInButton mode="modal">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="group relative bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center space-x-2">
                        <span>Get Started Free</span>
                        <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </motion.button>
                  </SignInButton>
                )}
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group flex items-center space-x-2 bg-white/80 backdrop-blur-sm text-gray-800 font-semibold px-8 py-4 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <PlayIcon className="h-5 w-5 text-green-600" />
                  <span>Watch Demo</span>
                </motion.button>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center space-x-6 pt-8"
              >
                <div className="flex items-center space-x-2">
                  <BadgeCheckIcon className="h-6 w-6 text-green-600" />
                  <span className="text-sm font-medium text-gray-600">ISO 9001 Certified</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ShieldCheckIcon className="h-6 w-6 text-blue-600" />
                  <span className="text-sm font-medium text-gray-600">Fully Insured</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TreesIcon className="h-6 w-6 text-emerald-600" />
                  <span className="text-sm font-medium text-gray-600">Carbon Neutral</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Hero Visual */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="relative">
                {/* Beautiful Illustration Container */}
                <div className="relative z-10 bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-lg rounded-3xl p-12 border border-white/30 shadow-2xl">
                  {/* Central Icon Display */}
                  <div className="flex items-center justify-center h-80">
                    <div className="relative">
                      {/* Main Central Icon */}
                      <motion.div
                        animate={{ 
                          rotate: [0, 360],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{
                          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                          scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                        }}
                        className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-full p-8 shadow-2xl"
                      >
                        <RecycleIcon className="h-24 w-24 text-white" />
                      </motion.div>
                      
                      {/* Orbiting Icons */}
                      <motion.div
                        animate={{ rotate: [0, -360] }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 w-full h-full"
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                          <div className="bg-blue-100 p-3 rounded-full shadow-lg">
                            <TruckIcon className="h-8 w-8 text-blue-600" />
                          </div>
                        </div>
                        <div className="absolute top-1/2 -right-8 transform -translate-y-1/2">
                          <div className="bg-purple-100 p-3 rounded-full shadow-lg">
                            <SparklesIcon className="h-8 w-8 text-purple-600" />
                          </div>
                        </div>
                        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                          <div className="bg-amber-100 p-3 rounded-full shadow-lg">
                            <TreesIcon className="h-8 w-8 text-amber-600" />
                          </div>
                        </div>
                        <div className="absolute top-1/2 -left-8 transform -translate-y-1/2">
                          <div className="bg-emerald-100 p-3 rounded-full shadow-lg">
                            <HeartIcon className="h-8 w-8 text-emerald-600" />
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Floating Stats Cards */}
                <motion.div 
                  variants={floatingVariants}
                  animate="animate"
                  className="absolute -top-6 -left-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-4 shadow-xl text-white"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/20 p-2 rounded-xl">
                      <TruckIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Smart Pickup</p>
                      <p className="text-xs opacity-90">AI-Optimized Routes</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  variants={floatingVariants}
                  animate="animate"
                  className="absolute -bottom-6 -right-6 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl p-4 shadow-xl text-white"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/20 p-2 rounded-xl">
                      <HeartIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Eco Impact</p>
                      <p className="text-xs opacity-90">2.5 tons CO₂ saved</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  variants={floatingVariants}
                  animate="animate"
                  className="absolute top-1/2 -right-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-4 shadow-xl text-white"
                >
                  <div className="text-center">
                    <StarIcon className="h-8 w-8 mx-auto mb-2 fill-current" />
                    <p className="text-lg font-bold">4.9★</p>
                    <p className="text-xs opacity-90">Customer Rating</p>
                  </div>
                </motion.div>

                <motion.div 
                  variants={floatingVariants}
                  animate="animate"
                  className="absolute top-8 right-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-3 shadow-xl text-white"
                >
                  <div className="text-center">
                    <UsersIcon className="h-6 w-6 mx-auto mb-1" />
                    <p className="text-sm font-bold">10K+</p>
                    <p className="text-xs opacity-90">Users</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center"
          >
            <motion.div 
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-1 h-3 bg-gray-400 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Thousands</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our commitment to excellence has made us Sri Lanka's leading eco-friendly service provider
            </p>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => {
              const gradients = [
                'from-blue-500 to-cyan-500',
                'from-emerald-500 to-green-500', 
                'from-purple-500 to-pink-500',
                'from-amber-500 to-orange-500'
              ];
              return (
                <motion.div 
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -10, scale: 1.05 }}
                  className="text-center group"
                >
                  <div className={`bg-gradient-to-br ${gradients[index]} rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 text-white`}>
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-4 mx-auto w-fit">
                      <stat.icon className="h-10 w-10 text-white" />
                    </div>
                    <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                    <div className="text-white/90 font-medium">{stat.label}</div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Environmental Impact Gallery */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Environmental Impact</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See the difference we're making in Sri Lankan communities - from efficient waste collection to creating beautiful, clean environments
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {/* Waste Collection in Action */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative h-80 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="EcoClean waste collection truck in action"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="bg-emerald-500 bg-opacity-90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold mb-3 w-fit">
                    🚛 Smart Collection
                  </div>
                  <h3 className="text-xl font-bold mb-2">Efficient Waste Collection</h3>
                  <p className="text-emerald-100 text-sm">Our modern trucks and trained professionals ensure timely, eco-friendly waste pickup across Sri Lanka.</p>
                </div>
              </div>
            </motion.div>

            {/* Clean Beautiful Environment */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative h-80 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Beautiful clean park environment in Sri Lanka"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="bg-green-500 bg-opacity-90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold mb-3 w-fit">
                    🌿 Clean Spaces
                  </div>
                  <h3 className="text-xl font-bold mb-2">Beautiful Clean Communities</h3>
                  <p className="text-green-100 text-sm">Creating pristine environments where families can enjoy nature without the worry of waste pollution.</p>
                </div>
              </div>
            </motion.div>

            {/* Recycling Process */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative h-80 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Advanced recycling facility with sorted waste materials"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="bg-blue-500 bg-opacity-90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold mb-3 w-fit">
                    ♻️ Recycling
                  </div>
                  <h3 className="text-xl font-bold mb-2">Advanced Recycling</h3>
                  <p className="text-blue-100 text-sm">State-of-the-art sorting and recycling processes that give new life to waste materials.</p>
                </div>
              </div>
            </motion.div>

            {/* Clean Beach Environment */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative h-80 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1439066615861-d1af74d74000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Clean beautiful beach in Sri Lanka"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="bg-cyan-500 bg-opacity-90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold mb-3 w-fit">
                    🏖️ Coastal Care
                  </div>
                  <h3 className="text-xl font-bold mb-2">Pristine Coastal Areas</h3>
                  <p className="text-cyan-100 text-sm">Protecting Sri Lanka's stunning coastlines by preventing ocean pollution and maintaining clean beaches.</p>
                </div>
              </div>
            </motion.div>

            {/* Urban Cleaning */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative h-80 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1486286701208-1d58e9338013?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Clean modern urban environment"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="bg-purple-500 bg-opacity-90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold mb-3 w-fit">
                    🏢 Urban Clean
                  </div>
                  <h3 className="text-xl font-bold mb-2">Modern Urban Spaces</h3>
                  <p className="text-purple-100 text-sm">Maintaining clean, modern urban environments where people can live, work, and thrive comfortably.</p>
                </div>
              </div>
            </motion.div>

            {/* Green Forest Environment */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative h-80 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Lush green forest environment"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="bg-green-600 bg-opacity-90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold mb-3 w-fit">
                    🌲 Forest Protection
                  </div>
                  <h3 className="text-xl font-bold mb-2">Protected Natural Habitats</h3>
                  <p className="text-green-100 text-sm">Preserving Sri Lanka's rich biodiversity by keeping natural areas free from pollution and waste.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Call to Action in Gallery Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-3xl p-8 border border-emerald-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Be Part of This Beautiful Transformation
              </h3>
              <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
                Every service you book with EcoClean helps create cleaner, more beautiful environments across Sri Lanka. Join us in building a sustainable future.
              </p>
              <Link to="/services">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 mx-auto"
                >
                  <span>Explore Our Services</span>
                  <ChevronRightIcon className="h-5 w-5" />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What Our <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Customers Say</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of satisfied customers who trust EcoClean for their waste management needs
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="flex items-center mb-6">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-700 leading-relaxed italic">"{testimonial.content}"</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl"
          ></motion.div>
          <motion.div 
            animate={{ 
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
              opacity: [0.15, 0.25, 0.15]
            }}
            transition={{ duration: 25, repeat: Infinity }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl"
          ></motion.div>
          <motion.div 
            animate={{ 
              scale: [1, 1.3, 1],
              x: [0, 50, 0],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 30, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl"
          ></motion.div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 inline-flex items-center space-x-2 mb-6">
                <SparklesIcon className="h-5 w-5 text-yellow-300" />
                <span className="text-sm font-medium">Join the Eco Revolution</span>
              </div>
            </motion.div>

            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Ready to Make a <br />
              <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                Lasting Impact?
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-indigo-100 mb-12 max-w-4xl mx-auto leading-relaxed">
              Join thousands of Sri Lankans who are transforming their communities with EcoClean. 
              Start your sustainable journey today and earn rewards for every eco-friendly action.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              {isSignedIn ? (
                <Link to="/dashboard">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="group bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white font-bold px-10 py-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 text-lg flex items-center space-x-3"
                  >
                    <span>Go to Dashboard</span>
                    <ArrowRightIcon className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>
              ) : (
                <SignInButton mode="modal">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="group bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white font-bold px-10 py-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 text-lg flex items-center space-x-3"
                  >
                    <span>Start Free Today</span>
                    <ArrowRightIcon className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </SignInButton>
              )}
              
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-semibold px-10 py-5 rounded-2xl hover:bg-white/20 transition-all duration-300 text-lg flex items-center space-x-3"
              >
                <PhoneCallIcon className="h-6 w-6" />
                <span>Call +94 11 234 5678</span>
              </motion.button>
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center items-center gap-8 text-indigo-200"
            >
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="h-5 w-5 text-green-400" />
                <span className="text-sm">No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="h-5 w-5 text-green-400" />
                <span className="text-sm">Free forever plan</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="h-5 w-5 text-green-400" />
                <span className="text-sm">Cancel anytime</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
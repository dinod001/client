import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser, SignInButton, useAuth } from '@clerk/clerk-react';
import { 
  TruckIcon, 
  ScissorsIcon, 
  DropletIcon, 
  ArrowRightIcon, 
  CheckIcon, 
  XIcon, 
  LeafIcon, 
  RecycleIcon, 
  TrashIcon, 
  SparklesIcon, 
  BoxIcon, 
  LoaderIcon,
  StarIcon,
  ShieldCheckIcon,
  HeartIcon,
  ZapIcon,
  ClockIcon,
  BadgeCheckIcon,
  TrophyIcon,
  UsersIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
  CalendarIcon,
  ImageIcon,
  SendIcon,
  UploadIcon,
  XCircleIcon,
  CheckCircleIcon,
  AlertCircleIcon
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useServicesApi } from '../../services/servicesApi';
// Define the service interface for API response
interface ApiService {
  _id: string;
  serviceName: string;
  description: string;
  price: number;
  discount: number;
  imageUrl: string;
  Availability: boolean;
  __v: number;
}

// Define the service interface for UI
interface Service {
  id: string | number;
  name: string;
  description: string;
  status?: string;
  icon?: any;
  color?: string;
  benefits?: string[];
  pricing?: string;
  image?: string;
}

const Services = () => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [apiServices, setApiServices] = useState<ApiService[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showPickupForm, setShowPickupForm] = useState<boolean>(false);
  const { isSignedIn, user } = useUser();
  const { getAllServices } = useServicesApi();
  const navigate = useNavigate();

  // Fetch services from API on component mount
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching services from:', import.meta.env.VITE_BACKEND_URL);
      const response = await getAllServices();
      
      // Handle the API response structure: { success: true, data: [...] }
      if (response.success && response.data) {
        setApiServices(response.data);
        console.log('Services fetched successfully:', response.data.length, 'services');
      } else {
        setError('Invalid response format from server');
        console.error('Invalid API response:', response);
        // Use fallback services
        useFallbackServices();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load services from server';
      setError(errorMessage);
      console.error('Error fetching services:', err);
      
      // Use fallback services when API fails
      useFallbackServices();
    } finally {
      setLoading(false);
    }
  };

  // Fallback services for when API is unavailable
  const useFallbackServices = () => {
    console.log('Using fallback services due to API unavailability');
    const fallbackServices = [
      {
        _id: 'fallback-1',
        serviceName: 'Household Waste Collection',
        description: 'Regular pickup and disposal of household waste with eco-friendly processing.',
        price: 2500,
        discount: 15,
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        Availability: true,
        __v: 0
      },
      {
        _id: 'fallback-2',
        serviceName: 'Recycling Services',
        description: 'Comprehensive recycling solutions for paper, plastic, glass, and metal waste.',
        price: 1800,
        discount: 10,
        imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400',
        Availability: true,
        __v: 0
      },
      {
        _id: 'fallback-3',
        serviceName: 'Garden Waste Management',
        description: 'Collection and composting of garden waste, leaves, and organic materials.',
        price: 3000,
        discount: 20,
        imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
        Availability: true,
        __v: 0
      }
    ];
    setApiServices(fallbackServices);
    setError(null); // Clear error when using fallback
  };

  // Map API services to the format expected by the UI
  const mapApiServicesToUI = (apiServices: ApiService[]): Service[] => {
    return apiServices
      .filter(service => service.Availability) // Only show available services
      .map((service, index) => {
        const finalPrice = service.price - (service.price * service.discount / 100);
        return {
          id: service._id,
          name: service.serviceName,
          description: service.description,
          status: service.Availability ? 'active' : 'inactive',
          // Add default UI properties for API services
          icon: getServiceIcon(index),
          color: getServiceColor(index),
          benefits: [
            'Professional service delivery',
            `${service.discount}% discount available`,
            'Quality guaranteed',
            'Contact for scheduling'
          ],
          pricing: service.discount > 0 
            ? `Rs. ${finalPrice.toFixed(0)} (${service.discount}% off Rs. ${service.price})`
            : `Rs. ${service.price}`,
          image: service.imageUrl // Keep original image URL for reference
        };
      });
  };

  // Helper function to assign icons to API services
  const getServiceIcon = (index: number) => {
    const icons = [TruckIcon, ScissorsIcon, DropletIcon, BoxIcon, RecycleIcon, TrashIcon];
    return icons[index % icons.length];
  };

  // Helper function to assign colors to API services
  const getServiceColor = (index: number) => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-amber-500', 'bg-teal-500', 'bg-red-500'];
    return colors[index % colors.length];
  };

  // Use only API services
  const services = mapApiServicesToUI(apiServices);
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  const itemVariants = {
    hidden: {
      y: 20,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };
  const handleServiceClick = (service: Service) => {
    setSelectedService(service);
  };
  
  const closeServiceDetails = () => {
    setSelectedService(null);
  };

  const handleBookService = (service: Service) => {
    if (isSignedIn) {
      // Only pass serializable data (no React components)
      const serializableService = {
        id: service.id,
        name: service.name,
        description: service.description,
        pricing: service.pricing,
        image: service.image,
        status: service.status
      };
      navigate('/book-service', { state: { service: serializableService } });
    }
  };
  return (
    <div className="bg-white">
      {/* Hero Section with Enhanced Design */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
          <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-2000"></div>
        </div>
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="h-full w-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold mb-8 border border-emerald-200"
            >
              <SparklesIcon className="w-4 h-4 mr-2" />
              Premium Eco-Friendly Services
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6">
              Our{' '}
              <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                Services
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed mb-12">
              Discover our comprehensive range of professional waste management and eco-friendly 
              cleaning services designed for modern Sri Lanka.
            </p>
            
            {/* Stats Row */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            >
              {[
                { number: '24/7', label: 'Service Available', icon: ClockIcon },
                { number: '100%', label: 'Eco-Certified', icon: LeafIcon },
                { number: '2', label: 'Provinces Covered', icon: MapPinIcon },
                { number: '4.8/5', label: 'Customer Rating', icon: StarIcon }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-3">
                    <div className="p-3 bg-white rounded-xl shadow-lg border border-slate-100">
                      <stat.icon className="w-6 h-6 text-emerald-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-slate-900">{stat.number}</div>
                  <div className="text-sm text-slate-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Services Section */}
      <section className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Loading State */}
          {loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col justify-center items-center py-20"
            >
              <div className="relative">
                <LoaderIcon className="h-12 w-12 animate-spin text-emerald-600" />
                <div className="absolute inset-0 h-12 w-12 border-4 border-emerald-200 rounded-full animate-pulse"></div>
              </div>
              <span className="ml-2 text-xl text-slate-600 mt-4 font-medium">Loading our amazing services...</span>
              <p className="text-slate-500 mt-2">Preparing the best eco-friendly solutions for you</p>
            </motion.div>
          )}

          {/* Error State */}
          {error && !loading && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-8 mb-8 shadow-lg"
            >
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-red-100 rounded-full">
                  <XIcon className="h-8 w-8 text-red-600" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-red-800 mb-2">Service Unavailable</h3>
                <p className="text-red-600 mb-4">{error}</p>
                <p className="text-red-500 text-sm mb-4">Please check your internet connection or try again.</p>
                <div className="flex justify-center space-x-4">
                  <button 
                    onClick={fetchServices}
                    className="bg-red-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-red-700 transition-colors"
                  >
                    Retry
                  </button>
                  <button 
                    onClick={() => window.location.reload()}
                    className="bg-gray-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-gray-700 transition-colors"
                  >
                    Refresh Page
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Services Status Banner */}
          {!loading && !error && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-6 mb-12 shadow-sm"
            >
              <div className="flex items-center justify-center">
                <div className="p-2 bg-emerald-100 rounded-full mr-3">
                  <CheckIcon className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="text-center">
                  <p className="text-emerald-800 font-semibold text-lg">
                    {services.length > 0 
                      ? `${services.length} Premium Services Available` 
                      : 'Service Catalog Loading'}
                  </p>
                  <p className="text-emerald-600 text-sm">All services are eco-certified and professionally managed</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* No Services State */}
          {!loading && !error && services.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <BoxIcon className="h-16 w-16 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-700 mb-4">No Services Available</h3>
              <p className="text-slate-500 mb-6 max-w-md mx-auto">
                We're currently updating our service catalog. Please check back soon for our amazing eco-friendly solutions.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.reload()}
                className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors shadow-lg"
              >
                Refresh Services
              </motion.button>
            </motion.div>
          )}

          {/* Services Grid */}
          {!loading && !error && services.length > 0 && (
            <>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center mb-16"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl mb-6 shadow-lg">
                  <TruckIcon className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                  Available Services
                </h2>
                <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
                  Choose from our range of professional, eco-friendly services designed to meet your specific needs
                </p>
              </motion.div>

              {/* Special Pickup Request Banner */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-12"
              >
                <div className="bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 rounded-3xl shadow-2xl overflow-hidden">
                  <div className="relative">
                    <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                    <div className="relative p-8 md:p-12">
                      <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="md:w-2/3 text-white mb-6 md:mb-0">
                          <div className="flex items-center mb-4">
                            <div className="bg-white bg-opacity-20 backdrop-blur-sm p-3 rounded-2xl mr-4">
                              <TruckIcon className="h-8 w-8 text-white" />
                            </div>
                            <div>
                              <h3 className="text-2xl md:text-3xl font-bold">Need a Custom Pickup?</h3>
                              <p className="text-emerald-100 font-medium">Schedule collection at your convenience</p>
                            </div>
                          </div>
                          <p className="text-emerald-100 text-lg leading-relaxed mb-6">
                            Have specific items that need collection? Request a custom pickup service and our professional team will handle everything for you. Perfect for bulky items, special materials, or scheduled collections.
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center text-emerald-100">
                              <CheckIcon className="h-5 w-5 mr-3 text-emerald-200" />
                              <span className="font-medium">Flexible Timing</span>
                            </div>
                            <div className="flex items-center text-emerald-100">
                              <CheckIcon className="h-5 w-5 mr-3 text-emerald-200" />
                              <span className="font-medium">Professional Team</span>
                            </div>
                            <div className="flex items-center text-emerald-100">
                              <CheckIcon className="h-5 w-5 mr-3 text-emerald-200" />
                              <span className="font-medium">Custom Requirements</span>
                            </div>
                          </div>
                        </div>
                        <div className="md:w-1/3 text-center">
                          {user ? (
                            <motion.button
                              whileHover={{ scale: 1.05, y: -2 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setShowPickupForm(true)}
                              className="bg-white text-emerald-600 px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-emerald-50"
                            >
                              <div className="flex items-center">
                                <TruckIcon className="h-6 w-6 mr-3" />
                                Request Pickup
                              </div>
                              <div className="text-sm text-emerald-500 mt-1">Start scheduling →</div>
                            </motion.button>
                          ) : (
                            <div className="space-y-3">
                              <SignInButton mode="modal">
                                <motion.button
                                  whileHover={{ scale: 1.05, y: -2 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="bg-white text-emerald-600 px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-emerald-50 w-full"
                                >
                                  <div className="flex items-center justify-center">
                                    <TruckIcon className="h-6 w-6 mr-3" />
                                    Request Pickup
                                  </div>
                                  <div className="text-sm text-emerald-500 mt-1">Sign in to schedule →</div>
                                </motion.button>
                              </SignInButton>
                              <p className="text-emerald-100 text-sm">
                                Sign in to access pickup scheduling
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                variants={containerVariants} 
                initial="hidden" 
                animate="visible" 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {/* Special Pickup Request Service Card */}
                {user && (
                  <motion.div 
                    variants={itemVariants}
                    whileHover={{ y: -10, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className="group bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl hover:from-emerald-600 hover:to-green-700 transition-all duration-300" 
                    onClick={() => setShowPickupForm(true)}
                  >
                    {/* Special Header with Icon */}
                    <div className="relative h-64 overflow-hidden bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600">
                      <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                      <div className="relative h-full flex items-center justify-center">
                        <div className="text-center text-white">
                          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-3xl p-12 shadow-2xl">
                            <TruckIcon className="h-24 w-24 text-white mx-auto mb-6" />
                            <h3 className="text-2xl font-bold">Request Pickup</h3>
                            <p className="text-emerald-100 mt-2">Schedule Collection</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Special Badge */}
                      <div className="absolute top-4 right-4">
                        <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                          🚚 NEW
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 text-white">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold group-hover:text-emerald-100 transition-colors">
                          Request Pickup Service
                        </h3>
                        <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-2">
                          <ArrowRightIcon className="h-5 w-5 text-white group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                      
                      <p className="text-emerald-100 mb-6 leading-relaxed">
                        Schedule a convenient pickup time for our team to collect your items. Perfect for custom collection needs.
                      </p>

                      {/* Special Features */}
                      <div className="space-y-2 mb-6">
                        <div className="flex items-center text-emerald-100">
                          <CheckIcon className="h-4 w-4 mr-2 text-emerald-200" />
                          <span className="text-sm">Flexible scheduling</span>
                        </div>
                        <div className="flex items-center text-emerald-100">
                          <CheckIcon className="h-4 w-4 mr-2 text-emerald-200" />
                          <span className="text-sm">Professional team</span>
                        </div>
                        <div className="flex items-center text-emerald-100">
                          <CheckIcon className="h-4 w-4 mr-2 text-emerald-200" />
                          <span className="text-sm">Custom requirements</span>
                        </div>
                      </div>

                      {/* Call to Action */}
                      <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 text-center">
                        <span className="text-white font-semibold">
                          Click to Schedule Pickup
                        </span>
                        <div className="flex items-center justify-center mt-2 text-emerald-200">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          <span className="text-sm">Available 24/7</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {services.map((service) => (
                  <motion.div 
                    key={service.id} 
                    variants={itemVariants}
                    whileHover={{ y: -10, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className="group bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden cursor-pointer hover:shadow-2xl hover:border-slate-200 transition-all duration-300" 
                    onClick={() => handleServiceClick(service)}
                  >
                    {/* Service Header */}
                    <div className="relative h-64 overflow-hidden">
                      {service.image ? (
                        <img 
                          src={service.image} 
                          alt={service.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const fallbackElement = e.currentTarget.nextElementSibling as HTMLElement;
                            if (fallbackElement) {
                              fallbackElement.style.display = 'flex';
                            }
                          }}
                        />
                      ) : null}
                      
                      {/* Fallback Design */}
                      <div 
                        className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 flex items-center justify-center" 
                        style={{ display: service.image ? 'none' : 'flex' }}
                      >
                        <div className="text-center text-white">
                          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                            <service.icon className="h-16 w-16 text-white mx-auto mb-4" />
                            <h3 className="text-xl font-bold">{service.name}</h3>
                          </div>
                        </div>
                      </div>
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Status Badge */}
                      <div className="absolute top-4 right-4">
                        <div className="bg-white bg-opacity-90 backdrop-blur-sm p-2 rounded-full shadow-lg">
                          <CheckIcon className="h-5 w-5 text-emerald-600" />
                        </div>
                      </div>
                      
                      {/* Eco Badge */}
                      <div className="absolute bottom-4 left-4">
                        <div className="bg-emerald-500 bg-opacity-90 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-semibold border border-white border-opacity-30">
                          🌱 Eco-Certified
                        </div>
                      </div>

                      {/* Hover Details */}
                      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                          <ArrowRightIcon className="h-5 w-5 text-emerald-600" />
                        </div>
                      </div>
                    </div>

                    {/* Service Content */}
                    <div className="p-6">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                          {service.name}
                        </h3>
                        <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">
                          {service.description}
                        </p>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="text-lg font-bold text-slate-900">
                          {service.pricing}
                        </div>
                        <motion.button 
                          whileHover={{ scale: 1.1 }} 
                          whileTap={{ scale: 0.9 }} 
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl flex items-center font-medium transition-colors shadow-md"
                        >
                          <span>View Details</span>
                          <ArrowRightIcon className="ml-2 h-4 w-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </>
          )}
        </div>
      </section>

      {/* Enhanced Service Details Modal */}
      {selectedService && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={closeServiceDetails}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full mx-auto overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={closeServiceDetails} 
              className="absolute top-6 right-6 bg-white bg-opacity-90 backdrop-blur-sm p-3 rounded-full hover:bg-opacity-100 transition-all z-10 shadow-lg group"
            >
              <XIcon className="h-6 w-6 text-slate-600 group-hover:text-slate-800" />
            </button>

            <div className="md:flex">
              {/* Image Section */}
              <div className="md:w-1/2 relative overflow-hidden h-80 md:h-auto">
                {selectedService.image ? (
                  <img 
                    src={selectedService.image} 
                    alt={selectedService.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 flex items-center justify-center h-full">
                    <div className="text-center text-white">
                      <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-3xl p-12 shadow-2xl">
                        <selectedService.icon className="h-24 w-24 text-white mx-auto mb-6" />
                        <h3 className="text-2xl font-bold">{selectedService.name}</h3>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Beautiful gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end">
                  <div className="p-8 w-full">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="bg-emerald-500 bg-opacity-90 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-semibold">
                        🌱 Eco-Certified Service
                      </div>
                      <div className="bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-semibold">
                        ⭐ Premium Quality
                      </div>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-2">
                      {selectedService.name}
                    </h3>
                    <p className="text-emerald-200 font-medium">
                      Professional • Reliable • Sustainable
                    </p>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="md:w-1/2 p-8">
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-emerald-100 rounded-xl mr-3">
                      <selectedService.icon className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900">Service Details</h4>
                      <p className="text-slate-500 text-sm">Everything you need to know</p>
                    </div>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{selectedService.description}</p>
                </div>

                <div className="mb-8">
                  <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                    <CheckIcon className="h-5 w-5 text-emerald-600 mr-2" />
                    Service Benefits
                  </h4>
                  <div className="space-y-3">
                    {selectedService.benefits?.map((benefit, index) => (
                      <motion.div 
                        key={index} 
                        initial={{ x: -20, opacity: 0 }} 
                        animate={{ x: 0, opacity: 1 }} 
                        transition={{ delay: index * 0.1 }} 
                        className="flex items-start bg-slate-50 rounded-xl p-3"
                      >
                        <CheckIcon className="h-5 w-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700 font-medium">{benefit}</span>
                      </motion.div>
                    )) || (
                      <motion.div className="flex items-start bg-slate-50 rounded-xl p-3">
                        <CheckIcon className="h-5 w-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700 font-medium">Contact us for detailed service information</span>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Pricing and Action */}
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-200">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-slate-600 text-sm font-medium">Service Price</p>
                      <div className="text-2xl font-bold text-slate-900">
                        {selectedService.pricing}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center text-emerald-600 text-sm font-medium mb-2">
                        <StarIcon className="h-4 w-4 mr-1" />
                        <span>4.8/5 Rating</span>
                      </div>
                      <div className="flex items-center text-emerald-600 text-sm font-medium">
                        <ShieldCheckIcon className="h-4 w-4 mr-1" />
                        <span>Guaranteed Quality</span>
                      </div>
                    </div>
                  </div>
                  
                  {isSignedIn ? (
                    <motion.button 
                      whileHover={{ scale: 1.02 }} 
                      whileTap={{ scale: 0.98 }} 
                      className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center shadow-lg transition-all duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookService(selectedService);
                      }}
                    >
                      <span>Book This Service Now</span>
                      <ArrowRightIcon className="ml-2 h-5 w-5" />
                    </motion.button>
                  ) : (
                    <SignInButton mode="modal">
                      <motion.button 
                        whileHover={{ scale: 1.02 }} 
                        whileTap={{ scale: 0.98 }} 
                        className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center shadow-lg transition-all duration-300"
                      >
                        <span>Sign In to Book Service</span>
                        <ArrowRightIcon className="ml-2 h-5 w-5" />
                      </motion.button>
                    </SignInButton>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Why Choose EcoClean Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m0 0h100v100h-100z' fill='none'/%3E%3Cpath d='m0 0 50 50-50 50v-100' fill='%23000' fill-opacity='0.03'/%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-6 shadow-lg">
              <TrophyIcon className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Why Choose EcoClean?
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              We're not just another service provider. We're your partner in creating 
              a sustainable future for Sri Lanka.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Eco-Certified Excellence',
                description: 'All our services follow internationally certified sustainable practices that protect our environment.',
                icon: LeafIcon,
                color: 'from-emerald-400 to-green-600',
                bgColor: 'bg-emerald-50',
                iconColor: 'text-emerald-600'
              },
              {
                title: 'Smart Reward System',
                description: 'Earn EcoPoints with every service that can be redeemed for discounts and eco-friendly products.',
                icon: SparklesIcon,
                color: 'from-purple-400 to-violet-600',
                bgColor: 'bg-purple-50',
                iconColor: 'text-purple-600'
              },
              {
                title: 'Transparent Pricing',
                description: 'Clear, upfront pricing with no hidden fees or surprise charges. What you see is what you pay.',
                icon: BadgeCheckIcon,
                color: 'from-blue-400 to-blue-600',
                bgColor: 'bg-blue-50',
                iconColor: 'text-blue-600'
              },
              {
                title: 'Community Impact',
                description: 'A portion of our profits goes toward community environmental initiatives and local sustainability projects.',
                icon: HeartIcon,
                color: 'from-pink-400 to-rose-600',
                bgColor: 'bg-pink-50',
                iconColor: 'text-pink-600'
              }
            ].map((feature, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group bg-white rounded-2xl shadow-lg p-8 border border-slate-100 hover:shadow-2xl hover:border-slate-200 transition-all duration-300"
              >
                <div className={`${feature.bgColor} p-4 rounded-2xl w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`h-8 w-8 ${feature.iconColor}`} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-green-700 to-teal-800"></div>
        
        {/* Overlay Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M30 30c0-6.627-5.373-12-12-12s-12 5.373-12 12 5.373 12 12 12 12-5.373 12-12zm12 0c0-6.627-5.373-12-12-12s-12 5.373-12 12 5.373 12 12 12 12-5.373 12-12z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white bg-opacity-5 rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-white bg-opacity-5 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-white bg-opacity-5 rounded-full animate-pulse delay-2000"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 text-white text-sm font-semibold mb-8"
            >
              <ZapIcon className="w-4 h-4 mr-2" />
              Ready to Get Started?
            </motion.div>

            <motion.h2 
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
            >
              Ready to Make Your Community{' '}
              <span className="text-emerald-200">Cleaner</span>?
            </motion.h2>
            
            <motion.p 
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl text-emerald-100 mb-12 max-w-4xl mx-auto leading-relaxed"
            >
              Join our mission to create a sustainable Sri Lanka. Book your first service today 
              and get 20% off with our eco-starter package!
            </motion.p>
            
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              {isSignedIn ? (
                <motion.div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    to="/dashboard" 
                    className="group relative inline-flex items-center px-8 py-4 bg-white text-emerald-700 font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center">
                      Go to Dashboard
                      <motion.svg 
                        className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </motion.svg>
                    </span>
                  </Link>
                  
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    href="tel:+94112345678"
                    className="inline-flex items-center px-8 py-4 border-2 border-white border-opacity-30 text-white font-semibold rounded-2xl backdrop-blur-sm hover:bg-white hover:bg-opacity-10 transition-all duration-300"
                  >
                    <PhoneIcon className="w-5 h-5 mr-2" />
                    Call Now
                  </motion.a>
                </motion.div>
              ) : (
                <motion.div className="flex flex-col sm:flex-row gap-4">
                  <SignInButton mode="modal">
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="group relative inline-flex items-center px-8 py-4 bg-white text-emerald-700 font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center">
                        Get Started Today
                        <motion.svg 
                          className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </motion.svg>
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-green-50 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                    </motion.button>
                  </SignInButton>
                  
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    href="tel:+94112345678"
                    className="inline-flex items-center px-8 py-4 border-2 border-white border-opacity-30 text-white font-semibold rounded-2xl backdrop-blur-sm hover:bg-white hover:bg-opacity-10 transition-all duration-300"
                  >
                    <PhoneIcon className="w-5 h-5 mr-2" />
                    Call Now
                  </motion.a>
                </motion.div>
              )}
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-16 flex flex-wrap justify-center items-center gap-8 text-emerald-200"
            >
              <div className="flex items-center">
                <StarIcon className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">4.8/5 Customer Rating</span>
              </div>
              <div className="flex items-center">
                <ShieldCheckIcon className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">100% Eco-Certified</span>
              </div>
              <div className="flex items-center">
                <UsersIcon className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">150+ Happy Customers</span>
              </div>
              <div className="flex items-center">
                <ClockIcon className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">24/7 Support Available</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pickup Request Form Modal */}
      {showPickupForm && <PickupRequestForm onClose={() => setShowPickupForm(false)} />}
    </div>
  );
};

// Pickup Request Form Component
const PickupRequestForm = ({ onClose }: { onClose: () => void }) => {
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
  const [alerts, setAlerts] = useState<Array<{id: string, type: 'success' | 'error' | 'warning' | 'info', title: string, message: string}>>([]);
  const { getToken } = useAuth();

  // Helper function to show alerts
  const showAlert = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => {
    const id = Date.now().toString();
    setAlerts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setAlerts(prev => prev.filter(alert => alert.id !== id));
    }, 5000);
  };

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
      if (file.size > 5 * 1024 * 1024) {
        showAlert('error', 'File Too Large', 'Please select an image smaller than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        showAlert('error', 'Invalid File Type', 'Please select a valid image file');
        return;
      }

      setSelectedImage(file);
      
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

    if (!selectedImage) {
      showAlert('error', 'Validation Error', 'Please upload an image of the items to be picked up');
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
        
        // Close modal after 2 seconds
        setTimeout(() => {
          onClose();
        }, 2000);
        
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Toast Alerts */}
        <div className="fixed top-4 right-4 z-50 space-y-3">
          {alerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              className={`border rounded-lg p-4 shadow-lg max-w-md ${
                alert.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
                alert.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
                alert.type === 'warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
                'bg-blue-50 border-blue-200 text-blue-800'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {alert.type === 'success' && <CheckCircleIcon className="h-5 w-5 text-green-600" />}
                  {alert.type === 'error' && <XCircleIcon className="h-5 w-5 text-red-600" />}
                  {alert.type === 'warning' && <AlertCircleIcon className="h-5 w-5 text-yellow-600" />}
                  {alert.type === 'info' && <AlertCircleIcon className="h-5 w-5 text-blue-600" />}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{alert.title}</h4>
                  <p className="text-sm mt-1">{alert.message}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-green-600 px-8 py-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Request Pickup Service</h2>
              <p className="text-emerald-100 mt-1">Schedule a convenient pickup time</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-emerald-200 transition-colors"
            >
              <XCircleIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
              Personal Information
            </h3>
            
            {/* Name Field */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <UserIcon className="h-4 w-4 mr-2 text-emerald-600" />
                Full Name *
              </label>
              <input
                type="text"
                value={formData.userName}
                onChange={(e) => handleInputChange('userName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Contact Field */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <PhoneIcon className="h-4 w-4 mr-2 text-emerald-600" />
                Contact Number *
              </label>
              <input
                type="tel"
                value={formData.contact}
                onChange={(e) => handleInputChange('contact', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
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
                <MapPinIcon className="h-4 w-4 mr-2 text-emerald-600" />
                Pickup Location *
              </label>
              <textarea
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all resize-none"
                rows={3}
                placeholder="Enter complete pickup address with landmarks"
                required
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <CalendarIcon className="h-4 w-4 mr-2 text-emerald-600" />
                  Pickup Date *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <ClockIcon className="h-4 w-4 mr-2 text-emerald-600" />
                  Pickup Time *
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                  required
                />
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
              Item Information (Required)
            </h3>
            
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <ImageIcon className="h-4 w-4 mr-2 text-emerald-600" />
                Upload Image *
              </label>
              <p className="text-xs text-gray-500">
                Upload an image to help us understand what needs to be picked up (Max 5MB) - Required
              </p>
              
              {!imagePreview ? (
                <div className="border-2 border-dashed border-red-300 rounded-lg p-6 text-center hover:border-emerald-400 transition-colors bg-red-50">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                    required
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center space-y-2"
                  >
                    <UploadIcon className="h-8 w-8 text-red-500" />
                    <span className="text-sm text-red-600 font-medium">Click to upload image *</span>
                    <span className="text-xs text-red-500">PNG, JPG, GIF up to 5MB - REQUIRED</span>
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

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className={`w-full flex items-center justify-center px-6 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white hover:shadow-xl'
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
      </motion.div>
    </motion.div>
  );
};
export default Services;
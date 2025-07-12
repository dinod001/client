import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LeafIcon, UserIcon, MailIcon, LockIcon, HomeIcon, PhoneIcon, CheckCircleIcon, ArrowRightIcon, EyeIcon, EyeOffIcon, AlertCircleIcon } from 'lucide-react';
const Register = () => {
  const navigate = useNavigate();
  const [formStep, setFormStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const handleChange = e => {
    const {
      name,
      value,
      type,
      checked
    } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  const validateStep = () => {
    const newErrors = {};
    if (formStep === 0) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    } else if (formStep === 1) {
      if (!formData.address.trim()) newErrors.address = 'Address is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
    } else if (formStep === 2) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords don't match";
      }
      if (!formData.agreeTerms) {
        newErrors.agreeTerms = 'You must agree to the terms and conditions';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const nextStep = () => {
    if (validateStep()) {
      setFormStep(prev => prev + 1);
    }
  };
  const prevStep = () => {
    setFormStep(prev => prev - 1);
  };
  const handleSubmit = e => {
    e.preventDefault();
    if (validateStep()) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        setSuccess(true);
        // Redirect to login after showing success message
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }, 1500);
    }
  };
  const formVariants = {
    hidden: {
      opacity: 0,
      x: -20
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5
      }
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: {
        duration: 0.3
      }
    }
  };
  const bubbleVariants = {
    initial: {
      scale: 0,
      opacity: 0
    },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20
      }
    }
  };
  const progressSteps = [{
    name: 'Personal Info',
    icon: UserIcon
  }, {
    name: 'Address',
    icon: HomeIcon
  }, {
    name: 'Security',
    icon: LockIcon
  }];
  return <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Registration Card */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5
      }} className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 md:p-8">
            <div className="flex items-center mb-4">
              <motion.div animate={{
              rotate: [0, 10, -10, 0]
            }} transition={{
              repeat: Infinity,
              duration: 2,
              ease: 'easeInOut'
            }} className="bg-white bg-opacity-20 p-3 rounded-full mr-3">
                <LeafIcon className="h-8 w-8 text-white" />
              </motion.div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Join EcoClean
              </h2>
            </div>
            <p className="text-green-100 text-lg">
              Create your account and start making a difference today!
            </p>
          </div>
          {/* Progress Bar */}
          <div className="px-6 pt-6 md:px-8">
            <div className="flex justify-between mb-8">
              {progressSteps.map((step, i) => <div key={i} className="flex flex-col items-center">
                  <motion.div variants={bubbleVariants} initial="initial" animate={formStep >= i ? 'animate' : 'initial'} className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${formStep >= i ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {formStep > i ? <CheckCircleIcon className="h-6 w-6" /> : <step.icon className="h-6 w-6" />}
                  </motion.div>
                  <span className={`text-sm font-medium ${formStep >= i ? 'text-green-600' : 'text-gray-500'}`}>
                    {step.name}
                  </span>
                </div>)}
            </div>
          </div>
          {/* Form */}
          <div className="px-6 pb-8 md:px-8">
            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {/* Step 1: Personal Information */}
                {formStep === 0 && <motion.div key="step1" variants={formVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                          First Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <UserIcon className="h-5 w-5 text-gray-400" />
                          </div>
                          <motion.input whileFocus={{
                        scale: 1.01
                      }} type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} className={`pl-10 w-full py-3 border ${errors.firstName ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-green-500 focus:border-green-500`} placeholder="John" />
                        </div>
                        {errors.firstName && <p className="mt-1 text-sm text-red-600">
                            {errors.firstName}
                          </p>}
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <UserIcon className="h-5 w-5 text-gray-400" />
                          </div>
                          <motion.input whileFocus={{
                        scale: 1.01
                      }} type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} className={`pl-10 w-full py-3 border ${errors.lastName ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-green-500 focus:border-green-500`} placeholder="Doe" />
                        </div>
                        {errors.lastName && <p className="mt-1 text-sm text-red-600">
                            {errors.lastName}
                          </p>}
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MailIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <motion.input whileFocus={{
                      scale: 1.01
                    }} type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={`pl-10 w-full py-3 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-green-500 focus:border-green-500`} placeholder="john.doe@example.com" />
                      </div>
                      {errors.email && <p className="mt-1 text-sm text-red-600">
                          {errors.email}
                        </p>}
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <PhoneIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <motion.input whileFocus={{
                      scale: 1.01
                    }} type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className={`pl-10 w-full py-3 border ${errors.phone ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-green-500 focus:border-green-500`} placeholder="+94 71 234 5678" />
                      </div>
                      {errors.phone && <p className="mt-1 text-sm text-red-600">
                          {errors.phone}
                        </p>}
                    </div>
                    <div className="pt-4">
                      <motion.button whileHover={{
                    scale: 1.02
                  }} whileTap={{
                    scale: 0.98
                  }} type="button" onClick={nextStep} className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        <span>Continue</span>
                        <ArrowRightIcon className="ml-2 h-5 w-5" />
                      </motion.button>
                    </div>
                  </motion.div>}
                {/* Step 2: Address */}
                {formStep === 1 && <motion.div key="step2" variants={formVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      Your Address
                    </h3>
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <HomeIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <motion.input whileFocus={{
                      scale: 1.01
                    }} type="text" id="address" name="address" value={formData.address} onChange={handleChange} className={`pl-10 w-full py-3 border ${errors.address ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-green-500 focus:border-green-500`} placeholder="123 Green Street" />
                      </div>
                      {errors.address && <p className="mt-1 text-sm text-red-600">
                          {errors.address}
                        </p>}
                    </div>
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <HomeIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <motion.input whileFocus={{
                      scale: 1.01
                    }} type="text" id="city" name="city" value={formData.city} onChange={handleChange} className={`pl-10 w-full py-3 border ${errors.city ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-green-500 focus:border-green-500`} placeholder="Colombo" />
                      </div>
                      {errors.city && <p className="mt-1 text-sm text-red-600">
                          {errors.city}
                        </p>}
                    </div>
                    <div className="pt-4 flex justify-between">
                      <motion.button whileHover={{
                    scale: 1.02
                  }} whileTap={{
                    scale: 0.98
                  }} type="button" onClick={prevStep} className="flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        Back
                      </motion.button>
                      <motion.button whileHover={{
                    scale: 1.02
                  }} whileTap={{
                    scale: 0.98
                  }} type="button" onClick={nextStep} className="flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        <span>Continue</span>
                        <ArrowRightIcon className="ml-2 h-5 w-5" />
                      </motion.button>
                    </div>
                  </motion.div>}
                {/* Step 3: Security */}
                {formStep === 2 && <motion.div key="step3" variants={formVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      Create Password
                    </h3>
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <LockIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <motion.input whileFocus={{
                      scale: 1.01
                    }} type={showPassword ? 'text' : 'password'} id="password" name="password" value={formData.password} onChange={handleChange} className={`pl-10 w-full py-3 border ${errors.password ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-green-500 focus:border-green-500 pr-10`} placeholder="••••••••" />
                        <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <EyeOffIcon className="h-5 w-5 text-gray-400" /> : <EyeIcon className="h-5 w-5 text-gray-400" />}
                        </button>
                      </div>
                      {errors.password && <p className="mt-1 text-sm text-red-600">
                          {errors.password}
                        </p>}
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <LockIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <motion.input whileFocus={{
                      scale: 1.01
                    }} type={showConfirmPassword ? 'text' : 'password'} id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className={`pl-10 w-full py-3 border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-green-500 focus:border-green-500 pr-10`} placeholder="••••••••" />
                        <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                          {showConfirmPassword ? <EyeOffIcon className="h-5 w-5 text-gray-400" /> : <EyeIcon className="h-5 w-5 text-gray-400" />}
                        </button>
                      </div>
                      {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">
                          {errors.confirmPassword}
                        </p>}
                    </div>
                    <div className="mt-4">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input id="agreeTerms" name="agreeTerms" type="checkbox" checked={formData.agreeTerms} onChange={handleChange} className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="agreeTerms" className="font-medium text-gray-700">
                            I agree to the{' '}
                            <a href="#" className="text-green-600 hover:text-green-500">
                              Terms and Conditions
                            </a>{' '}
                            and{' '}
                            <a href="#" className="text-green-600 hover:text-green-500">
                              Privacy Policy
                            </a>
                          </label>
                        </div>
                      </div>
                      {errors.agreeTerms && <p className="mt-1 text-sm text-red-600">
                          {errors.agreeTerms}
                        </p>}
                    </div>
                    <div className="pt-4 flex justify-between">
                      <motion.button whileHover={{
                    scale: 1.02
                  }} whileTap={{
                    scale: 0.98
                  }} type="button" onClick={prevStep} className="flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        Back
                      </motion.button>
                      <motion.button whileHover={{
                    scale: 1.02
                  }} whileTap={{
                    scale: 0.98
                  }} type="submit" disabled={isLoading} className={`flex justify-center items-center py-3 px-6 border border-transparent rounded-lg shadow-sm text-white ${isLoading ? 'bg-green-500' : 'bg-green-600 hover:bg-green-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}>
                        {isLoading ? <>
                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Registering...</span>
                          </> : <span>Complete Registration</span>}
                      </motion.button>
                    </div>
                  </motion.div>}
                {/* Success Message */}
                {success && <motion.div key="success" initial={{
                opacity: 0,
                scale: 0.8
              }} animate={{
                opacity: 1,
                scale: 1
              }} transition={{
                duration: 0.5,
                type: 'spring'
              }} className="text-center py-8">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                      <CheckCircleIcon className="h-10 w-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      Registration Successful!
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Your account has been created. Redirecting to login...
                    </p>
                    <div className="w-16 h-1 bg-green-500 mx-auto animate-pulse"></div>
                  </motion.div>}
              </AnimatePresence>
            </form>
          </div>
        </motion.div>
        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>;
};
export default Register;
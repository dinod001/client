import React from 'react';
import { motion } from 'framer-motion';
import { LeafIcon, RecycleIcon, TruckIcon, HeartIcon, UsersIcon, TrophyIcon, GlobeIcon, CheckCircleIcon, StarIcon, ShieldCheckIcon } from 'lucide-react';
const About = () => {
  const fadeInUp = {
    hidden: {
      opacity: 0,
      y: 60
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  };
  const teamMembers = [{
    name: 'Kaveesha Liyanage',
    role: 'Founder & CEO',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    quote: "We're building something special - a waste management service that Sri Lanka deserves!",
    color: 'bg-gradient-to-br from-emerald-400 to-green-500',
    expertise: 'Environmental Innovation & Business Leadership'
  }, {
    name: 'Heshan Asmadala',
    role: 'Co-Founder & Operations',
    avatar: 'https://randomuser.me/api/portraits/men/44.jpg',
    quote: 'Every customer interaction is an opportunity to make a positive impact.',
    color: 'bg-gradient-to-br from-blue-400 to-indigo-500',
    expertise: 'Operations Management & Customer Experience'
  }, {
    name: 'Mohamed Nusry',
    role: 'Co-Founder & Strategy',
    avatar: 'https://randomuser.me/api/portraits/men/68.jpg',
    quote: 'Strategic thinking and efficient processes make environmental responsibility achievable.',
    color: 'bg-gradient-to-br from-purple-400 to-violet-500',
    expertise: 'Business Strategy & Process Optimization'
  }, {
    name: 'Dino Imanjith',
    role: 'Co-Founder & Logistics',
    avatar: 'https://randomuser.me/api/portraits/men/65.jpg',
    quote: 'Efficient logistics is the backbone of reliable waste management service.',
    color: 'bg-gradient-to-br from-amber-400 to-orange-500',
    expertise: 'Logistics Management & Fleet Operations'
  }];

  const stats = [
    { number: '500+', label: 'Waste Collections', icon: TruckIcon },
    { number: '150+', label: 'Happy Customers', icon: UsersIcon },
    { number: '2', label: 'Provinces Covered', icon: GlobeIcon },
    { number: '90%', label: 'Recycling Rate', icon: RecycleIcon }
  ];

  const values = [
    {
      title: 'Sustainability First',
      description: 'We prioritize environmental impact in every decision we make.',
      icon: LeafIcon,
      color: 'text-emerald-600'
    },
    {
      title: 'Reliable Service',
      description: 'Dependable waste collection services that you can count on every time.',
      icon: ShieldCheckIcon,
      color: 'text-blue-600'
    },
    {
      title: 'Community First',
      description: 'We build genuine partnerships with local communities for lasting impact.',
      icon: UsersIcon,
      color: 'text-purple-600'
    },
    {
      title: 'Rapid Growth',
      description: 'Growing fast while maintaining our commitment to quality and sustainability.',
      icon: TrophyIcon,
      color: 'text-indigo-600'
    }
  ];
  const milestones = [{
    year: '2024',
    title: 'EcoClean Founded',
    description: 'Started our journey with a vision to revolutionize waste management in Sri Lanka.',
    icon: LeafIcon,
    color: 'bg-emerald-100 text-emerald-600'
  }, {
    year: 'Q2 2024',
    title: 'First Operations',
    description: "Launched our first waste collection services in Western Province with 2 dedicated trucks.",
    icon: TruckIcon,
    color: 'bg-blue-100 text-blue-600'
  }, {
    year: 'Q3 2024',
    title: 'Service Optimization',
    description: 'Streamlined our collection routes and improved customer service processes.',
    icon: GlobeIcon,
    color: 'bg-purple-100 text-purple-600'
  }, {
    year: 'Q4 2024',
    title: 'Southern Expansion',
    description: 'Extended our services to Southern Province, serving more communities across two provinces.',
    icon: UsersIcon,
    color: 'bg-amber-100 text-amber-600'
  }, {
    year: 'Q1 2025',
    title: 'Recycling Partnership',
    description: 'Partnered with local recycling centers to maximize waste processing efficiency.',
    icon: RecycleIcon,
    color: 'bg-teal-100 text-teal-600'
  }, {
    year: 'Q2 2025',
    title: 'Growing Community',
    description: 'Reached 150+ satisfied customers and 500+ successful waste collections.',
    icon: HeartIcon,
    color: 'bg-pink-100 text-pink-600'
  }];
  return <div className="bg-white">
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
              <StarIcon className="w-4 h-4 mr-2" />
              New & Innovative Waste Management Service
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6">
              About{' '}
              <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                EcoClean
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed mb-12">
              A fresh approach to waste management in Sri Lanka, combining reliable service 
              with sustainable practices to create a cleaner future for our communities.
            </p>
            
            {/* Stats Row */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            >
              {stats.map((stat, index) => (
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

      {/* Mission Section with Professional Design */}
      <section className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl mb-6 shadow-lg">
              <HeartIcon className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Our Mission
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              To establish EcoClean as Sri Lanka's most trusted and innovative waste management service, 
              making environmental responsibility accessible and rewarding for every Sri Lankan.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            {/* Mission Content */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="space-y-8"
            >
              <div className="prose prose-lg text-slate-600">
                <p className="text-lg leading-relaxed">
                  Founded in 2024, EcoClean represents a new generation of environmental 
                  service companies in Sri Lanka. We started with a simple but powerful vision: 
                  to make waste management convenient, efficient, and environmentally responsible.
                </p>
                <p className="text-lg leading-relaxed">
                  As a startup, we're nimble, innovative, and deeply committed to building 
                  long-term relationships with our customers. Our approach focuses on 
                  reliable service delivery and effective waste management solutions that 
                  make a real difference in our communities.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4">
                {['Eco-Certified Operations', 'Community Focused', '24/7 Customer Care'].map((badge, index) => (
                  <div key={index} className="flex items-center px-4 py-2 bg-slate-50 rounded-full border border-slate-200">
                    <CheckCircleIcon className="w-4 h-4 text-emerald-500 mr-2" />
                    <span className="text-sm font-medium text-slate-700">{badge}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Values Grid */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-slate-200 transition-all duration-300"
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-50 group-hover:scale-110 transition-transform duration-300 mb-4`}>
                    <value.icon className={`h-6 w-6 ${value.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline Section with Enhanced Design */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m0 0h100v100h-100z' fill='none'/%3E%3Cpath d='m0 0 50 50-50 50v-100' fill='%23000' fill-opacity='0.03'/%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-6 shadow-lg">
              <TrophyIcon className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Our Journey
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              Our exciting journey from startup to Sri Lanka's emerging waste management leader
            </p>
          </motion.div>

          <div className="relative">
            {/* Enhanced Timeline Line */}
            <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 h-full">
              <div className="w-1 h-full bg-gradient-to-b from-emerald-200 via-blue-200 to-purple-200 rounded-full shadow-sm"></div>
            </div>
            
            <div className="space-y-16">
              {milestones.map((milestone, i) => (
                <motion.div 
                  key={i} 
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-50px' }}
                  variants={fadeInUp}
                  className={`flex flex-col lg:flex-row items-center ${i % 2 === 0 ? 'lg:flex-row-reverse' : ''}`}
                >
                  {/* Content Card */}
                  <div className="lg:w-5/12">
                    <motion.div 
                      whileHover={{ scale: 1.02, y: -5 }}
                      transition={{ duration: 0.3 }}
                      className={`bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:shadow-2xl transition-all duration-300 ${i % 2 === 0 ? 'lg:mr-auto lg:ml-8' : 'lg:ml-auto lg:mr-8'}`}
                    >
                      <div className="flex items-center mb-6">
                        <div className={`${milestone.color} w-12 h-12 rounded-xl flex items-center justify-center mr-4 shadow-md`}>
                          <milestone.icon className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="text-3xl font-bold bg-gradient-to-r from-slate-600 to-slate-800 bg-clip-text text-transparent">
                            {milestone.year}
                          </div>
                          <h3 className="text-xl font-bold text-slate-900">
                            {milestone.title}
                          </h3>
                        </div>
                      </div>
                      <p className="text-slate-600 leading-relaxed">
                        {milestone.description}
                      </p>
                    </motion.div>
                  </div>

                  {/* Timeline Node */}
                  <div className="hidden lg:flex items-center justify-center lg:w-2/12">
                    <motion.div 
                      whileHover={{ scale: 1.3, rotate: 180 }}
                      transition={{ duration: 0.4 }}
                      className="relative z-10"
                    >
                      <div className="w-16 h-16 bg-white rounded-full shadow-lg border-4 border-slate-100 flex items-center justify-center">
                        <div className={`${milestone.color} w-8 h-8 rounded-full flex items-center justify-center`}>
                          <milestone.icon className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Spacer */}
                  <div className="lg:w-5/12"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section with Professional Cards */}
      <section className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl mb-6 shadow-lg">
              <UsersIcon className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Meet Our Leadership
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              The dynamic founding team building Sri Lanka's next-generation waste management service
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, i) => (
              <motion.div 
                key={i} 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    transition: { delay: i * 0.1, duration: 0.6 }
                  }
                }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="group bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-2xl hover:border-slate-200 transition-all duration-300"
              >
                {/* Header with Gradient */}
                <div className={`${member.color} h-32 relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ 
                        delay: 0.3 + i * 0.1, 
                        duration: 0.5, 
                        type: 'spring',
                        stiffness: 200
                      }}
                      className="relative"
                    >
                      <img 
                        src={member.avatar} 
                        alt={member.name}
                        className="w-24 h-24 rounded-2xl border-4 border-white shadow-xl object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full border-3 border-white flex items-center justify-center">
                        <CheckCircleIcon className="w-4 h-4 text-white" />
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Content */}
                <div className="pt-16 p-6 text-center">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-emerald-600 font-semibold text-sm mb-2">
                    {member.role}
                  </p>
                  <p className="text-xs text-slate-500 mb-4 font-medium">
                    {member.expertise}
                  </p>
                  <div className="bg-slate-50 rounded-xl p-4 mb-4">
                    <p className="text-slate-600 italic text-sm leading-relaxed">
                      "{member.quote}"
                    </p>
                  </div>
                  
                  {/* Social Links Placeholder */}
                  <div className="flex justify-center space-x-3">
                    {['linkedin', 'twitter', 'email'].map((social, idx) => (
                      <div key={idx} className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors duration-200 cursor-pointer">
                        <div className="w-4 h-4 bg-current rounded-sm opacity-60"></div>
                      </div>
                    ))}
                  </div>
                </div>
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
              <LeafIcon className="w-4 h-4 mr-2" />
              Be Part of Our Startup Journey
            </motion.div>

            <motion.h2 
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
            >
              Ready to Make a{' '}
              <span className="text-emerald-200">Difference</span>?
            </motion.h2>
            
            <motion.p 
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl text-emerald-100 mb-12 max-w-4xl mx-auto leading-relaxed"
            >
              Be among the first to experience Sri Lanka's most reliable waste management service. 
              Join our growing community of environmentally conscious customers!
            </motion.p>
            
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <motion.a
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                href="/register"
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
              </motion.a>
              
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                href="/services"
                className="inline-flex items-center px-8 py-4 border-2 border-white border-opacity-30 text-white font-semibold rounded-2xl backdrop-blur-sm hover:bg-white hover:bg-opacity-10 transition-all duration-300"
              >
                Learn More
              </motion.a>
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
                <span className="text-sm font-medium">4.8/5 Early Customer Rating</span>
              </div>
              <div className="flex items-center">
                <ShieldCheckIcon className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Eco-Certified</span>
              </div>
              <div className="flex items-center">
                <UsersIcon className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">150+ Happy Customers</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>;
};
export default About;
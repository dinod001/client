import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircleIcon, SendIcon, HelpCircleIcon, PhoneIcon, MailIcon, CheckCircleIcon, InfoIcon, FileIcon, XIcon } from 'lucide-react';
const Inquiry = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFaq, setShowFaq] = useState(null);
  const handleFileChange = e => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  const handleRemoveFile = () => {
    setFile(null);
  };
  const handleSubmit = e => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccess(true);
      // Reset form after showing success
      setTimeout(() => {
        setShowSuccess(false);
        setSubject('');
        setMessage('');
        setFile(null);
      }, 3000);
    }, 1500);
  };
  // FAQ data
  const faqs = [{
    id: 1,
    question: 'How do I reschedule a pickup?',
    answer: 'You can reschedule a pickup by going to your Dashboard, finding the scheduled pickup, and clicking the "Reschedule" button. Please note that pickups must be rescheduled at least 24 hours in advance.'
  }, {
    id: 2,
    question: 'What types of waste do you collect?',
    answer: 'We collect household waste, recyclables, garden waste, and electronic waste. Each type should be separated and properly bagged. For electronic waste, please ensure batteries are removed and placed in a separate container.'
  }, {
    id: 3,
    question: 'How do I earn reward points?',
    answer: 'You earn points for every successful pickup. The amount of points depends on the type and quantity of waste. Recyclables earn more points than general waste. You can also earn bonus points for consistent monthly pickups and referrals.'
  }, {
    id: 4,
    question: 'When will my reward points be credited?',
    answer: 'Reward points are usually credited to your account within 24 hours after a successful pickup or service. You can check your points balance and history in the Reward Points section.'
  }, {
    id: 5,
    question: 'How do I redeem my reward points?',
    answer: 'Go to the Reward Points section, browse the available rewards, and click "Redeem" on the reward you want. The points will be deducted from your balance and you\'ll receive instructions on how to claim your reward.'
  }];
  const toggleFaq = id => {
    if (showFaq === id) {
      setShowFaq(null);
    } else {
      setShowFaq(id);
    }
  };
  return <div className="max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        {showSuccess ? <motion.div key="success" initial={{
        opacity: 0,
        scale: 0.8
      }} animate={{
        opacity: 1,
        scale: 1
      }} exit={{
        opacity: 0,
        scale: 0.8
      }} transition={{
        type: 'spring',
        stiffness: 200,
        damping: 20
      }} className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircleIcon className="h-12 w-12 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Message Sent!
            </h2>
            <p className="text-gray-600 mb-6">
              Thank you for your inquiry. Our team will get back to you within
              24 hours.
            </p>
            <motion.div className="w-full h-2 bg-indigo-100 rounded-full overflow-hidden mb-6">
              <motion.div initial={{
            width: 0
          }} animate={{
            width: '100%'
          }} transition={{
            duration: 2.5
          }} className="h-full bg-indigo-500" />
            </motion.div>
            <p className="text-sm text-gray-500">
              You'll be redirected to the form in a moment...
            </p>
          </motion.div> : <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Contact Form */}
            <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5
        }} className="bg-white rounded-2xl shadow-xl overflow-hidden md:col-span-2">
              <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-6">
                <div className="flex items-center mb-2">
                  <div className="bg-white bg-opacity-20 p-2 rounded-full mr-3">
                    <MessageCircleIcon className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    Support Inquiry
                  </h2>
                </div>
                <p className="text-indigo-100">
                  Get help with your EcoClean services
                </p>
              </div>
              <div className="p-6">
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                        Subject
                      </label>
                      <select id="subject" value={subject} onChange={e => setSubject(e.target.value)} required className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 appearance-none">
                        <option value="">Select a subject</option>
                        <option value="pickup">Pickup Issue</option>
                        <option value="account">Account Question</option>
                        <option value="billing">Billing Inquiry</option>
                        <option value="feedback">Feedback/Suggestion</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Message
                      </label>
                      <motion.textarea whileFocus={{
                    scale: 1.01
                  }} id="message" value={message} onChange={e => setMessage(e.target.value)} required rows={6} className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" placeholder="Please describe your issue or question in detail..." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Attachments (Optional)
                      </label>
                      {!file ? <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <input type="file" id="file-upload" onChange={handleFileChange} className="hidden" />
                          <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                            <FileIcon className="h-8 w-8 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-500">
                              Click to upload a file
                            </span>
                            <span className="text-xs text-gray-400 mt-1">
                              PNG, JPG, PDF up to 10MB
                            </span>
                          </label>
                        </div> : <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
                          <div className="flex items-center">
                            <FileIcon className="h-5 w-5 text-indigo-500 mr-2" />
                            <span className="text-sm text-gray-700 truncate">
                              {file.name}
                            </span>
                          </div>
                          <button type="button" onClick={handleRemoveFile} className="text-gray-500 hover:text-gray-700">
                            <XIcon className="h-5 w-5" />
                          </button>
                        </div>}
                    </div>
                    <div className="pt-4">
                      <motion.button whileHover={{
                    scale: 1.02
                  }} whileTap={{
                    scale: 0.98
                  }} type="submit" disabled={isLoading} className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isLoading ? 'opacity-80 cursor-not-allowed' : ''}`}>
                        {isLoading ? <>
                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Sending...</span>
                          </> : <>
                            <SendIcon className="h-5 w-5 mr-2" />
                            <span>Send Message</span>
                          </>}
                      </motion.button>
                    </div>
                  </div>
                </form>
              </div>
            </motion.div>
            {/* Contact Info & FAQs */}
            <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.2,
          duration: 0.5
        }} className="space-y-6">
              {/* Contact Info */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-indigo-100 p-2 rounded-full mr-3 mt-0.5">
                      <PhoneIcon className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">
                        Phone Support
                      </h4>
                      <p className="text-gray-600">+94 11 234 5678</p>
                      <p className="text-sm text-gray-500">Mon-Fri, 8AM-6PM</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-indigo-100 p-2 rounded-full mr-3 mt-0.5">
                      <MailIcon className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Email</h4>
                      <p className="text-gray-600">support@ecoclean.lk</p>
                      <p className="text-sm text-gray-500">
                        We reply within 24 hours
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* FAQs */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <HelpCircleIcon className="h-5 w-5 text-indigo-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    Frequently Asked Questions
                  </h3>
                </div>
                <div className="space-y-3">
                  {faqs.map(faq => <div key={faq.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <motion.button whileHover={{
                  backgroundColor: 'rgba(79, 70, 229, 0.05)'
                }} onClick={() => toggleFaq(faq.id)} className="w-full text-left p-4 flex justify-between items-center">
                        <span className="font-medium text-gray-800">
                          {faq.question}
                        </span>
                        <motion.div animate={{
                    rotate: showFaq === faq.id ? 180 : 0
                  }} transition={{
                    duration: 0.3
                  }}>
                          <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </motion.div>
                      </motion.button>
                      <AnimatePresence>
                        {showFaq === faq.id && <motion.div initial={{
                    height: 0,
                    opacity: 0
                  }} animate={{
                    height: 'auto',
                    opacity: 1
                  }} exit={{
                    height: 0,
                    opacity: 0
                  }} transition={{
                    duration: 0.3
                  }} className="overflow-hidden">
                            <div className="p-4 pt-0 bg-gray-50 text-gray-600 text-sm">
                              {faq.answer}
                            </div>
                          </motion.div>}
                      </AnimatePresence>
                    </div>)}
                </div>
              </div>
            </motion.div>
          </div>}
      </AnimatePresence>
    </div>;
};
export default Inquiry;
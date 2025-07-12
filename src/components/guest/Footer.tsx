import React from 'react';
import { motion } from 'framer-motion';
import { FacebookIcon, TwitterIcon, InstagramIcon, LeafIcon, MailIcon, PhoneIcon, MapPinIcon } from 'lucide-react';
const Footer = () => {
  const iconVariants = {
    hover: {
      scale: 1.2,
      rotate: [0, 10, -10, 0],
      transition: {
        duration: 0.3
      }
    }
  };
  return <footer className="bg-gradient-to-r from-green-900 to-green-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & About */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <motion.div whileHover="hover" variants={iconVariants}>
                <LeafIcon className="h-6 w-6 text-green-300" />
              </motion.div>
              <span className="font-bold text-xl">EcoClean</span>
            </div>
            <p className="text-green-100 text-sm">
              Making Sri Lanka cleaner, one pickup at a time. Join our
              eco-friendly waste management revolution!
            </p>
          </div>
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {['Home', 'About', 'Services', 'Register', 'Login'].map(item => <li key={item}>
                    <a href={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="text-green-200 hover:text-white transition-colors duration-200">
                      {item}
                    </a>
                  </li>)}
            </ul>
          </div>
          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <PhoneIcon className="h-4 w-4 text-green-300" />
                <span className="text-green-100">+94 11 234 5678</span>
              </li>
              <li className="flex items-center space-x-2">
                <MailIcon className="h-4 w-4 text-green-300" />
                <span className="text-green-100">info@ecoclean.lk</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPinIcon className="h-4 w-4 text-green-300 mt-1" />
                <span className="text-green-100">
                  123 Green Street, Colombo, Sri Lanka
                </span>
              </li>
            </ul>
          </div>
          {/* Social & Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4 mb-6">
              {[FacebookIcon, TwitterIcon, InstagramIcon].map((Icon, i) => <motion.a key={i} href="#" whileHover="hover" variants={iconVariants} className="bg-green-700 p-2 rounded-full hover:bg-green-600 transition-colors">
                  <Icon className="h-5 w-5 text-white" />
                </motion.a>)}
            </div>
            <form className="mt-4">
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <div className="flex">
                <input type="email" id="email" placeholder="Your email" className="px-3 py-2 w-full text-sm text-gray-900 bg-white rounded-l-md" />
                <button type="submit" className="bg-green-500 text-white px-3 py-2 text-sm font-medium rounded-r-md hover:bg-green-400 transition-colors">
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-green-700 text-center text-green-300 text-sm">
          <p>© {new Date().getFullYear()} EcoClean. All rights reserved.</p>
        </div>
      </div>
    </footer>;
};
export default Footer;
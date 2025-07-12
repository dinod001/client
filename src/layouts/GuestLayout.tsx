import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import GuestNavbar from '../components/guest/GuestNavbar';
import Footer from '../components/guest/Footer';

const GuestLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-blue-50">
      <GuestNavbar />
      <motion.main 
        className="flex-grow" 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        exit={{ opacity: 0, y: -20 }} 
        transition={{ duration: 0.3 }}
      >
        <Outlet />
      </motion.main>
      <Footer />
    </div>
  );
};
export default GuestLayout;
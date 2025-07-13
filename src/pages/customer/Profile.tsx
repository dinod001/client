import { motion } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';
import { UserIcon, MailIcon, PhoneIcon } from 'lucide-react';

const Profile = () => {
  const { user: clerkUser } = useUser();

  return (
    <div className="max-w-4xl mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
      >
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-8">
          <div className="flex items-center mb-3">
            <div className="bg-white bg-opacity-30 p-3 rounded-xl mr-3 shadow-lg">
              <UserIcon className="h-7 w-7 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight drop-shadow">Your Profile</h2>
          </div>
          <p className="text-emerald-100 text-lg">Manage your account information</p>
        </div>

        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Profile Image */}
            <div className="md:w-1/3 flex flex-col items-center mb-6 md:mb-0">
              <div className="relative">
                <motion.div whileHover={{ scale: 1.07 }} className="w-36 h-36 rounded-full overflow-hidden border-4 border-emerald-500 shadow-xl ring-4 ring-emerald-200">
                  <img
                    src={clerkUser?.imageUrl || 'https://via.placeholder.com/128'}
                    alt={`${clerkUser?.firstName || ''} ${clerkUser?.lastName || ''}`}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mt-5">
                {clerkUser?.firstName} {clerkUser?.lastName}
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                Member since {clerkUser?.createdAt ? new Date(clerkUser.createdAt).toLocaleDateString() : 'Recently'}
              </p>
            </div>

            {/* Profile Information */}
            <div className="md:w-2/3 md:pl-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Email */}
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MailIcon className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div className="pl-10 py-2 text-gray-900 bg-gray-50 rounded-lg font-medium">
                      {clerkUser?.emailAddresses?.[0]?.emailAddress || 'No email set'}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">Email is managed by your account settings</p>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <PhoneIcon className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div className="pl-10 py-2 text-gray-900 bg-gray-50 rounded-lg font-medium">
                      {clerkUser?.phoneNumbers?.[0]?.phoneNumber || 'Not set'}
                    </div>
                  </div>
                </div>

                {/* Additional Info Note */}
                <div className="md:col-span-2 bg-blue-50 border border-blue-200 rounded-xl p-5 mt-2">
                  <div className="flex items-center">
                    <UserIcon className="h-5 w-5 text-blue-600 mr-2" />
                    <p className="text-sm text-blue-800 font-medium">
                      Your profile is managed through Clerk authentication.<br />
                      To update your name, email, or password, please use the user menu in the top right corner.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;

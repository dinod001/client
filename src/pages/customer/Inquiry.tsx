import React, { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { MessageCircleIcon, RefreshCwIcon, AlertCircleIcon } from 'lucide-react';

// Toast Notification Types
type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface Inquiry {
  _id: string;
  userId: string;
  subject: string;
  message: string;
  Repliedmessage: string | null;
  category: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const ToastNotification = ({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) => {
  const getColors = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-gradient-to-r from-green-400/80 to-green-600/80 text-white shadow-lg';
      case 'error':
        return 'bg-gradient-to-r from-red-400/80 to-red-600/80 text-white shadow-lg';
      default:
        return 'bg-gradient-to-r from-blue-400/80 to-blue-600/80 text-white shadow-lg';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`min-w-[320px] max-w-md w-full ${getColors()} border-0 rounded-2xl p-4 mb-2 backdrop-blur-sm flex items-center gap-3`}
    >
      <span>
        {toast.type === 'success' ? (
          <MessageCircleIcon className="h-6 w-6 text-white opacity-80" />
        ) : toast.type === 'error' ? (
          <AlertCircleIcon className="h-6 w-6 text-white opacity-80" />
        ) : (
          <MessageCircleIcon className="h-6 w-6 text-white opacity-80" />
        )}
      </span>
      <span className="flex-1 text-base font-semibold tracking-wide">{toast.message}</span>
      <span
        className="cursor-pointer text-white/70 hover:text-white/90 transition"
        onClick={() => onRemove(toast.id)}
        aria-label="Close"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </span>
    </motion.div>
  );
};

const ToastContainer = ({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) => (
  <div className="fixed top-4 right-4 z-[9999] space-y-2">
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {toasts.map((toast) => (
        <ToastNotification key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </motion.div>
  </div>
);

const Inquiry: React.FC = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showUpdate, setShowUpdate] = useState(false);
  const [updateId, setUpdateId] = useState<string | null>(null);
  const [updateSubject, setUpdateSubject] = useState('');
  const [updateMessage, setUpdateMessage] = useState('');
  const [updateCategory, setUpdateCategory] = useState('General');
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState<string | null>(null);
  const { getToken } = useAuth();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Toast helpers
  const addToast = (type: ToastType, message: string) => {
    const newToast: Toast = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      message,
    };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      removeToast(newToast.id);
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const fetchInquiries = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error('No authentication token available.');
      const response = await fetch('http://localhost:5000/api/user/get-all-inquiries', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok && data.success && Array.isArray(data.data)) {
        setInquiries(data.data);
      } else {
        setError(data.message || 'Failed to fetch inquiries.');
        addToast('error', data.message || 'Failed to fetch inquiries.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error. Please try again.');
      addToast('error', err instanceof Error ? err.message : 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error('No authentication token available.');
      const response = await fetch(`http://localhost:5000/api/user/delete-inquiry/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setInquiries((prev) => prev.filter((inq) => inq._id !== id));
        addToast('success', 'Inquiry deleted successfully.');
      } else {
        addToast('error', data.message || 'Failed to delete inquiry.');
      }
    } catch (err) {
      addToast('error', err instanceof Error ? err.message : 'Network error. Please try again.');
    } finally {
      setLoading(false);
      setShowConfirm(false);
      setDeleteId(null);
    }
  };

  const handleUpdate = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error('No authentication token available.');
      const response = await fetch(`http://localhost:5000/api/user/update-inquiry/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          UpdatedCustomerInquiry: {
            subject: updateSubject,
            message: updateMessage,
            category: updateCategory,
          },
        }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setInquiries((prev) =>
          prev.map((inq) =>
            inq._id === id ? { ...inq, subject: updateSubject, message: updateMessage, category: updateCategory } : inq
          )
        );
        addToast('success', 'Inquiry updated successfully.');
      } else {
        addToast('error', data.message || 'Failed to update inquiry.');
      }
    } catch (err) {
      addToast('error', err instanceof Error ? err.message : 'Network error. Please try again.');
    } finally {
      setLoading(false);
      setShowUpdate(false);
      setUpdateId(null);
      setUpdateSubject('');
      setUpdateMessage('');
      setUpdateCategory('General');
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center">
        <div className="bg-indigo-100 p-3 rounded-full mr-4">
          <MessageCircleIcon className="h-8 w-8 text-indigo-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800">Manage Inquiries</h1>
      </motion.div>

      <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-gray-500">View all your submitted inquiries and their details.</span>
        <button
          onClick={fetchInquiries}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition disabled:opacity-50"
          disabled={loading}
        >
          <RefreshCwIcon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>
      )}

      {showUpdate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border-0"
          >
            <MessageCircleIcon className="h-12 w-12 text-yellow-500 mb-4 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center tracking-wide">Update Inquiry</h2>
            <div className="space-y-5 w-full">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-300 transition-all duration-150 outline-none"
                  value={updateSubject}
                  onChange={(e) => setUpdateSubject(e.target.value)}
                  placeholder="Enter subject..."
                  required
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-300 transition-all duration-150 outline-none resize-none"
                  rows={4}
                  value={updateMessage}
                  onChange={(e) => setUpdateMessage(e.target.value)}
                  placeholder="Enter message..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-300 transition-all duration-150 outline-none"
                  value={updateCategory}
                  onChange={(e) => setUpdateCategory(e.target.value)}
                  required
                >
                  <option value="General">General</option>
                  <option value="Complaint">Complaint</option>
                  <option value="Suggestions">Suggestions</option>
                </select>
              </div>
              <div className="flex justify-center gap-4 mt-8">
                <button
                  onClick={() => updateId && handleUpdate(updateId)}
                  className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-xl font-bold shadow-lg hover:from-yellow-500 hover:to-yellow-700 transition-all duration-200 flex items-center gap-2 text-base"
                  disabled={loading}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20h9" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16.5 3.5a2.121 2.121 0 013 3L7 19H4v-3L16.5 3.5z"
                    />
                  </svg>
                  {loading ? 'Updating...' : 'Update'}
                </button>
                <button
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold shadow hover:bg-gray-200 transition-all duration-200 flex items-center gap-2 text-base"
                  onClick={() => {
                    setShowUpdate(false);
                    setUpdateId(null);
                    setUpdateSubject('');
                    setUpdateMessage('');
                    setUpdateCategory('General');
                  }}
                  disabled={loading}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full text-center border border-red-200"
          >
            <AlertCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Delete Inquiry?</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this inquiry? This action cannot be undone.</p>
            <div className="flex justify-center gap-4">
              <button
                className="px-5 py-2 bg-red-500 text-white rounded-lg font-semibold shadow hover:bg-red-600 transition disabled:opacity-50"
                onClick={() => deleteId && handleDelete(deleteId)}
                disabled={loading}
              >
                Yes, Delete
              </button>
              <button
                className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold shadow hover:bg-gray-300 transition disabled:opacity-50"
                onClick={() => {
                  setShowConfirm(false);
                  setDeleteId(null);
                }}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {showReplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full border-0"
          >
            <div className="flex flex-col items-center mb-4">
              <MessageCircleIcon className="h-10 w-10 text-green-500 mb-2" />
              <h2 className="text-xl font-bold text-gray-800 mb-2 text-center tracking-wide">Reply Message</h2>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-gray-800 max-h-96 overflow-y-auto text-base whitespace-pre-line">
              {replyMessage}
            </div>
            <div className="flex justify-center mt-8">
              <button
                className="px-6 py-2 bg-gradient-to-r from-gray-400 to-gray-600 text-white rounded-xl font-bold shadow hover:from-gray-500 hover:to-gray-700 transition-all duration-200 flex items-center gap-2 text-base"
                onClick={() => {
                  setShowReplyModal(false);
                  setReplyMessage(null);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {inquiries.length === 0 && !loading && (
        <div className="text-center text-gray-500">No inquiries found.</div>
      )}

      {inquiries.map((inquiry) => (
        <motion.div
          key={inquiry._id}
          whileHover={{ scale: 1.01, boxShadow: '0 4px 24px rgba(99,102,241,0.10)' }}
          className="bg-white rounded-2xl shadow-xl px-8 py-6 flex flex-col md:flex-row md:items-center border border-gray-100 hover:border-indigo-300 transition-all duration-200 mb-4"
        >
          <div className="flex items-center gap-4 mb-4 md:mb-0 md:w-1/4">
            <div className="bg-gradient-to-r from-indigo-400 to-indigo-600 p-3 rounded-full shadow">
              <MessageCircleIcon className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">{inquiry.subject}</h2>
              <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold shadow">
                {inquiry.category}
              </span>
            </div>
          </div>
          <div className="flex-1 md:mx-8 space-y-2">
            <div>
              <span className="text-gray-700 font-semibold">Message:</span>
              <p className="text-gray-800 line-clamp-3 mt-1">{inquiry.message}</p>
            </div>
            {inquiry.Repliedmessage && (
              <div className="mt-2">
                <button
                  className="px-5 py-2 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-xl font-bold shadow-lg hover:from-green-500 hover:to-green-700 transition-all duration-200 flex items-center gap-2 text-sm"
                  onClick={() => {
                    setReplyMessage(inquiry.Repliedmessage);
                    setShowReplyModal(true);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m6 0a6 6 0 11-12 0 6 6 0 0112 0z" />
                  </svg>
                  View Reply
                </button>
              </div>
            )}
          </div>
          <div className="flex flex-col items-end md:items-center md:w-32 gap-2 mt-4 md:mt-0">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold shadow ${
                inquiry.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-700'
                  : inquiry.status === 'resolved'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
            </span>
            <span className="text-xs text-gray-400">{new Date(inquiry.createdAt).toLocaleString()}</span>
            {!inquiry.Repliedmessage && (
              <div className="flex gap-2 mt-2">
                <button
                  className="px-5 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-xl font-bold shadow-lg hover:from-yellow-500 hover:to-yellow-700 transition-all duration-200 flex items-center gap-2 text-sm"
                  onClick={() => {
                    setShowUpdate(true);
                    setUpdateId(inquiry._id);
                    setUpdateSubject(inquiry.subject);
                    setUpdateMessage(inquiry.message);
                    setUpdateCategory(inquiry.category);
                  }}
                  disabled={loading}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20h9" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16.5 3.5a2.121 2.121 0 013 3L7 19H4v-3L16.5 3.5z"
                    />
                  </svg>
                  Update
                </button>
                <button
                  className="px-5 py-2 bg-gradient-to-r from-red-400 to-red-600 text-white rounded-xl font-bold shadow-lg hover:from-red-500 hover:to-red-700 transition-all duration-200 flex items-center gap-2 text-sm"
                  onClick={() => {
                    setShowConfirm(true);
                    setDeleteId(inquiry._id);
                  }}
                  disabled={loading}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Delete
                </button>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Inquiry;
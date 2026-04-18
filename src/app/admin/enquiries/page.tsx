'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminLayout } from '@/components/AdminLayout';
import { enquiryStorage } from '@/utils/enquiryStorage';
import { toast } from 'sonner';
import { Trash2, Eye, X } from 'lucide-react';

const AdminEnquiries = () => {
  const [items, setItems] = useState<any[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
  const [messageModal, setMessageModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const response = await fetch('/api/enquiries');
        if (response.ok) {
          const enquiries = await response.json();
          setItems(enquiries);
        } else {
          toast.error('Failed to fetch enquiries');
        }
      } catch (error) {
        console.error('Error fetching enquiries:', error);
        toast.error('Failed to fetch enquiries');
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiries();
  }, []);

  const refreshEnquiries = async () => {
    try {
      const response = await fetch('/api/enquiries');
      if (response.ok) {
        const enquiries = await response.json();
        setItems(enquiries);
      }
    } catch (error) {
      console.error('Error refreshing enquiries:', error);
    }
  };

  const toggleStatus = async (id: string) => {
    try {
      const enquiry = items.find(i => i._id === id);
      if (!enquiry) {
        console.error('Enquiry not found');
        return;
      }
      
      const newStatus = enquiry.status === 'New' ? 'Replied' : 'New';
      
      // Update via API
      const response = await fetch('/api/enquiries', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (response.ok) {
        // Update local state
        setItems(prev => prev.map(i => i._id === id ? { ...i, status: newStatus } : i));
        toast.success('Status updated successfully');
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const deleteEnquiry = async (id: string) => {
    try {
      // Delete via API
      const response = await fetch(`/api/enquiries?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Update local state
        setItems(prev => prev.filter(i => i._id !== id));
        toast.success('Enquiry deleted successfully');
      } else {
        toast.error('Failed to delete enquiry');
      }
    } catch (error) {
      console.error('Failed to delete enquiry:', error);
      toast.error('Failed to delete enquiry');
    }
  };

  const viewMessage = (enquiry: any) => {
    setSelectedMessage(enquiry);
    setMessageModal(true);
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-display font-bold gradient-text mb-6">Contact Enquiries</h1>
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left p-4 font-medium">Name</th>
                <th className="text-left p-4 font-medium hidden md:table-cell">Email</th>
                <th className="text-left p-4 font-medium">Message</th>
                <th className="text-left p-4 font-medium">Source</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-center p-4 font-medium">Action</th>
                <th className="text-center p-4 font-medium">Delete</th>
              </tr>
            </thead>
            <tbody>
              {items.map((e, i) => (
                <motion.tr key={e._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="p-4 font-medium">{e.name}</td>
                  <td className="p-4 text-foreground hidden md:table-cell">
                    <a 
                      href={`https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(e.email)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline hover:text-primary/80 transition-colors"
                      title="Compose email in Gmail"
                    >
                      {e.email}
                    </a>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-foreground max-w-xs truncate">{e.message}</span>
                      <button
                        onClick={() => viewMessage(e)}
                        className="p-1 rounded-lg hover:bg-primary/10 text-primary transition-colors flex-shrink-0"
                        title="View full message"
                      >
                        <Eye size={14} />
                      </button>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      e.source === 'contact' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {e.source === 'contact' ? 'Contact Form' : 'Quick Enquiry'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${e.status === 'New' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>{e.status}</span>
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => toggleStatus(e._id)} 
                      className="text-xs font-medium text-primary hover:text-primary/80 hover:underline px-3 py-1 rounded hover:bg-primary/10 transition-colors cursor-pointer border border-transparent hover:border-primary/20"
                      type="button"
                    >
                      Mark {e.status === 'New' ? 'Replied' : 'New'}
                    </button>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => deleteEnquiry(e._id)}
                      className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors flex items-center justify-center mx-auto"
                      title="Delete enquiry"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message Modal */}
      <AnimatePresence>
        {messageModal && selectedMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50"
            onClick={() => setMessageModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold">Enquiry Details</h2>
                <button 
                  onClick={() => setMessageModal(false)} 
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Name</label>
                    <p className="font-semibold text-foreground">{selectedMessage.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Email</label>
                    <p className="font-semibold text-foreground">{selectedMessage.email}</p>
                  </div>
                </div>
                
                {selectedMessage.phone && (
                  <div>
                    <label className="text-sm font-medium text-foreground">Phone</label>
                    <p className="font-semibold text-foreground">{selectedMessage.phone}</p>
                  </div>
                )}
                
                <div>
                  <label className="text-sm font-medium text-foreground">Date</label>
                  <p className="font-semibold text-foreground">{selectedMessage.date}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground">Status</label>
                  <div className="mt-1">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium inline-block ${
                      selectedMessage.status === 'New' 
                        ? 'bg-primary/10 text-primary' 
                        : 'bg-secondary/10 text-secondary'
                    }`}>
                      {selectedMessage.status}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground">Message</label>
                  <div className="mt-2 p-4 bg-gray-300 border border-gray-500 rounded-lg">
                    <p className="whitespace-pre-wrap text-gray-900">{selectedMessage.message}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground">Source</label>
                  <div className="mt-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedMessage.source === 'contact' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {selectedMessage.source === 'contact' ? 'Contact Form' : 'Quick Enquiry'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setMessageModal(false)}
                  className="px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    toggleStatus(selectedMessage._id);
                    setMessageModal(false);
                  }}
                  className="px-4 py-2 rounded-lg gradient-primary-bg text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  Mark {selectedMessage.status === 'New' ? 'Replied' : 'New'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminEnquiries;

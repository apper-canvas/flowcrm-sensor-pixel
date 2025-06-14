import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import StatusBadge from '@/components/molecules/StatusBadge';
import LoadingState from '@/components/molecules/LoadingState';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';
import { leadService, contactService } from '@/services';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const statuses = [
    { id: 'all', label: 'All Leads', count: 0 },
    { id: 'new', label: 'New', count: 0 },
    { id: 'contacted', label: 'Contacted', count: 0 },
    { id: 'qualified', label: 'Qualified', count: 0 },
    { id: 'converted', label: 'Converted', count: 0 }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [leadsData, contactsData] = await Promise.all([
        leadService.getAll(),
        contactService.getAll()
      ]);
      setLeads(leadsData);
      setContacts(contactsData);
    } catch (err) {
      setError(err.message || 'Failed to load leads');
      toast.error('Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  const getContactName = (contactId) => {
    const contact = contacts.find(c => c.id === contactId);
    return contact?.name || 'Unknown Contact';
  };

  const getContactCompany = (contactId) => {
    const contact = contacts.find(c => c.id === contactId);
    return contact?.company || 'Unknown Company';
  };

  const getFilteredLeads = () => {
    if (filterStatus === 'all') return leads;
    return leads.filter(lead => lead.status === filterStatus);
  };

  const getStatusCounts = () => {
    const counts = {
      all: leads.length,
      new: leads.filter(l => l.status === 'new').length,
      contacted: leads.filter(l => l.status === 'contacted').length,
      qualified: leads.filter(l => l.status === 'qualified').length,
      converted: leads.filter(l => l.status === 'converted').length
    };
    return counts;
  };

  const handleStatusUpdate = async (leadId, newStatus) => {
    try {
      await leadService.update(leadId, { status: newStatus });
      setLeads(prev => prev.map(lead => 
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      ));
      toast.success('Lead status updated successfully');
    } catch (error) {
      toast.error('Failed to update lead status');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="p-6">
        <LoadingState count={4} type="card" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState 
          message={error}
          onRetry={loadData}
        />
      </div>
    );
  }

  const filteredLeads = getFilteredLeads();
  const statusCounts = getStatusCounts();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-heading font-bold text-gray-900">
            Leads
          </h1>
          <p className="mt-1 text-gray-500">
            Track and manage your sales leads through the qualification process
          </p>
        </div>
      </motion.div>

      {/* Status Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="overflow-x-auto"
      >
        <div className="flex space-x-2 min-w-max pb-2">
          {statuses.map((status) => (
            <button
              key={status.id}
              onClick={() => setFilterStatus(status.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                filterStatus === status.id
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {status.label} ({statusCounts[status.id]})
            </button>
          ))}
        </div>
      </motion.div>

      {/* Leads Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {filteredLeads.length === 0 ? (
          leads.length === 0 ? (
            <EmptyState
              icon="Target"
              title="No leads yet"
              description="Start tracking your potential customers by adding leads to your pipeline"
              actionLabel="Add Lead"
              onAction={() => toast.info('Lead creation form coming soon')}
            />
          ) : (
            <EmptyState
              icon="Filter"
              title="No leads in this category"
              description={`No leads found with status "${filterStatus}"`}
            />
          )
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLeads.map((lead, index) => (
              <motion.div
                key={lead.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-lg transition-all">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-heading font-semibold text-gray-900 break-words">
                          {getContactName(lead.contactId)}
                        </h3>
                        <p className="text-sm text-gray-500 break-words">
                          {getContactCompany(lead.contactId)}
                        </p>
                      </div>
                      <StatusBadge status={lead.status} type="lead" />
                    </div>

                    {/* Value and Probability */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Lead Value</span>
                        <span className="font-semibold text-primary">
                          {formatCurrency(lead.value)}
                        </span>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Probability</span>
                          <span className="text-sm font-medium">{lead.probability}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary rounded-full h-2 transition-all"
                            style={{ width: `${lead.probability}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Source */}
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <ApperIcon name="MapPin" className="w-4 h-4" />
                      <span>Source: {lead.source}</span>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusUpdate(lead.id, e.target.value)}
                          className="text-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="qualified">Qualified</option>
                          <option value="converted">Converted</option>
                        </select>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          icon="Eye"
                          onClick={() => toast.info('Lead details coming soon')}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Leads;
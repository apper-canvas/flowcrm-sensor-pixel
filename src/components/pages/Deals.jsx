import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import LoadingState from '@/components/molecules/LoadingState';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';
import DealPipeline from '@/components/organisms/DealPipeline';
import DealForm from '@/components/organisms/DealForm';
import { dealService } from '@/services';

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('pipeline'); // 'pipeline' or 'list'
  const [showForm, setShowForm] = useState(false);
  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dealService.getAll();
      setDeals(data);
    } catch (err) {
      setError(err.message || 'Failed to load deals');
      toast.error('Failed to load deals');
    } finally {
      setLoading(false);
    }
};

  const handleDealSaved = async (savedDeal) => {
    setShowForm(false);
    await loadDeals(); // Refresh the deals list
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getTotalPipelineValue = () => {
    return deals.reduce((sum, deal) => sum + deal.value, 0);
  };

  const getClosedDeals = () => {
    return deals.filter(deal => deal.stage === 'closed');
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
          onRetry={loadDeals}
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-gray-200 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between"
        >
          <div>
            <h1 className="text-2xl font-heading font-bold text-gray-900">
              Sales Pipeline
            </h1>
            <p className="mt-1 text-gray-500">
              Track and manage deals through your sales process
            </p>
            
            {/* Pipeline Stats */}
            <div className="flex items-center space-x-6 mt-4">
              <div>
                <p className="text-sm text-gray-600">Total Pipeline</p>
                <p className="text-lg font-semibold text-primary">
                  {formatCurrency(getTotalPipelineValue())}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Closed Deals</p>
                <p className="text-lg font-semibold text-success">
                  {getClosedDeals().length} deals
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Deals</p>
                <p className="text-lg font-semibold text-info">
                  {deals.length - getClosedDeals().length} deals
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 lg:mt-0 flex items-center space-x-4">
            <div className="flex rounded-lg border border-gray-300">
              <button
                onClick={() => setViewMode('pipeline')}
                className={`px-4 py-2 text-sm font-medium rounded-l-lg transition-all ${
                  viewMode === 'pipeline'
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Pipeline View
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 text-sm font-medium rounded-r-lg border-l transition-all ${
                  viewMode === 'list'
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                List View
              </button>
            </div>
            
<Button
              variant="primary"
              icon="Plus"
              onClick={() => setShowForm(true)}
            >
              Add Deal
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {deals.length === 0 ? (
          <div className="p-6">
<EmptyState
              icon="Handshake"
              title="No deals yet"
              description="Start tracking your sales opportunities by adding deals to your pipeline"
              actionLabel="Add Deal"
              onAction={() => setShowForm(true)}
            />
          </div>
        ) : (
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {viewMode === 'pipeline' ? (
              <div className="p-6 h-full">
                <DealPipeline />
              </div>
            ) : (
              <div className="p-6">
                <div className="text-center py-12 text-gray-500">
                  <p>List view coming soon...</p>
                </div>
              </div>
            )}
          </motion.div>
        )}
)}
      </div>

      {/* Deal Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowForm(false);
              }
            }}
          >
            <DealForm
              onSave={handleDealSaved}
              onCancel={() => setShowForm(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Deals;
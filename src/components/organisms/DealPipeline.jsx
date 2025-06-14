import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import { dealService, contactService } from '@/services';

const DealPipeline = () => {
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);

  const stages = [
    { id: 'prospect', name: 'Prospect', color: 'bg-info' },
    { id: 'negotiation', name: 'Negotiation', color: 'bg-warning' },
    { id: 'closed', name: 'Closed', color: 'bg-success' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [dealsData, contactsData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll()
      ]);
      setDeals(dealsData);
      setContacts(contactsData);
    } catch (error) {
      toast.error('Failed to load pipeline data');
    } finally {
      setLoading(false);
    }
  };

  const getContactName = (contactId) => {
    const contact = contacts.find(c => c.id === contactId);
    return contact?.name || 'Unknown Contact';
  };

  const getDealsByStage = (stage) => {
    return deals.filter(deal => deal.stage === stage);
  };

  const handleDragStart = (e, deal) => {
    setDraggedItem(deal);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, targetStage) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem.stage === targetStage) {
      setDraggedItem(null);
      return;
    }

    try {
      await dealService.updateStage(draggedItem.id, targetStage);
      setDeals(prev => prev.map(deal => 
        deal.id === draggedItem.id 
          ? { ...deal, stage: targetStage }
          : deal
      ));
      toast.success(`Deal moved to ${targetStage}`);
    } catch (error) {
      toast.error('Failed to update deal stage');
    }
    
    setDraggedItem(null);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStageTotal = (stage) => {
    return getDealsByStage(stage).reduce((sum, deal) => sum + deal.value, 0);
  };

  if (loading) {
    return <div className="animate-pulse">Loading pipeline...</div>;
  }

  return (
    <div className="h-full overflow-x-auto">
      <div className="flex space-x-6 min-w-max pb-6">
        {stages.map((stage) => {
          const stageDeals = getDealsByStage(stage.id);
          const stageTotal = getStageTotal(stage.id);
          
          return (
            <div
              key={stage.id}
              className="flex-shrink-0 w-80"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              {/* Stage Header */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                    <h3 className="font-heading font-semibold text-gray-900">
                      {stage.name}
                    </h3>
                    <span className="text-sm text-gray-500">
                      ({stageDeals.length})
                    </span>
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-600">
                  Total: {formatCurrency(stageTotal)}
                </p>
              </div>

              {/* Deals List */}
              <div className="space-y-3 min-h-96">
                {stageDeals.map((deal, index) => (
                  <motion.div
                    key={deal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    draggable
                    onDragStart={(e) => handleDragStart(e, deal)}
                    className="cursor-move"
                  >
                    <Card className="p-4 hover:shadow-lg transition-all bg-white border-l-4 border-l-primary">
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-gray-900 break-words">
                            {deal.name}
                          </h4>
                          <p className="text-sm text-gray-500 break-words">
                            {getContactName(deal.contactId)}
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold text-primary">
                            {formatCurrency(deal.value)}
                          </span>
                          <span className="text-sm text-gray-500">
                            {deal.probability}% likely
                          </span>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary rounded-full h-2 transition-all"
                            style={{ width: `${deal.probability}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>
                            Close: {new Date(deal.closeDate).toLocaleDateString()}
                          </span>
                          <div className="flex items-center space-x-1">
                            <ApperIcon name="Calendar" className="w-3 h-3" />
                            <span>
                              {Math.ceil((new Date(deal.closeDate) - new Date()) / (1000 * 60 * 60 * 24))} days
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}

                {stageDeals.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <ApperIcon name="Plus" className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No deals in this stage</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DealPipeline;
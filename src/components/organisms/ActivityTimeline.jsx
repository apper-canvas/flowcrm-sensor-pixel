import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import { activityService } from '@/services';

const ActivityTimeline = ({ contactId, limit = 10 }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadActivities();
  }, [contactId]);

  const loadActivities = async () => {
    setLoading(true);
    try {
      const data = contactId 
        ? await activityService.getByContactId(contactId)
        : await activityService.getRecent(limit);
      setActivities(data);
    } catch (error) {
      console.error('Failed to load activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    const icons = {
      email: 'Mail',
      call: 'Phone',
      meeting: 'Users',
      note: 'FileText',
      task: 'CheckSquare'
    };
    return icons[type] || 'Activity';
  };

  const getActivityColor = (type) => {
    const colors = {
      email: 'bg-blue-100 text-blue-600',
      call: 'bg-green-100 text-green-600',
      meeting: 'bg-purple-100 text-purple-600',
      note: 'bg-yellow-100 text-yellow-600',
      task: 'bg-gray-100 text-gray-600'
    };
    return colors[type] || 'bg-gray-100 text-gray-600';
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse flex space-x-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {activities.map((activity, index) => (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex space-x-4"
        >
          <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
            <ApperIcon name={getActivityIcon(activity.type)} className="w-5 h-5" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 break-words">
                  {activity.description}
                </p>
                
                {activity.metadata && (
                  <div className="mt-1 text-xs text-gray-500 space-y-1">
                    {activity.metadata.subject && (
                      <p>Subject: {activity.metadata.subject}</p>
                    )}
                    {activity.metadata.duration && (
                      <p>Duration: {activity.metadata.duration}</p>
                    )}
                    {activity.metadata.outcome && (
                      <p>Outcome: {activity.metadata.outcome}</p>
                    )}
                  </div>
                )}
              </div>
              
              <time className="flex-shrink-0 text-xs text-gray-500 ml-4">
                {format(new Date(activity.timestamp), 'MMM d, h:mm a')}
              </time>
            </div>
          </div>
        </motion.div>
      ))}
      
      {activities.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <ApperIcon name="Activity" className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No activities found</p>
        </div>
      )}
    </div>
  );
};

export default ActivityTimeline;
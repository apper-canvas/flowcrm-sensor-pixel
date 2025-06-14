import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import LoadingState from '@/components/molecules/LoadingState';
import ErrorState from '@/components/molecules/ErrorState';
import ActivityTimeline from '@/components/organisms/ActivityTimeline';
import { dealService, contactService, taskService, leadService } from '@/services';

const Dashboard = () => {
  const [metrics, setMetrics] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [deals, contacts, tasks, leads] = await Promise.all([
        dealService.getAll(),
        contactService.getAll(),
        taskService.getAll(),
        leadService.getAll()
      ]);

      // Calculate metrics
      const totalPipelineValue = deals.reduce((sum, deal) => sum + deal.value, 0);
      const closedDeals = deals.filter(deal => deal.stage === 'closed');
      const closedValue = closedDeals.reduce((sum, deal) => sum + deal.value, 0);
      const conversionRate = deals.length > 0 ? (closedDeals.length / deals.length) * 100 : 0;
      const pendingTasks = tasks.filter(task => task.status === 'pending').length;
      const overdueTasksCount = tasks.filter(task => 
        task.status === 'pending' && new Date(task.dueDate) < new Date()
      ).length;

      setMetrics({
        totalPipelineValue,
        closedValue,
        conversionRate,
        totalContacts: contacts.length,
        totalDeals: deals.length,
        totalLeads: leads.length,
        pendingTasks,
        overdueTasksCount
      });
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
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
        <LoadingState count={6} type="card" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState 
          message={error}
          onRetry={loadDashboardData}
        />
      </div>
    );
  }

  const metricCards = [
    {
      title: 'Pipeline Value',
      value: formatCurrency(metrics.totalPipelineValue),
      icon: 'TrendingUp',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Closed Revenue',
      value: formatCurrency(metrics.closedValue),
      icon: 'DollarSign',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      title: 'Conversion Rate',
      value: `${metrics.conversionRate.toFixed(1)}%`,
      icon: 'Target',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10'
    },
    {
      title: 'Total Contacts',
      value: metrics.totalContacts.toString(),
      icon: 'Users',
      color: 'text-info',
      bgColor: 'bg-info/10'
    },
    {
      title: 'Active Deals',
      value: metrics.totalDeals.toString(),
      icon: 'Handshake',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      title: 'Pending Tasks',
      value: metrics.pendingTasks.toString(),
      subtitle: `${metrics.overdueTasksCount} overdue`,
      icon: 'CheckSquare',
      color: metrics.overdueTasksCount > 0 ? 'text-warning' : 'text-gray-600',
      bgColor: metrics.overdueTasksCount > 0 ? 'bg-warning/10' : 'bg-gray-100'
    }
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="gradient-header rounded-lg p-6 text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-heading font-bold mb-2">
            Sales Dashboard
          </h1>
          <p className="text-white/90">
            Welcome back! Here's your sales performance overview.
          </p>
        </motion.div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metricCards.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 hover:shadow-lg transition-all">
              <div className="flex items-center">
                <div className={`w-12 h-12 rounded-full ${metric.bgColor} flex items-center justify-center`}>
                  <ApperIcon name={metric.icon} className={`w-6 h-6 ${metric.color}`} />
                </div>
                <div className="ml-4 flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  <p className={`text-2xl font-bold ${metric.color}`}>
                    {metric.value}
                  </p>
                  {metric.subtitle && (
                    <p className="text-sm text-gray-500">{metric.subtitle}</p>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-heading font-semibold text-gray-900">
              Recent Activity
            </h2>
            <ApperIcon name="Activity" className="w-5 h-5 text-gray-400" />
          </div>
          
          <ActivityTimeline limit={5} />
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="p-6">
          <h2 className="text-lg font-heading font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Add Contact', icon: 'UserPlus', href: '/contacts' },
              { label: 'Create Deal', icon: 'Plus', href: '/deals' },
              { label: 'Schedule Task', icon: 'Calendar', href: '/tasks' },
              { label: 'View Pipeline', icon: 'BarChart3', href: '/deals' }
            ].map((action, index) => (
              <motion.a
                key={action.label}
                href={action.href}
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-primary transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ApperIcon name={action.icon} className="w-5 h-5 text-primary mr-3" />
                <span className="font-medium text-gray-900">{action.label}</span>
              </motion.a>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;
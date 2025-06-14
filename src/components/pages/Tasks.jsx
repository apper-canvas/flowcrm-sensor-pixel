import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, isToday, isPast, isTomorrow } from 'date-fns';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import StatusBadge from '@/components/molecules/StatusBadge';
import LoadingState from '@/components/molecules/LoadingState';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';
import { taskService, contactService } from '@/services';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const filters = [
    { id: 'all', label: 'All Tasks' },
    { id: 'today', label: 'Today' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'overdue', label: 'Overdue' },
    { id: 'completed', label: 'Completed' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tasksData, contactsData] = await Promise.all([
        taskService.getAll(),
        contactService.getAll()
      ]);
      setTasks(tasksData);
      setContacts(contactsData);
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const getContactName = (contactId) => {
    const contact = contacts.find(c => c.id === contactId);
    return contact?.name || 'Unknown Contact';
  };

  const getFilteredTasks = () => {
    const now = new Date();
    
    switch (filterStatus) {
      case 'today':
        return tasks.filter(task => 
          task.status === 'pending' && isToday(new Date(task.dueDate))
        );
      case 'upcoming':
        return tasks.filter(task => 
          task.status === 'pending' && !isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate))
        );
      case 'overdue':
        return tasks.filter(task => 
          task.status === 'pending' && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate))
        );
      case 'completed':
        return tasks.filter(task => task.status === 'completed');
      default:
        return tasks;
    }
  };

  const getTaskStatus = (task) => {
    if (task.status === 'completed') return 'completed';
    if (isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate))) return 'overdue';
    return 'pending';
  };

  const getDateLabel = (dueDate) => {
    const date = new Date(dueDate);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isPast(date)) return 'Overdue';
    return format(date, 'MMM d, yyyy');
  };

  const handleToggleComplete = async (task) => {
    try {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      await taskService.update(task.id, { status: newStatus });
      
      setTasks(prev => prev.map(t => 
        t.id === task.id ? { ...t, status: newStatus } : t
      ));
      
      toast.success(
        newStatus === 'completed' 
          ? 'Task marked as completed' 
          : 'Task marked as pending'
      );
    } catch (error) {
      toast.error('Failed to update task status');
    }
  };

  const getFilterCounts = () => {
    const now = new Date();
    return {
      all: tasks.length,
      today: tasks.filter(t => t.status === 'pending' && isToday(new Date(t.dueDate))).length,
      upcoming: tasks.filter(t => t.status === 'pending' && !isPast(new Date(t.dueDate)) && !isToday(new Date(t.dueDate))).length,
      overdue: tasks.filter(t => t.status === 'pending' && isPast(new Date(t.dueDate)) && !isToday(new Date(t.dueDate))).length,
      completed: tasks.filter(t => t.status === 'completed').length
    };
  };

  if (loading) {
    return (
      <div className="p-6">
        <LoadingState count={5} type="table" />
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

  const filteredTasks = getFilteredTasks();
  const filterCounts = getFilterCounts();

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
            Tasks
          </h1>
          <p className="mt-1 text-gray-500">
            Manage and track your tasks and follow-ups
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0">
          <Button
            variant="primary"
            icon="Plus"
            onClick={() => toast.info('Task creation form coming soon')}
          >
            Add Task
          </Button>
        </div>
      </motion.div>

      {/* Task Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-warning">{filterCounts.today}</div>
          <div className="text-sm text-gray-600">Due Today</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-info">{filterCounts.upcoming}</div>
          <div className="text-sm text-gray-600">Upcoming</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-error">{filterCounts.overdue}</div>
          <div className="text-sm text-gray-600">Overdue</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-success">{filterCounts.completed}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="overflow-x-auto"
      >
        <div className="flex space-x-2 min-w-max pb-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setFilterStatus(filter.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                filterStatus === filter.id
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {filter.label} ({filterCounts[filter.id]})
            </button>
          ))}
        </div>
      </motion.div>

      {/* Tasks List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {filteredTasks.length === 0 ? (
          tasks.length === 0 ? (
            <EmptyState
              icon="CheckSquare"
              title="No tasks yet"
              description="Stay organized by creating tasks for your important follow-ups"
              actionLabel="Add Task"
              onAction={() => toast.info('Task creation form coming soon')}
            />
          ) : (
            <EmptyState
              icon="Filter"
              title="No tasks in this category"
              description={`No tasks found for the selected filter "${filterStatus}"`}
            />
          )
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-md transition-all">
                  <div className="flex items-start space-x-4">
                    {/* Checkbox */}
                    <button
                      onClick={() => handleToggleComplete(task)}
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        task.status === 'completed'
                          ? 'bg-success border-success text-white'
                          : 'border-gray-300 hover:border-primary'
                      }`}
                    >
                      {task.status === 'completed' && (
                        <ApperIcon name="Check" className="w-4 h-4" />
                      )}
                    </button>

                    {/* Task Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                          <h3 className={`font-medium break-words ${
                            task.status === 'completed' 
                              ? 'text-gray-500 line-through' 
                              : 'text-gray-900'
                          }`}>
                            {task.title}
                          </h3>
                          
                          {task.description && (
                            <p className={`mt-1 text-sm break-words ${
                              task.status === 'completed' 
                                ? 'text-gray-400' 
                                : 'text-gray-600'
                            }`}>
                              {task.description}
                            </p>
                          )}

                          <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <ApperIcon name="User" className="w-4 h-4" />
                              <span>{getContactName(task.contactId)}</span>
                            </div>
                            
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <ApperIcon name="Calendar" className="w-4 h-4" />
                              <span>{getDateLabel(task.dueDate)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 ml-4">
                          <StatusBadge 
                            status={task.priority} 
                            type="priority" 
                          />
                          
                          <StatusBadge 
                            status={getTaskStatus(task)} 
                            type="task" 
                          />
                        </div>
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

export default Tasks;
import { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import StatusBadge from '@/components/molecules/StatusBadge';
import { contactService } from '@/services';

const ContactTable = ({ contacts, onEdit, onView, onRefresh }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async (contact) => {
    if (!confirm(`Are you sure you want to delete ${contact.name}?`)) return;

    setLoading(true);
    try {
      await contactService.delete(contact.id);
      toast.success('Contact deleted successfully');
      if (onRefresh) onRefresh();
    } catch (error) {
      toast.error(error.message || 'Failed to delete contact');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {contacts.map((contact, index) => (
        <motion.div
          key={contact.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-lg">
                    {contact.name.charAt(0)}
                  </span>
                </div>
                
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-medium text-gray-900 break-words">
                    {contact.name}
                  </h3>
                  <p className="text-sm text-gray-500 break-words">
                    {contact.position} at {contact.company}
                  </p>
                  <div className="flex items-center space-x-4 mt-1">
                    <a 
                      href={`mailto:${contact.email}`}
                      className="text-sm text-primary hover:underline break-words"
                    >
                      {contact.email}
                    </a>
                    {contact.phone && (
                      <a 
                        href={`tel:${contact.phone}`}
                        className="text-sm text-gray-500 hover:text-primary"
                      >
                        {contact.phone}
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <StatusBadge status={contact.status} type="contact" />
                
                <div className="text-right">
                  <p className="text-xs text-gray-500">Last Contact</p>
                  <p className="text-sm font-medium">
                    {format(new Date(contact.lastContact), 'MMM d, yyyy')}
                  </p>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="Eye"
                    onClick={() => onView && onView(contact)}
                    className="text-gray-600 hover:text-primary"
                  >
                    View
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="Edit"
                    onClick={() => onEdit && onEdit(contact)}
                    className="text-gray-600 hover:text-primary"
                  >
                    Edit
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="Trash2"
                    onClick={() => handleDelete(contact)}
                    disabled={loading}
                    className="text-gray-600 hover:text-error"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default ContactTable;
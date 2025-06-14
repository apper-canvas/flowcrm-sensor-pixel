import Badge from '@/components/atoms/Badge';

const StatusBadge = ({ status, type = 'contact' }) => {
  const getStatusConfig = (status, type) => {
    const configs = {
      contact: {
        active: { variant: 'success', label: 'Active' },
        prospect: { variant: 'warning', label: 'Prospect' },
        qualified: { variant: 'info', label: 'Qualified' },
        inactive: { variant: 'default', label: 'Inactive' }
      },
      lead: {
        new: { variant: 'info', label: 'New' },
        contacted: { variant: 'warning', label: 'Contacted' },
        qualified: { variant: 'primary', label: 'Qualified' },
        converted: { variant: 'success', label: 'Converted' }
      },
      deal: {
        prospect: { variant: 'info', label: 'Prospect' },
        negotiation: { variant: 'warning', label: 'Negotiation' },
        closed: { variant: 'success', label: 'Closed' },
        lost: { variant: 'error', label: 'Lost' }
      },
      task: {
        pending: { variant: 'warning', label: 'Pending' },
        completed: { variant: 'success', label: 'Completed' },
        overdue: { variant: 'error', label: 'Overdue' }
      },
      priority: {
        high: { variant: 'error', label: 'High' },
        medium: { variant: 'warning', label: 'Medium' },
        low: { variant: 'info', label: 'Low' }
      }
    };

    return configs[type]?.[status] || { variant: 'default', label: status };
  };

  const config = getStatusConfig(status, type);

  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  );
};

export default StatusBadge;
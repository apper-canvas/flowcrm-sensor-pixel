import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import { dealService } from '@/services';

const DealForm = ({ deal, onSave, onCancel }) => {
  const isEditing = Boolean(deal);
  
  const [formData, setFormData] = useState({
    name: deal?.name || '',
    company: deal?.company || '',
    contactName: deal?.contactName || '',
    value: deal?.value || '',
    stage: deal?.stage || 'prospect',
    description: deal?.description || ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Deal name is required';
    }
    
    if (!formData.company.trim()) {
      newErrors.company = 'Company is required';
    }
    
    if (!formData.value || formData.value <= 0) {
      newErrors.value = 'Deal value must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    setLoading(true);
    
    try {
      const dealData = {
        ...formData,
        value: parseFloat(formData.value)
      };
      
      let savedDeal;
      if (isEditing) {
        savedDeal = await dealService.update(deal.id, dealData);
        toast.success('Deal updated successfully');
      } else {
        savedDeal = await dealService.create(dealData);
        toast.success('Deal created successfully');
      }
      
      onSave(savedDeal);
    } catch (error) {
      toast.error(error.message || 'Failed to save deal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-heading font-semibold text-gray-900">
          {isEditing ? 'Edit Deal' : 'Create New Deal'}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {isEditing ? 'Update deal information' : 'Add a new deal to your pipeline'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Deal Name"
            required
            error={errors.name}
          >
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter deal name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </FormField>

          <FormField
            label="Company"
            required
            error={errors.company}
          >
            <input
              type="text"
              value={formData.company}
              onChange={(e) => handleChange('company', e.target.value)}
              placeholder="Enter company name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </FormField>

          <FormField
            label="Contact Name"
            error={errors.contactName}
          >
            <input
              type="text"
              value={formData.contactName}
              onChange={(e) => handleChange('contactName', e.target.value)}
              placeholder="Enter contact name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </FormField>

          <FormField
            label="Deal Value"
            required
            error={errors.value}
          >
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.value}
              onChange={(e) => handleChange('value', e.target.value)}
              placeholder="0.00"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </FormField>

          <FormField
            label="Stage"
            error={errors.stage}
          >
            <select
              value={formData.stage}
              onChange={(e) => handleChange('stage', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="prospect">Prospect</option>
              <option value="qualified">Qualified</option>
              <option value="proposal">Proposal</option>
              <option value="negotiation">Negotiation</option>
              <option value="closed">Closed</option>
            </select>
          </FormField>
        </div>

        <FormField
          label="Description"
          error={errors.description}
        >
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Enter deal description (optional)"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          />
        </FormField>

        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={loading}
          >
            {isEditing ? 'Update Deal' : 'Create Deal'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default DealForm;
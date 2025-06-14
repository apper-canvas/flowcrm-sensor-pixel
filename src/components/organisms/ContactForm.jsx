import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import { contactService } from '@/services';

const ContactForm = ({ contact, onSave, onCancel }) => {
  const isEditing = !!contact;
  
  const [formData, setFormData] = useState({
    name: contact?.name || '',
    email: contact?.email || '',
    phone: contact?.phone || '',
    company: contact?.company || '',
    position: contact?.position || '',
    status: contact?.status || 'prospect'
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.company.trim()) newErrors.company = 'Company is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      let savedContact;
      if (isEditing) {
        savedContact = await contactService.update(contact.id, formData);
        toast.success('Contact updated successfully');
      } else {
        savedContact = await contactService.create(formData);
        toast.success('Contact created successfully');
      }
      
      if (onSave) onSave(savedContact);
    } catch (error) {
      toast.error(error.message || 'Failed to save contact');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg border border-gray-200 p-6"
    >
      <div className="mb-6">
        <h2 className="text-xl font-heading font-semibold text-gray-900">
          {isEditing ? 'Edit Contact' : 'Add New Contact'}
        </h2>
        <p className="text-gray-500 mt-1">
          {isEditing ? 'Update contact information' : 'Enter contact details below'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
            icon="User"
            placeholder="John Doe"
          />
          
          <FormField
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
            icon="Mail"
            placeholder="john@company.com"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Phone Number"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            icon="Phone"
            placeholder="+1 (555) 123-4567"
          />
          
          <FormField
            label="Company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            error={errors.company}
            required
            icon="Building"
            placeholder="Company Name"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Position"
            name="position"
            value={formData.position}
            onChange={handleChange}
            error={errors.position}
            icon="Briefcase"
            placeholder="Job Title"
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="prospect">Prospect</option>
              <option value="qualified">Qualified</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
          )}
          
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            icon={isEditing ? "Save" : "Plus"}
          >
            {isEditing ? 'Update Contact' : 'Create Contact'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default ContactForm;
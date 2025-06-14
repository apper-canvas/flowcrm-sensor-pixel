import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import SearchBar from '@/components/molecules/SearchBar';
import LoadingState from '@/components/molecules/LoadingState';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';
import ContactForm from '@/components/organisms/ContactForm';
import ContactTable from '@/components/organisms/ContactTable';
import { contactService } from '@/services';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    filterContacts();
  }, [contacts, searchQuery]);

  const loadContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await contactService.getAll();
      setContacts(data);
    } catch (err) {
      setError(err.message || 'Failed to load contacts');
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const filterContacts = () => {
    if (!searchQuery.trim()) {
      setFilteredContacts(contacts);
      return;
    }

    const filtered = contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredContacts(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleAddContact = () => {
    setEditingContact(null);
    setShowForm(true);
  };

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setShowForm(true);
  };

  const handleFormSave = (savedContact) => {
    if (editingContact) {
      setContacts(prev => prev.map(c => c.id === savedContact.id ? savedContact : c));
    } else {
      setContacts(prev => [savedContact, ...prev]);
    }
    setShowForm(false);
    setEditingContact(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingContact(null);
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
          onRetry={loadContacts}
        />
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="p-6">
        <ContactForm
          contact={editingContact}
          onSave={handleFormSave}
          onCancel={handleFormCancel}
        />
      </div>
    );
  }

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
            Contacts
          </h1>
          <p className="mt-1 text-gray-500">
            Manage your customer relationships and contact information
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0">
          <Button
            variant="primary"
            icon="UserPlus"
            onClick={handleAddContact}
          >
            Add Contact
          </Button>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <SearchBar
          placeholder="Search contacts by name, email, or company..."
          onSearch={handleSearch}
          className="flex-1"
        />
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {filteredContacts.length === 0 ? (
          contacts.length === 0 ? (
            <EmptyState
              icon="Users"
              title="No contacts yet"
              description="Start building your network by adding your first contact"
              actionLabel="Add Contact"
              onAction={handleAddContact}
            />
          ) : (
            <EmptyState
              icon="Search"
              title="No contacts found"
              description={`No contacts match "${searchQuery}". Try adjusting your search.`}
            />
          )
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-500">
              Showing {filteredContacts.length} of {contacts.length} contacts
            </div>
            <ContactTable
              contacts={filteredContacts}
              onEdit={handleEditContact}
              onRefresh={loadContacts}
            />
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Contacts;
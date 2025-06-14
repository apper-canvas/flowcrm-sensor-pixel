import leadData from '../mockData/leads.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let leads = [...leadData];

const leadService = {
  async getAll() {
    await delay(300);
    return [...leads];
  },

  async getById(id) {
    await delay(200);
    const lead = leads.find(l => l.id === id);
    return lead ? { ...lead } : null;
  },

  async getByContactId(contactId) {
    await delay(200);
    const contactLeads = leads.filter(l => l.contactId === contactId);
    return [...contactLeads];
  },

  async create(leadData) {
    await delay(300);
    const newLead = {
      ...leadData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    leads.push(newLead);
    return { ...newLead };
  },

  async update(id, data) {
    await delay(300);
    const index = leads.findIndex(l => l.id === id);
    if (index === -1) throw new Error('Lead not found');
    
    leads[index] = { ...leads[index], ...data };
    return { ...leads[index] };
  },

  async delete(id) {
    await delay(200);
    const index = leads.findIndex(l => l.id === id);
    if (index === -1) throw new Error('Lead not found');
    
    leads.splice(index, 1);
    return true;
  },

  async getByStatus(status) {
    await delay(200);
    const filtered = leads.filter(lead => lead.status === status);
    return [...filtered];
  }
};

export default leadService;
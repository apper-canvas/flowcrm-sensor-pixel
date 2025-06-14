import contactData from '../mockData/contacts.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let contacts = [...contactData];

const contactService = {
  async getAll() {
    await delay(300);
    return [...contacts];
  },

  async getById(id) {
    await delay(200);
    const contact = contacts.find(c => c.id === id);
    return contact ? { ...contact } : null;
  },

  async create(contactData) {
    await delay(300);
    const newContact = {
      ...contactData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      lastContact: new Date().toISOString()
    };
    contacts.push(newContact);
    return { ...newContact };
  },

  async update(id, data) {
    await delay(300);
    const index = contacts.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Contact not found');
    
    contacts[index] = { ...contacts[index], ...data };
    return { ...contacts[index] };
  },

  async delete(id) {
    await delay(200);
    const index = contacts.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Contact not found');
    
    contacts.splice(index, 1);
    return true;
  },

  async search(query) {
    await delay(200);
    const filtered = contacts.filter(contact =>
      contact.name.toLowerCase().includes(query.toLowerCase()) ||
      contact.email.toLowerCase().includes(query.toLowerCase()) ||
      contact.company.toLowerCase().includes(query.toLowerCase())
    );
    return [...filtered];
  }
};

export default contactService;
import dealData from '../mockData/deals.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let deals = [...dealData];

const dealService = {
  async getAll() {
    await delay(300);
    return [...deals];
  },

  async getById(id) {
    await delay(200);
    const deal = deals.find(d => d.id === id);
    return deal ? { ...deal } : null;
  },

  async getByContactId(contactId) {
    await delay(200);
    const contactDeals = deals.filter(d => d.contactId === contactId);
    return [...contactDeals];
  },

  async create(dealData) {
    await delay(300);
    const newDeal = {
      ...dealData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    deals.push(newDeal);
    return { ...newDeal };
  },

  async update(id, data) {
    await delay(300);
    const index = deals.findIndex(d => d.id === id);
    if (index === -1) throw new Error('Deal not found');
    
    deals[index] = { ...deals[index], ...data };
    return { ...deals[index] };
  },

  async delete(id) {
    await delay(200);
    const index = deals.findIndex(d => d.id === id);
    if (index === -1) throw new Error('Deal not found');
    
    deals.splice(index, 1);
    return true;
  },

  async getByStage(stage) {
    await delay(200);
    const filtered = deals.filter(deal => deal.stage === stage);
    return [...filtered];
  },

  async updateStage(id, stage) {
    await delay(300);
    const index = deals.findIndex(d => d.id === id);
    if (index === -1) throw new Error('Deal not found');
    
    deals[index] = { ...deals[index], stage };
    return { ...deals[index] };
  }
};

export default dealService;
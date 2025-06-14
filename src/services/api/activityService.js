import activityData from '../mockData/activities.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let activities = [...activityData];

const activityService = {
  async getAll() {
    await delay(300);
    return [...activities];
  },

  async getById(id) {
    await delay(200);
    const activity = activities.find(a => a.id === id);
    return activity ? { ...activity } : null;
  },

  async getByContactId(contactId) {
    await delay(200);
    const contactActivities = activities
      .filter(a => a.contactId === contactId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return [...contactActivities];
  },

  async create(activityData) {
    await delay(300);
    const newActivity = {
      ...activityData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    activities.unshift(newActivity);
    return { ...newActivity };
  },

  async getRecent(limit = 10) {
    await delay(200);
    const recent = activities
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
    return [...recent];
  }
};

export default activityService;
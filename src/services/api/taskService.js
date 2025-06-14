import taskData from '../mockData/tasks.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let tasks = [...taskData];

const taskService = {
  async getAll() {
    await delay(300);
    return [...tasks];
  },

  async getById(id) {
    await delay(200);
    const task = tasks.find(t => t.id === id);
    return task ? { ...task } : null;
  },

  async getByContactId(contactId) {
    await delay(200);
    const contactTasks = tasks.filter(t => t.contactId === contactId);
    return [...contactTasks];
  },

  async create(taskData) {
    await delay(300);
    const newTask = {
      ...taskData,
      id: Date.now().toString(),
      status: 'pending'
    };
    tasks.push(newTask);
    return { ...newTask };
  },

  async update(id, data) {
    await delay(300);
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Task not found');
    
    tasks[index] = { ...tasks[index], ...data };
    return { ...tasks[index] };
  },

  async delete(id) {
    await delay(200);
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Task not found');
    
    tasks.splice(index, 1);
    return true;
  },

  async getOverdue() {
    await delay(200);
    const now = new Date();
    const overdue = tasks.filter(task => 
      task.status === 'pending' && new Date(task.dueDate) < now
    );
    return [...overdue];
  },

  async getToday() {
    await delay(200);
    const today = new Date().toISOString().split('T')[0];
    const todayTasks = tasks.filter(task => 
      task.dueDate.startsWith(today) && task.status === 'pending'
    );
    return [...todayTasks];
  },

  async markComplete(id) {
    await delay(200);
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Task not found');
    
    tasks[index] = { ...tasks[index], status: 'completed' };
    return { ...tasks[index] };
  }
};

export default taskService;
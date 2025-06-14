import Dashboard from '@/components/pages/Dashboard';
import Contacts from '@/components/pages/Contacts';
import Leads from '@/components/pages/Leads';
import Deals from '@/components/pages/Deals';
import Tasks from '@/components/pages/Tasks';

export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'BarChart3',
    component: Dashboard
  },
  contacts: {
    id: 'contacts',
    label: 'Contacts',
    path: '/contacts',
    icon: 'Users',
    component: Contacts
  },
  leads: {
    id: 'leads',
    label: 'Leads',
    path: '/leads',
    icon: 'Target',
    component: Leads
  },
  deals: {
    id: 'deals',
    label: 'Deals',
    path: '/deals',
    icon: 'Handshake',
    component: Deals
  },
  tasks: {
    id: 'tasks',
    label: 'Tasks',
    path: '/tasks',
    icon: 'CheckSquare',
    component: Tasks
  }
};

export const routeArray = Object.values(routes);
export default routes;
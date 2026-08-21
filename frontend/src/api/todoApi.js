import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/todos';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
// --- ADD THIS NEW BLOCK ---
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const todoApi = {
  // Get all todos
  getAll: async () => {
    const response = await api.get('/');
    return response.data;
  },

  // Get completed todos
  getCompleted: async () => {
    const response = await api.get('/completed/');
    return response.data;
  },

  // Get pending todos
  getPending: async () => {
    const response = await api.get('/pending/');
    return response.data;
  },

  // Create new todo
  create: async (todoData) => {
    const response = await api.post('/', todoData);
    return response.data;
  },

  // Update todo
  update: async (id, todoData) => {
    const response = await api.patch(`/${id}/`, todoData);
    return response.data;
  },

  // Toggle todo completion
  toggle: async (id, completed) => {
    const response = await api.patch(`/${id}/`, { completed });
    return response.data;
  },

  // Delete todo
  delete: async (id) => {
    const response = await api.delete(`/${id}/`);
    return response.data;
  },

  // Clear all completed
  clearCompleted: async () => {
    const response = await api.post('/clear_completed/');
    return response.data;
  },
};

export default todoApi;
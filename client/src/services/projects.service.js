import { http } from './http';

export const projectsService = {
  list: async (params) => {
    const { data } = await http.get('/api/projects', { params });
    return data;
  },
  create: async (payload) => {
    const { data } = await http.post('/api/projects', payload);
    return data;
  },
  getById: async (id) => {
    const { data } = await http.get(`/api/projects/${id}`);
    return data;
  },
  update: async (id, payload) => {
    const { data } = await http.put(`/api/projects/${id}`, payload);
    return data;
  },
  archive: async (id) => {
    const { data } = await http.delete(`/api/projects/${id}`);
    return data;
  }
};

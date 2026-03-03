import { http } from './http';

export const tasksService = {
  listByProject: async (projectId, params) => {
    const { data } = await http.get(`/api/projects/${projectId}/tasks`, { params });
    return data;
  },
  create: async (projectId, payload) => {
    const { data } = await http.post(`/api/projects/${projectId}/tasks`, payload);
    return data;
  },
  update: async (taskId, payload) => {
    const { data } = await http.put(`/api/tasks/${taskId}`, payload);
    return data;
  },
  archive: async (taskId) => {
    const { data } = await http.delete(`/api/tasks/${taskId}`);
    return data;
  }
};

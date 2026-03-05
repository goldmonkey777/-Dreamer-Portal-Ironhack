import { http } from './http';

export const dreamsService = {
  listByProject: async (projectId, params) => {
    const { data } = await http.get(`/api/projects/${projectId}/dreams`, { params });
    return data;
  },
  create: async (projectId, payload) => {
    const { data } = await http.post(`/api/projects/${projectId}/dreams`, payload);
    return data;
  },
  update: async (dreamId, payload) => {
    const { data } = await http.put(`/api/dreams/${dreamId}`, payload);
    return data;
  },
  archive: async (dreamId) => {
    const { data } = await http.delete(`/api/dreams/${dreamId}`);
    return data;
  },
  uploadAttachment: async (dreamId, dataUri) => {
    const { data } = await http.post(`/api/dreams/${dreamId}/attachments`, { dataUri });
    return data;
  },
  analyze: async (dreamId) => {
    const { data } = await http.post(`/api/dreams/${dreamId}/analyze`);
    return data;
  },
  setAnalysisDecision: async (dreamId, decision) => {
    const { data } = await http.post(`/api/dreams/${dreamId}/analysis-decision`, { decision });
    return data;
  }
};

import { http } from './http';

export const authService = {
  signup: async (payload) => {
    const { data } = await http.post('/auth/signup', payload);
    return data;
  },
  login: async (payload) => {
    const { data } = await http.post('/auth/login', payload);
    return data;
  },
  verify: async () => {
    const { data } = await http.get('/auth/verify');
    return data;
  }
};

import api from '../../../lib/api';

export const getPostingStats = async (type = 'interest', rate = 5) => {
    const response = await api.get('/interest/stats', { params: { type, rate } });
    return response.data.data;
};

export const processPosting = async (data) => {
    const response = await api.post('/interest/process', data);
    return response.data;
};

export const getPostingHistory = async () => {
    const response = await api.get('/interest/history');
    return response.data.data;
};

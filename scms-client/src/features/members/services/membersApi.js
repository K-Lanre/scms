import api from '../../../lib/api';

export const getMembers = async (params) => {
    const { data } = await api.get('/auth', { params });
    return data.data;
};

export const getMemberById = async (id) => {
    const { data } = await api.get(`/auth/${id}`);
    return data.data.user;
};

export const approveMember = async (id) => {
    const { data } = await api.patch(`/auth/${id}/approve`);
    return data.data;
};

export const updateProfile = async (profileData) => {
    const { data } = await api.patch('/auth/update-profile', profileData);
    return data.data.user;
};

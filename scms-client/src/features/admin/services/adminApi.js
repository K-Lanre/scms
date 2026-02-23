import api from '../../../lib/api';

// ─── Dashboard Metrics ────────────────────────────────────────────────────────
export const getFinancialSummary = async () => {
    const { data } = await api.get('/admin/financial-summary');
    return data.data.summary;
};

export const getLoanMetrics = async () => {
    const { data } = await api.get('/admin/loan-metrics');
    return data.data;
};

export const getSavingsMetrics = async () => {
    const { data } = await api.get('/admin/savings-metrics');
    return data.data;
};

// ─── System Settings ──────────────────────────────────────────────────────────
export const getSettings = async () => {
    const { data } = await api.get('/admin/settings');
    return data.data;
};

export const updateSettings = async (settings) => {
    const { data } = await api.patch('/admin/settings', settings);
    return data.data;
};

// ─── Audit Logs ───────────────────────────────────────────────────────────────
export const getAuditLogs = async (params) => {
    const { data } = await api.get('/admin/audit-logs', { params });
    return data.data;
};

// ─── User Approvals ───────────────────────────────────────────────────────────
export const getPendingUsers = async () => {
    const { data } = await api.get('/users?status=pending_approval');
    return data.data.users;
};

export const approveUser = async (userId) => {
    const { data } = await api.patch(`/users/${userId}/approve`);
    return data.data;
};

export const rejectUser = async (userId, reason) => {
    const { data } = await api.patch(`/users/${userId}/reject`, { reason });
    return data.data;
};

export const adminUpdateUser = async (userId, updateData) => {
    const { data } = await api.patch(`/users/${userId}/admin-update`, updateData);
    return data.data.user;
};

export const adminCreateUser = async (userData) => {
    const { data } = await api.post('/users/admin-create', userData);
    return data.data.user;
};

export const getUserFinancials = async (userId) => {
    const { data } = await api.get(`/accounts/user/${userId}`);
    return data.data;
};

export const getUsers = async () => {
    const { data } = await api.get('/users');
    return data.data.users;
};

import api from '../../../lib/api';

// ─── Savings Products ─────────────────────────────────────────────────────────
export const getSavingsProducts = async () => {
    const { data } = await api.get('/savings-products');
    return data.data;
};

export const createSavingsProduct = async (productData) => {
    const { data } = await api.post('/savings-products', productData);
    return data.data;
};

export const updateSavingsProduct = async ({ id, ...updates }) => {
    const { data } = await api.patch(`/savings-products/${id}`, updates);
    return data.data;
};

export const deleteSavingsProduct = async (id) => {
    await api.delete(`/savings-products/${id}`);
};

// ─── User Savings Plans ───────────────────────────────────────────────────────
export const getMySavingsPlans = async () => {
    const { data } = await api.get('/savings-plans/my-plans');
    return data.data;
};

export const createSavingsPlan = async (planData) => {
    const { data } = await api.post('/savings-plans', planData);
    return data.data;
};

export const requestWithdrawal = async ({ planId, amount }) => {
    const { data } = await api.post(`/savings-plans/${planId}/withdraw`, { amount });
    return data.data;
};

// ─── Admin: Withdrawal Queue ──────────────────────────────────────────────────
export const getWithdrawalRequests = async () => {
    const { data } = await api.get('/savings-plans/withdrawal-requests');
    return data.data;
};

export const approveWithdrawal = async (planId) => {
    const { data } = await api.patch(`/savings-plans/${planId}/approve-withdrawal`);
    return data.data;
};

export const rejectWithdrawal = async (planId) => {
    const { data } = await api.patch(`/savings-plans/${planId}/reject-withdrawal`);
    return data.data;
};

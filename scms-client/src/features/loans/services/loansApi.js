import api from '../../../lib/api';

// ─── Loan Applications ────────────────────────────────────────────────────────
export const applyForLoan = async (loanData) => {
    const { data } = await api.post('/loans', loanData);
    return data.data;
};

export const getMyLoans = async () => {
    const { data } = await api.get('/loans/my-loans');
    return data.data;
};

export const getLoanById = async (id) => {
    const { data } = await api.get(`/loans/${id}`);
    return data.data.loan;
};

// ─── Admin: Loan Management ───────────────────────────────────────────────────
export const getAllLoans = async (params) => {
    const { data } = await api.get('/loans', { params });
    return data.data;
};

export const approveLoan = async (id) => {
    const { data } = await api.patch(`/loans/${id}/approve`);
    return data.data;
};

export const rejectLoan = async (id) => {
    const { data } = await api.patch(`/loans/${id}/reject`);
    return data.data;
};

export const disburseLoan = async (id) => {
    const { data } = await api.patch(`/loans/${id}/disburse`);
    return data.data;
};

// ─── Repayments ───────────────────────────────────────────────────────────────
export const recordRepayment = async ({ loanId, amount, date, method }) => {
    const { data } = await api.post(`/loans/${loanId}/repayments`, {
        amount,
        date,
        method,
    });
    return data.data;
};

export const getLoanRepayments = async (loanId) => {
    const { data } = await api.get(`/loans/${loanId}/repayments`);
    return data.data;
};

// ─── Guarantors ───────────────────────────────────────────────────────────────
export const addGuarantor = async ({ loanId, guarantorData }) => {
    const { data } = await api.post(`/loans/${loanId}/guarantors`, guarantorData);
    return data.data;
};

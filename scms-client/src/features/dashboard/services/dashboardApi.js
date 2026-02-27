import api from "../../../lib/api";

export const getDashboardStats = async () => {
    const res = await api.get("/dashboard/stats");
    return res.data;
};

export const getChartData = async () => {
    const res = await api.get("/dashboard/charts");
    return res.data;
};

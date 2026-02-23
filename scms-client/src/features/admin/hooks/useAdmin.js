import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
    getPendingUsers,
    approveUser,
    adminUpdateUser,
    adminCreateUser,
    getUsers,
    getUserFinancials,
} from "../services/adminApi";

export const usePendingRegistrations = () => {
    return useQuery({
        queryKey: ['pending-registrations'],
        queryFn: getPendingUsers,
    });
};

export const useApproveUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: approveUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pending-registrations'] });
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success('Registration approved successfully');
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Approval failed');
        }
    });
};

export const useRejectUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, reason }) => {
            const { rejectUser } = require('../services/adminApi');
            return rejectUser(userId, reason);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pending-registrations'] });
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success('Registration rejected successfully');
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Rejection failed');
        }
    });
};

export const useAdminUpdateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, updateData }) => adminUpdateUser(userId, updateData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success('User updated successfully');
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Update failed');
        }
    });
};

export const useAdminCreateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: adminCreateUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success('User created successfully');
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Creation failed');
        }
    });
};

export const useUsers = () => {
    return useQuery({
        queryKey: ["users"],
        queryFn: getUsers,
    });
};

export const useUserFinancials = (userId) => {
    return useQuery({
        queryKey: ["user-financials", userId],
        queryFn: () => getUserFinancials(userId),
        enabled: !!userId,
    });
};

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as authApi from "../services/authApi";

export const useAuth = () => {
    const {
        data: user,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["user"],
        queryFn: authApi.getProfile,
        retry: false,
        staleTime: Infinity,
    });

    return {
        user,
        isLoading,
        isAuthenticated: !!user,
        role: user?.role,
        error,
    };
};

export const useLogin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: authApi.login,
        onSuccess: (user) => {
            queryClient.setQueryData(["user"], user);
        },
    });
};

export const useLogout = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            authApi.logout();
        },
        onSuccess: () => {
            queryClient.setQueryData(["user"], null);
            queryClient.clear();
            window.location.href = "/login";
        },
    });
};

export const useSignup = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: authApi.signup,
        onSuccess: (user) => {
            queryClient.setQueryData(["user"], user);
        },
    });
};

export const useForgotPassword = () => {
    return useMutation({
        mutationFn: authApi.forgotPassword,
    });
};

export const useResetPassword = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: authApi.resetPassword,
        onSuccess: (user) => {
            queryClient.setQueryData(["user"], user);
        },
    });
};

export const useUpdatePassword = () => {
    return useMutation({
        mutationFn: authApi.updateMyPassword,
    });
};

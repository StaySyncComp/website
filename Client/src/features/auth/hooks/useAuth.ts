import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api-client";
import { clearAccessToken } from "@/lib/auth-token";
import { User } from "@/types/api/user";
import { LoginCredentials, LoginResponse, MutationResponse } from "@/types/api/auth";
import { fetchUser } from "@/features/organization/api/users/fetchUser";
import { login } from "@/features/auth/api";
import { toast } from "sonner";

export function useAuth() {
  const queryClient = useQueryClient();

  const userQuery = useQuery<User, Error, User>({
    queryKey: ["user"],
    queryFn: fetchUser,
    retry: false,
  });

  const loginMutation = useMutation<
    MutationResponse<LoginResponse>,
    Error,
    LoginCredentials
  >({
    mutationFn: login,

    onSuccess: () => {
      console.log("Login successful");

      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
    onError: (error) => {
      toast.error("פרטי הזדהות שגויים", {
        description: "השם משתמש או הסיסמה שגויים",
        richColors: true,
      });
      console.log(error.message);
    },
  });

  const logout = useMutation<void, Error>({
    mutationFn: () => apiClient.post("/auth/logout"),
    onSuccess: () => {
      clearAccessToken();
      queryClient.setQueryData(["user"], null);
    },
  });

  return {
    user: userQuery?.data || null,
    isAuthenticated: !!userQuery.data,
    isUserLoading: userQuery.isLoading, // Loading state for fetching user
    isLoginLoading: loginMutation.status === "pending", // Loading state for login mutation
    login: loginMutation.mutateAsync,
    logout: logout.mutateAsync,
  };
}

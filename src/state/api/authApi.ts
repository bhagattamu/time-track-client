import { api, apiTags } from ".";

export const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<Auth, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),
    register: build.mutation<User, RegisterRequest>({
      query: (userDetail) => ({
        url: "/auth/register",
        method: "POST",
        body: userDetail,
      }),
    }),
    logout: build.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: apiTags,
    }),
    getAuthToken: build.mutation<Auth, void>({
      query: () => ({
        url: "/auth/refresh-token",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetAuthTokenMutation,
} = authApi;

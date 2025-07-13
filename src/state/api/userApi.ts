import { api } from ".";

export const userApi = api.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<User[], void>({
      query: () => ({
        url: "/users",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetUsersQuery } = userApi;

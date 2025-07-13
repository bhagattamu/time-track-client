import { api } from ".";

export const organizationApi = api.injectEndpoints({
  endpoints: (build) => ({
    createOrganization: build.mutation<Organization, CreateOrganizationRequest>(
      {
        query: (values) => ({
          url: "/organizations",
          method: "POST",
          body: values,
        }),
        invalidatesTags: ["Organization"],
      }
    ),
    getOrganizations: build.query<Organization[], string>({
      query: (userId) => ({
        url: `/organizations/${userId}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "Organization" as const,
                id,
              })),
              "Organization",
            ]
          : ["Organization"],
    }),
    getDefaultOrganization: build.query<Organization, void>({
      query: () => ({
        url: `/organizations/default`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              {
                type: "Organization" as const,
                id: result.id,
              },
              "Organization",
            ]
          : ["Organization"],
    }),
  }),
});

export const {
  useCreateOrganizationMutation,
  useGetOrganizationsQuery,
  useGetDefaultOrganizationQuery,
} = organizationApi;

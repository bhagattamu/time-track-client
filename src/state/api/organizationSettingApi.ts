import { api } from ".";

export const organizationSettingApi = api.injectEndpoints({
  endpoints: (build) => ({
    createOrganizationSetting: build.mutation<
      OrganizationSetting,
      CreateOrganizationSettingRequest
    >({
      query: (values) => ({
        url: `/organizations/${values.organization}/settings`,
        method: "POST",
        body: values,
      }),
      invalidatesTags: ["OrganizationSetting"],
    }),
    getOrganizationSetting: build.query<
      OrganizationSetting,
      string // organizationId
    >({
      query: (organizationId) => ({
        url: `/organizations/${organizationId}/settings`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              {
                type: "OrganizationSetting" as const,
                id: result.id,
              },
              "OrganizationSetting",
            ]
          : ["OrganizationSetting"],
    }),
  }),
});

export const {
  useCreateOrganizationSettingMutation,
  useGetOrganizationSettingQuery,
} = organizationSettingApi;

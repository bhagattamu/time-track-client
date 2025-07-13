import { api } from ".";

type GetTimelogRequest = {
  startDate?: string;
  endDate?: string;
};

export const timelogApi = api.injectEndpoints({
  endpoints: (build) => ({
    getTimelog: build.query<PaginateData<Track[]>, GetTimelogRequest | void>({
      query: (query: GetTimelogRequest) => {
        if (query) {
          // const getUserListURL = new URL(SuperAdminAPI.adminManageUserRouteURL);
          const filterParams = new URLSearchParams({
            ...(query.startDate ? { startDate: query.startDate } : {}),
            ...(query.endDate ? { endDate: query.endDate } : {}),
          });
          return {
            url: `/time-logs?${filterParams.toString()}`,
            method: "GET",
          };
        }
        return {
          url: `/time-logs`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Timelog" as const,
                id,
              })),
              "Timelog",
            ]
          : ["Timelog"],
    }),
  }),
});

export const { useGetTimelogQuery, useLazyGetTimelogQuery } = timelogApi;

import { api } from ".";

export const trackApi = api.injectEndpoints({
  endpoints: (build) => ({
    createTrack: build.mutation<Track, CreateTrackRequest>({
      query: (values) => ({
        url: "/tracks",
        method: "POST",
        body: values,
      }),
      invalidatesTags: ["Track"],
    }),
    getTracks: build.query<Track[], string>({
      query: (userId) => ({
        url: `/tracks/${userId}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "Track" as const,
                id,
              })),
              "Track",
            ]
          : ["Track"],
    }),
    getActiveTrack: build.query<Track, void>({
      query: () => ({
        url: `/tracks/active`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              {
                type: "Track" as const,
                id: result.id,
              },
              "Track",
            ]
          : ["Track"],
    }),
    getTrack: build.query<Track, string>({
      query: (id) => ({
        url: `/tracks/${id}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              {
                type: "Track" as const,
                id: result.id,
              },
              "Track",
            ]
          : ["Track"],
    }),
  }),
});

export const {
  useCreateTrackMutation,
  useGetTracksQuery,
  useGetActiveTrackQuery,
  useGetTrackQuery,
} = trackApi;

import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "../redux";
import { setAuth } from "..";
import { Mutex } from "async-mutex";

// create a new mutex
const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).global.auth?.accessToken || "";
    headers.set("timezone", Intl.DateTimeFormat().resolvedOptions().timeZone);
    headers.set(
      "Access-Control-Allow-Origin",
      process.env.NEXT_PUBLIC_API_ORIGIN || "http://localhost:8080"
    );
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
  credentials: "include", // Include cookies in requests
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, store, extraOptions) => {
  // wait until the mutex is available without locking it
  await mutex.waitForUnlock();
  let result = await baseQuery(args, store, extraOptions);

  if (
    result.error &&
    result.error.status === 401 &&
    (result.error.data as Error)?.message === "Please authenticate"
  ) {
    // checking whether the mutex is locked
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        // Try to refresh the token
        const refreshedAuth = await baseQuery(
          {
            url: "/auth/refresh-token",
            method: "POST",
            credentials: "include",
          },
          store,
          extraOptions
        );
        if (refreshedAuth) {
          // Store the new tokens
          console.log("Refreshing token", refreshedAuth);
          store.dispatch(setAuth(refreshedAuth.data as Auth));
          // Retry the original request
          result = await baseQuery(args, store, extraOptions);
        } else {
          // store.dispatch(logoutUser());
        }
      } finally {
        // release must be called once the mutex should be released again.
        release();
      }
    } else {
      // wait until the mutex is available without locking it
      await mutex.waitForUnlock();
      result = await baseQuery(args, store, extraOptions);
    }
  }
  return result;
};

export const apiTags = [
  "Auth",
  "Organization",
  "OrganizationSetting",
  "Track",
  "Timelog",
];

export const api = createApi({
  baseQuery: baseQueryWithReauth,
  reducerPath: "api",
  tagTypes: apiTags,
  endpoints: () => ({}),
});

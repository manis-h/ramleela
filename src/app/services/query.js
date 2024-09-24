import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "universal-cookie";

const cookies = new Cookies(null, { path: "/" });

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:4000/",
    // baseUrl: "http://192.168.0.100:4000/",
    prepareHeaders: (headers, { getState }) => {
      const cookies = new Cookies();
      const token = cookies.get("token");

      // Set authorization header if token is available
      if (token) {
        headers.set("authorization", `${token}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    profile: builder.query({
      query: () => `profile`,
    }),

    registerUser: builder.mutation({
      query: (body) => ({
        url: `register`,
        method: "POST",
        body,
      }),
    }),
    loginUser: builder.mutation({
      query: (body) => ({
        url: `login`,
        method: "POST",
        body,
      }),
    }),
    adminAccount: builder.query({
      query: () => "admin-account",
    }),
    betAmount: builder.query({
      query: () => "bet-amount",
    }),
    ResultGame: builder.mutation({
      query: (body) => ({
        url: `result`,
        method: "POST",
        body,
      }),
    }),
    // New mutation for sending bet amount to the backend
    sendBetAmount: builder.mutation({
      query: (body) => ({
        url: `gamelog`,  // Make sure the endpoint is correct according to your backend setup
        method: "POST",
        body,
      }),
    }),
    gameResult: builder.mutation({
      query: (body) => ({
        url: `updatelog`,  // Make sure the endpoint is correct according to your backend setup
        method: "PATCH",
        body,
      }),
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useRegisterUserMutation,
  useProfileQuery,
  useLoginUserMutation,
  useResultGameMutation,
  useAdminAccountQuery,
  useSendBetAmountMutation, // Exporting the new hook
  useGameResultMutation, // Exporting the new hook
} = baseApi;

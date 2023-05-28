import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


export const authSlice = createApi({
    reducerPath: 'auth',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:4000'
    }),
    endpoints: builder => ({
        loginUser: builder.mutation({
            query: (credentials) => ({
                url: '/login',
                method: 'POST',
                body: credentials
            })
        }),
        signupUser: builder.mutation({
            query: (credentials) => ({
                url: 'signup',
                method: 'POST',
                body: credentials,
            })
        }),
        logoutUser: builder.mutation({
            query: (username) => ({
                url: '/logout',
                method: 'DELETE',
                body: username
            })
        }),
    })
})

export const { useLoginUserMutation, useSignupUserMutation, useLogoutUserMutation } = authSlice;
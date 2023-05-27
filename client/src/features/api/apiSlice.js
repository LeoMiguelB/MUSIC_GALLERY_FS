import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:4000',
        prepareHeaders: (headers, { getState }) => {
            const token = JSON.parse(sessionStorage.getItem('token'));
            if (token) {
                headers.set("authorization", `Bearer ${token}`)
            }
            return headers;
        }
    }),
    tagTypes: ['Audio'],
    endpoints: builder => ({
        getAudioInfo: builder.query({
            query: (username) => `/audio/${username}`,
            providesTags: ['Audio'],
        }),
        addAudio: builder.mutation({
            query: (audio) => ({
                url: `/upload/${audio.username}`,
                method: 'POST',
                body: audio.formData,
            }),
            invalidatesTags: ['Audio'],
        }),
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
        refreshToken: builder.mutation({
            query: (credentials) => ({
                url: '/token-refresh',
                method: 'POST',
                body: credentials
            })
        })

    })
})

export const { useGetAudioInfoQuery, useAddAudioMutation, useLoginUserMutation, useLogoutUserMutation, useRefreshTokenMutation, useSignupUserMutation } = apiSlice;
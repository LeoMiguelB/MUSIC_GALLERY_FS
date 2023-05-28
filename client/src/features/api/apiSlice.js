import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:4000',
        prepareHeaders: (headers, { getState }) => {
            const accessToken = sessionStorage.getItem('token');
            headers.set("authorization", `Bearer ${JSON.parse(accessToken)}`)
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
        refreshToken: builder.mutation({
            query: (credentials) => ({
                url: '/token-refresh',
                method: 'POST',
                body: credentials
            })
        })
    })
})

export const { useGetAudioInfoQuery, useAddAudioMutation, useRefreshTokenMutation } = apiSlice;
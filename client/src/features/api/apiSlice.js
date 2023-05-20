import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000' }),
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

    })
})

export const { useGetAudioInfoQuery, useAddAudioMutation } = apiSlice;
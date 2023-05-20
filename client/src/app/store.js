import { configureStore } from "@reduxjs/toolkit"

import playerReducer from '../features/audio-players/playerSlice';

import { apiSlice } from "../features/api/apiSlice";

export default configureStore({
    reducer: {
        player: playerReducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(apiSlice.middleware)

}) 
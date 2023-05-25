import { configureStore } from "@reduxjs/toolkit"

import playerReducer from '../features/audio-players/playerSlice';

import { apiSlice } from "../features/api/apiSlice";


import userReducer from "../features/user/userSlice";

export default configureStore({
    reducer: {
        player: playerReducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
        user: userReducer,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(apiSlice.middleware)

}) 
import { configureStore } from "@reduxjs/toolkit"

import playerReducer from '../features/audio-players/playerSlice';

import { apiSlice } from "../features/api/apiSlice";

import { authSlice } from "../features/api/authSlice";


import userReducer from "../features/user/userSlice";

export default configureStore({
    reducer: {
        player: playerReducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
        [authSlice.reducerPath]: authSlice.reducer,
        user: userReducer,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(apiSlice.middleware).concat(authSlice.middleware)

}) 
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    username: "",
    isAuthenticated: false,
}

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        credentialsAdded(state, action) {
            const { username } = action.payload;

            state.username = username;

            state.isAuthenticated = true;
        },
        logoutUser(state, action) {
            state.username = "";
            state.isAuthenticated = false;
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('refreshToken');

        }
    }
})

export const { credentialsAdded, logoutUser } = userSlice.actions;

export default userSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    username: "",
    accessToken: "",
}

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        credentialsAdded(state, action) {
            const { username, accessToken } = action.payload;

            state.username = username;

            state.accessToken = accessToken;
        },
        logoutUser(state, action) {
            state.username = "";
            state.accessToken = null;
        }
    }
})

export const { credentialsAdded, logoutUser } = userSlice.actions;

export default userSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    isPlaying: false,
    currentSong: {},
    footerVolume: 1.0,
    globalControlVolume: 1.0,
    activeFilter: "all",
};

const playerSlice = createSlice({
    name: 'player',
    initialState,
    reducers: {
        playPause(state, action) {
            const currentMode = action.payload;
            state.isPlaying = currentMode;
        },
        addLengthProgress(state, action) {
            const { progress, length } = action.payload;
            state.currentSong = { ...state.currentSong, progress, length };
        },
        handleProgress(state, action) {
            state.currentSong.progress = 0;
        },
        addCurrentSong(state, action) {
            const { src, imgPath, audioName } = action.payload;
            state.currentSong = { src, imgPath, audioName };
        },
        changeGlobalVolume(state, action) {
            const volume = action.payload;
            state.globalControlVolume = volume;
        },
        changeActiveFilter(state, action) {
            const currentFilter = action.payload;

            state.activeFilter = currentFilter;
        }
    },
})

export const { playPause, addLengthProgress, addCurrentSong, handleProgress, changeGlobalVolume, changeActiveFilter } = playerSlice.actions;

export default playerSlice.reducer;
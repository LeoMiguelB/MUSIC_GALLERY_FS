import '../App.css'

import { useEffect, useState, useRef, useMemo } from 'react';
import Filter from '../features/audio-players/Filter';

import { motion } from "framer-motion";

import Player from '../features/audio-players/Player';

import FooterPlayer from '../features/audio-players/FooterPlayer';

import { useSelector, useDispatch } from 'react-redux';

import { playPause, addLengthProgress, handleProgress } from '../features/audio-players/playerSlice';

import { useGetAudioInfoQuery } from '../features/api/apiSlice';

const MusicLibrary = () => {
    const audioRef = useRef();

    const currentSong = useSelector(state => state.player.currentSong);

    const isPlaying = useSelector(state => state.player.isPlaying);

    const activeFilter = useSelector(state => state.player.activeFilter);

    const username = useSelector(state => state.user.username);

    const dispatch = useDispatch();

    const {
        data: audios = [],
        isLoading,
        isSuccess,
        isError,
        error,
    } = useGetAudioInfoQuery(username);

    const filteredAudio = useMemo(() => {
        // make a copy of the array
        const filteredAudio = audios.slice();

        if (activeFilter === "all") {
            return filteredAudio;
        } else {
            return filteredAudio.filter(song => song.type.includes(activeFilter));
        }
    }, [activeFilter, audios])

    let content;

    if (isLoading) {
        // put in a loading screen here
        <div>Loading...</div>
    } else if (isSuccess) {
        content = filteredAudio.map((song, index) =>
            <Player key={song.audio_id} songDetails={song} audioElem={audioRef} />
        )
    } else if (isError) {
        content = <div>{error}</div>
    }

    useEffect(() => {
        if (isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    const onPlaying = () => {
        const duration = audioRef.current.duration;
        const ct = audioRef.current.currentTime;
        // keep the previos data i.e, src and add more props
        dispatch(addLengthProgress({ "progress": (ct / duration) * 100, "length": duration }));
    }

    const handleOnEnd = () => {
        // essentially reset everything when audio reaches end
        dispatch(handleProgress());
        audioRef.current.currentTime = 0;
        dispatch(playPause(false));
    }

    return (
        <>
            <div>
                <Filter />
                <motion.div layout className="popular-pictures">

                    <audio src={currentSong.src} ref={audioRef} onTimeUpdate={onPlaying} onEnded={handleOnEnd} />
                    {
                        content
                    }
                </motion.div>

                <FooterPlayer audioElem={audioRef} />
            </div>
        </>
    )
}

export default MusicLibrary;
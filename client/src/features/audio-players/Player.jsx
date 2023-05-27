import { useRef, useState, useEffect, useMemo } from "react"

import "./player.css"

import { motion } from "framer-motion";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';

import { useDispatch, useSelector } from 'react-redux';

import { playPause, addCurrentSong, changeGlobalVolume } from "./playerSlice";



const Player = ({ songDetails, audioElem }) => {


    const [localVolume, setLocalVolume] = useState(1.0);

    const isPlaying = useSelector(state => state.player.isPlaying);

    const dispatch = useDispatch();

    const clickRef = useRef();

    const currentSong = useSelector(state => state.player.currentSong);

    const footerVolume = useSelector(state => state.player.globalControlVolume);

    const [audioUrl, setAudioUrl] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    const username = useSelector(state => state.user.username);



    const fetchAudio = async () => {
        const audioRes = await fetch(`http://localhost:4000/audio/${songDetails.audio_name}/${username}`, {
            method: "GET",
            headers: new Headers({
                'authorization': `Bearer ${JSON.parse(sessionStorage.getItem('token'))}`,
            }),
        });


        const audioBlob = await audioRes.blob();
        const audioBlobUrl = URL.createObjectURL(audioBlob);

        setAudioUrl(audioBlobUrl);
    }

    const fetchImage = async () => {
        const imageRes = await fetch(`http://localhost:4000/images/${songDetails.img_name}/${username}`,
            {
                method: "GET",
                headers: new Headers({
                    'authorization': `Bearer ${JSON.parse(sessionStorage.getItem('token'))}`,
                }),
            });
        const imageBlob = await imageRes.blob();
        const imageBlobUrl = URL.createObjectURL(imageBlob);
        setImageUrl(imageBlobUrl);
    }

    // https://stackoverflow.com/questions/75536269/using-rtk-query-what-is-the-best-practice-to-download-a-file
    //sources say there isn't a best practice to handle blobs with rtk query so i'm using fetch
    useEffect(() => {
        fetchAudio();
        fetchImage();
    }, []);


    const togglePP = () => {
        if (!isPlaying) {
            // set's the current song to the current source which is the src that we passed in
            // keep in mind we add more props to this object in the app component (in the onPlaying function)
            dispatch(addCurrentSong({ src: audioUrl, imgPath: imageUrl, audioName: songDetails.audio_name }));

            // helps when changing to a new source to reset the footer volume to the original state
            dispatch(changeGlobalVolume(localVolume));

            dispatch(playPause(true));
        } else {
            dispatch(playPause(false));
        }
    }

    const checkWidth = (e) => {

        let width = clickRef.current.clientWidth;
        const offset = e.nativeEvent.offsetX;

        const divprogress = offset / width * 100;

        audioElem.current.currentTime = divprogress / 100 * currentSong.length;

    }

    // condition that will be used below to handle one player at a time
    const currentPlayerValid = (currentSong.audioName === songDetails.audio_name);


    // for every time the footer volume changes we also change the local volume
    useEffect(() => {
        if (currentPlayerValid)
            setLocalVolume(footerVolume);
    }, [footerVolume]);


    const handleVolume = (e) => {
        const volume = e.target.value;

        setLocalVolume(parseFloat(volume));
        audioElem.current.volume = parseFloat(volume);

        if (currentPlayerValid) {
            dispatch(changeGlobalVolume(volume));
        }
    }


    return (
        <div>
            <motion.div layout className="styling">
                <div className="inner-styling">

                    <div className="cover-art" style={{ backgroundImage: `url(${(imageUrl === "") ? "/background-img.jpg" : imageUrl})` }}>
                    </div>

                    <div className="info">
                        <div className="title">
                            <h1>{songDetails.title}</h1>
                        </div>
                        <div className="description">
                            {/* display tags of the song */}
                            <p>
                                {
                                    songDetails.type.map((type) => {
                                        return (
                                            `#${type} `
                                        )
                                    })
                                }
                            </p>
                        </div>
                    </div>

                    <div className="controls">
                        <div className="play-pause">
                            <button onClick={togglePP}>{<FontAwesomeIcon icon={(currentPlayerValid && isPlaying) ? faPause : faPlay} />}</button>
                        </div>
                        <div className="prog-vol" >
                            <div className="nav">
                                <div className="nav-wrapper" onClick={currentPlayerValid ? checkWidth : () => { return }} ref={currentPlayerValid ? clickRef : () => { return }}>
                                    <div className="seek-bar" style={{ width: currentPlayerValid ? `${currentSong.progress + "%"}` : "0%" }}>
                                    </div>
                                </div>
                            </div>

                            <div className="time-display">
                                <p>{(currentPlayerValid && audioElem?.current?.currentTime) ? (parseFloat((audioElem.current.currentTime) / 60).toFixed(2) + "/" + parseFloat((audioElem.current.duration) / 60).toFixed(2)) : ""}</p>

                            </div>

                            <div className="volume">
                                <label>
                                    <span className="slider-container">
                                        <input className="vol-progress" type="range" min="0" max="1" step="0.05" value={localVolume} onChange={currentPlayerValid ? handleVolume : () => { return }} />
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>


    )

}

export default Player;
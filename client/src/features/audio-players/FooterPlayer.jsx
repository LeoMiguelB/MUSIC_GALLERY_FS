import "./footer-player.css"

import { useRef } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faPause, faPlay, faVolumeLow } from '@fortawesome/free-solid-svg-icons';

import { playPause, changeGlobalVolume } from "./playerSlice";

import { useSelector, useDispatch } from 'react-redux';


const FooterPlayer = ({ audioElem }) => {

    const footerVolume = useSelector(state => state.player.globalControlVolume);

    const clickRef = useRef();

    const dispatch = useDispatch();

    const isPlaying = useSelector(state => state.player.isPlaying);

    const currentSong = useSelector(state => state.player.currentSong);

    // for checking if the currentSong is undefined or not (in the elements)
    const noNanSong = (Object.keys(currentSong).length === 0);


    const handleVolume = (e) => {
        const volume = parseFloat(e.target.value);
        dispatch(changeGlobalVolume(volume));

        audioElem.current.volume = volume;
    }

    const handlePausePlay = () => {
        if (isPlaying) {
            dispatch(playPause(false));
        } else {
            dispatch(playPause(true));
        }
    }

    const checkWidth = (e) => {
        if (noNanSong) {
            return;
        }

        let width = clickRef.current.clientWidth;
        const offset = e.nativeEvent.offsetX;

        const divprogress = offset / width * 100;

        audioElem.current.currentTime = divprogress / 100 * currentSong.length;
    }


    return (
        <footer>
            {/* update this so that it's image corresopnds to that of the curent audio playing */}
            <img className="footer-image" src={`${noNanSong ? "/blank-canvas.jpg" : currentSong.imgPath}`} />

            <div className="footer-btn-container">
                {/* need to check if the object is empty */}
                <button className="footer-btn" onClick={noNanSong ? () => { return } : handlePausePlay}>
                    {
                        <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
                    }
                </button>
            </div>

            <div className="footer-nav">
                <div className="footer-nav-wrapper" onClick={checkWidth} ref={noNanSong ? () => { return } : clickRef}>
                    <div className="footer-seek-bar" style={{ width: !noNanSong ? `${currentSong.progress + "%"}` : "0%" }}>
                    </div>
                    <p>{!noNanSong ? (parseFloat((audioElem.current.currentTime) / 60).toFixed(2) + "/" + parseFloat((audioElem.current.duration) / 60).toFixed(2)) : ""}</p>
                </div>
            </div>

            <div className="dropup">
                <button className="dropbtn"><FontAwesomeIcon className="footer-volume" icon={faVolumeLow} /></button>
                <div className="dropup-content">
                    <div className="footer-slide-container">
                        <input className="footer-slider" type="range" min="0" max="1" step="0.05" value={footerVolume} onChange={handleVolume} />
                    </div>
                </div>
            </div>

        </footer>
    )
}

export default FooterPlayer;
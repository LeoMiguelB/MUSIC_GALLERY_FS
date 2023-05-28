import { useAddAudioMutation } from "../api/apiSlice";
import "./AddAudio.css";

import InputTags from "./InputTags";

import { useState, useRef } from "react";

import { useSelector } from "react-redux";

import Navbar from '../../components/Navbar';

const AddAudio = () => {

    const [h2Content, setH2Content] = useState('');
    const [h3Content, setH3Content] = useState('');
    const [addAudio, { isLoading }] = useAddAudioMutation();

    //state for the input tags
    const [tags, setTags] = useState([]);

    const inputImage = useRef();

    const inputAudio = useRef();

    const username = useSelector(state => state.user.username);

    const sendFiles = async (e) => {

        e.preventDefault();

        const imgFile = inputImage.current.files;
        const audioFile = inputAudio.current.files;

        const formData = new FormData();

        formData.append(audioFile.item(0).name, audioFile.item(0));

        formData.append(imgFile.item(0).name, imgFile.item(0));

        const tagsJson = JSON.stringify(tags);

        // helps to check if a file exists on the server side
        const fileNames = JSON.stringify({
            audioName: audioFile.item(0).name,
            imgName: imgFile.item(0).name,
        })

        formData.append("filenames", fileNames);

        formData.append("tags", tagsJson);


        //inputs must be defined
        const canSave = [imgFile, audioFile].every(Boolean) && !isLoading;

        let response;

        if (canSave) {
            response = await addAudio({ username, formData });

            if (response.error) {
                setH2Content(response.error.data.status);
                setH3Content(response.error.data.message);
            } else {
                setH2Content(response.data.status);
                setH3Content(response.data.message);
            }
        }


    }

    return (
        <div>
            <Navbar />
            <h1>File Uploader</h1>
            <form id="uploadForm" encType="multipart/form-data" onSubmit={sendFiles} >
                <input type="file" id="myFiles" accept="image/*" ref={inputImage} />
                <input type="file" id="myFiles" accept="audio/mpeg" ref={inputAudio} />
                <InputTags tags={tags} setTags={setTags} />
                <button>submit</button>
            </form>
            <h2>{`Status: ${h2Content}`}</h2>
            <h3>{h3Content}</h3>
        </div>
    )
}

export default AddAudio;
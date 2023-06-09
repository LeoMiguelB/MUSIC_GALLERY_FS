import { useAddAudioMutation } from "../api/apiSlice";
import "./AddAudio.css";

import InputTags from "./InputTags";

import { useState, useRef } from "react";

import { useSelector } from "react-redux";

import Navbar from '../../components/Navbar';

const AddAudio = () => {

    const [h2Content, setH2Content] = useState('');
    const [addAudio, { isLoading }] = useAddAudioMutation();
    const [imgFileName, setImgFileName] = useState('');
    const [audioFileName, setAudioFileName] = useState('');

    //state for the input tags
    const [tags, setTags] = useState([]);

    const inputImage = useRef();

    const inputAudio = useRef();

    const username = useSelector(state => state.user.username);

    const sendFiles = async (e) => {

        e.preventDefault();

        const imgFile = inputImage.current.files;
        const audioFile = inputAudio.current.files;

        //inputs must be defined
        const canSave = [imgFile?.item(0), audioFile?.item(0)].every(Boolean) && !isLoading && (tags.length === 3);

        if (canSave) {
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


            const response = await addAudio({ username, formData });

            if (response?.error?.status) {
                setH2Content(response?.error?.data?.message);
            }

            if (response?.data?.status === 'success') {
                setH2Content(response.data.message + ' successfully uploaded');
            }
        } else {
            setH2Content("please fill in all required inputs");
        }

    }




    return (
        <div >
            <Navbar />
            <div className="upload-container">
                <h1>File Uploader</h1>
                <form id="uploadForm" encType="multipart/form-data" onSubmit={sendFiles} >
                    <div className="upload-btn-wrapper">
                        <button className="btn">Upload an image: {imgFileName}</button>
                        <input type="file" id="myImage" name="image-input" accept="image/*" onChange={(e) => setImgFileName(e.target.files[0].name)} ref={inputImage} />
                    </div>
                    <div className="upload-btn-wrapper">
                        <button className="btn">Upload an audio: {audioFileName}</button>
                        <input type="file" id="myAudio" accept="audio/mpeg" name="audio-input" onChange={(e) => setAudioFileName(e.target.files[0].name)} ref={inputAudio} />
                    </div>
                    {/* <label for="myImage">Upload an image:</label>
                    <input type="file" id="myImage" name="image-input" accept="image/*" ref={inputImage} />
                    <label for="myAudio">Upload an audio:</label>
                    <input type="file" id="myAudio" accept="audio/mpeg" name="audio-input" ref={inputAudio} /> */}
                    <InputTags tags={tags} setTags={setTags} />
                    <button>submit</button>
                </form>
                <h2>{`Status: ${h2Content}`}</h2>
            </div>
        </div>
    )
}

export default AddAudio;
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { useSignupUserMutation } from "../features/api/authSlice";

import { credentialsAdded } from "../features/user/userSlice";

import { Link, Navigate, useNavigate } from "react-router-dom";


const SignupPage = () => {
    const [signupUser, { isLoading }] = useSignupUserMutation();

    const [username, setUsername] = useState("");

    const [password, setPassword] = useState("");

    const [errMsg, setErrMsg] = useState("");

    const dispatch = useDispatch();

    const navigate = useNavigate();


    const handleOnSubmit = async (e) => {
        e.preventDefault();

        try {
            const resData = await signupUser({ username, password }).unwrap();

            const { accessToken, refreshToken } = resData;


            sessionStorage.setItem('token', JSON.stringify(accessToken));
            sessionStorage.setItem('refreshToken', JSON.stringify(refreshToken));

            dispatch(credentialsAdded({ username }));

            navigate("/");

            setUsername("");

            setPassword("");

        } catch (error) {
            console.log(error);
            if (!error) {
                setErrMsg("no server response");
            } else if (error?.status === 409) {
                setErrMsg(error.data.message);
            }
        }

    }

    return (
        <div>
            <form encType="multipart/form-data" onSubmit={handleOnSubmit}>
                <div>
                    <div >
                        <label  >
                            <span >Username</span>
                        </label>
                        <input onChange={(e) => { setUsername(e.target.value) }} type="text" value={username} placeholder="username" autoComplete="off"
                            required />
                    </div>
                    <div >
                        <label >
                            <span >Password</span>
                        </label>
                        <input type="text" onChange={(e) => { setPassword(e.target.value) }} value={password} placeholder="password" autoComplete="off"
                            required />
                    </div>
                    <div>
                        <button >Signup</button>
                    </div>
                    <h2 style={{ color: "white" }}>{errMsg}</h2>
                    <p style={{ color: "white" }}><Link to='/login'>Login</Link></p>
                </div>
            </form>


        </div>
    )
}

export default SignupPage;
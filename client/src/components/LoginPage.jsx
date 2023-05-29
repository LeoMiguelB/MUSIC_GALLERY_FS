import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { useLoginUserMutation } from "../features/api/authSlice";

import { credentialsAdded } from "../features/user/userSlice";

import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";

import "./login-signup.css"


const LoginPage = () => {

    const [loginUser, { isLoading }] = useLoginUserMutation();

    const [username, setUsername] = useState("");

    const [password, setPassword] = useState("");

    const [errMsg, setErrMsg] = useState("");

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const handleOnSubmit = async (e) => {
        e.preventDefault();

        try {
            const resData = await loginUser({ username, password }).unwrap();

            const { accessToken, refreshToken } = resData;

            sessionStorage.setItem('token', JSON.stringify(accessToken));
            sessionStorage.setItem('refreshToken', JSON.stringify(refreshToken));

            dispatch(credentialsAdded({ username }));

            navigate("/");

            setUsername("");

            setPassword("");

        } catch (error) {
            if (!error) {
                setErrMsg("no server response");
            } else if (error?.status === 404) {
                setErrMsg(error.data.message);
            }
        }

    }

    return (
        <div>
            <form className="form" encType="multipart/form-data" onSubmit={handleOnSubmit}>
                <div>
                    <h1 className="header">LOGIN</h1>
                    <div >
                        <label>
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
                        <button >Login</button>
                    </div>
                    <p className="message">Don't Have an Account?<Link to='/signup'> Register</Link></p>
                    <h2 className="message">{errMsg}</h2>
                </div>
            </form>
        </div>
    )

}

export default LoginPage;
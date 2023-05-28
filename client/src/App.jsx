import './App.css'

import MusicLibrary from './components/MusicLibrary'

import AddAudio from './features/audio-forms/AddAudio';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import LoginPage from './components/loginPage';

import { useSelector } from 'react-redux';

import { useEffect } from 'react';

import { useRefreshTokenMutation } from './features/api/apiSlice';

import SignupPage from './components/SignupPage';

import PrivateRoutes from './components/PrivateRoutes';

const App = () => {


  const username = useSelector(state => state.user.username);

  const [refreshToken, { isLoading }] = useRefreshTokenMutation();

  const handleRefreshToken = async (currRefreshToken) => {
    try {
      const response = await refreshToken({ refreshToken: currRefreshToken, username }).unwrap();
      sessionStorage.setItem('token', JSON.stringify(response));

    } catch (error) {
      console.log(error);
    }
  }

  //refreshes token every 30mins
  useEffect(() => {
    setInterval(() => {
      if (sessionStorage.getItem('refreshToken')) {
        handleRefreshToken(JSON.parse(sessionStorage?.getItem('refreshToken')));
      }
    }, 1000 * 1800);
  }, [])

  return (
    <div className="main-container">
      <Router>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route path="/" element={<MusicLibrary />} />
            <Route path="/upload-audio" element={<AddAudio />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App;

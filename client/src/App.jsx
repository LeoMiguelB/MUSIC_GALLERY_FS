import './App.css'

import MusicLibrary from './components/MusicLibrary'

import AddAudio from './features/audio-forms/AddAudio';

import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';

import LoginPage from './components/loginPage';

import { useSelector } from 'react-redux';

import { useEffect } from 'react';

import { useRefreshTokenMutation } from './features/api/apiSlice';

const App = () => {

  const isAuthenticated = useSelector(state => state.user.isAuthenticated);

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
    const currRefreshToken = JSON.parse(sessionStorage.getItem('refreshToken'));

    setInterval(() => {
      if (currRefreshToken) {
        handleRefreshToken(currRefreshToken);
      }
    }, 1000 * 1800);
  }, [])

  if (!isAuthenticated) {
    return <LoginPage />
  }

  return (
    <div className="main-container">
      <Navbar />
      <Routes>
        <Route path="/" element={<MusicLibrary />} />
        <Route path="/upload-audio" element={<AddAudio />} />
      </Routes>
    </div>
  )
}

export default App;

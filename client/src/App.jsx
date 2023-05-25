import './App.css'

import MusicLibrary from './components/MusicLibrary'

import AddAudio from './features/audio-forms/AddAudio';

import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';

import LoginPage from './components/loginPage';

import { useSelector } from 'react-redux';

function App() {

  const token = useSelector(state => state.user.accessToken);
  
  if (!token) {
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

export default App

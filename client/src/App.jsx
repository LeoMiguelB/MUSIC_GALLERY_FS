import './App.css'

import MusicLibrary from './components/MusicLibrary'

import AddAudio from './features/audio-forms/AddAudio';

import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';

import LoginPage from './components/loginPage';

function App() {

  return (
    <div className="main-container" data-theme="dark">
      <Navbar />
      <Routes>
        <Route path="/" element={<MusicLibrary />} />
        <Route path="/upload-audio" element={<AddAudio />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </div>
  )
}

export default App

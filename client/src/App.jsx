import './App.css'

import MusicLibrary from './components/MusicLibrary'

import AddAudio from './features/audio-forms/AddAudio';

import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';

function App() {

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

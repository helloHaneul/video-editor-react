// 김하늘
import './App.css'

import { BrowserRouter, Route, Routes } from 'react-router-dom'

import VideoEditor from './pages/VideoEditor/VideoEditor'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<VideoEditor />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

import { BrowserRouter as Routes, Route, BrowserRouter } from 'react-router';
import './App.css'
import Landing from './pages/landing/Landing';

function App() {

  return (
    <>
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
          </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

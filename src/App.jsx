import './App.css'
import Header from './components/header'
import Footer from './components/footer'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'

function App() {

  return (
    <div>

      <Header />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </BrowserRouter>

      <Footer />

    </div>
  )
}

export default App

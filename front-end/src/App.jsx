import './index.css'
import Header from "./components/library/header/header.jsx"
import { SignUpPage } from './pages/SignUpPage/signUpPage.jsx';
import { Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage/loginPage.jsx'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Header />}></Route>
        <Route path="/signup" element={<SignUpPage />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
      </Routes>
    </>
  )
}

export default App

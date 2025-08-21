import './index.css'
import { Routes, Route, useLocation } from 'react-router-dom';
import { Header } from "./components/library/header/header.jsx"
import { Footer } from "./components/library/footer/footer.jsx";
import { SignUpPage } from './pages/SignUpPage/signUpPage.jsx';
import { LoginPage } from './pages/LoginPage/loginPage.jsx'
import { HomePage } from './pages/HomePage/homePage.jsx';

function App() {
  const location = useLocation();
  const hideLayout = ["/signup", "/login"].includes(location.pathname);

  return (
    <>
      {!hideLayout && <Header />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}

export default App;

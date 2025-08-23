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
        <Route
          path="/"
          element={
            <HomePage
              Headline={
                <>
                  Khám phá bản thân và định hướng sự nghiệp{" "}<span className="text-[var(--primary)]">phù hợp</span>{" "}cùng Career Compass
                </>
              }
              SubHeadLine="Career Compass giúp bạn khám phá bản thân, chọn ngành học và ngôi trường phù hợp, đồng thời hỗ trợ luyện phỏng vấn và kiểm tra CV. Đây là nền tảng đồng hành cùng bạn trong từng bước chuẩn bị, để hành trình sự nghiệp thành công bắt đầu từ hôm nay."
              FeatureTitle={
                <>
                Tính năng nổi bật của{" "}<span className="text-[var(--primary)]">Career Compass</span>               
                </>
              }
              FeatureSubTitle="Khám phá các công cụ mạnh mẽ giúp bạn định hướng và phát triển sự nghiệp một cách hiệu quả"
              img="/career-compass-student-confused-choosing-university.png"
            />
          }
        />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}

export default App;

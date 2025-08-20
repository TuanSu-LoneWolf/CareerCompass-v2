import './index.css'
import Header from "./components/library/header/header.jsx"
import { CardBase, SchoolCard } from './components/library/cards/card.jsx';
import logoCC from "./assets/Logo_CC_tron.svg";
import { SignUpForm } from './components/library/signUpForm/signUpForm.jsx';
import { LoginForm } from './components/library/loginForm/loginForm.jsx';

function App() {
  return (
    <>
    <Header></Header>
    <CardBase className="w-xl">
      <h2 className="text-lg font-bold">Tên sản phẩm</h2>
      <p className="text-gray-600">Mô tả ngắn...</p>
    </CardBase>
    <SchoolCard
      className="inline-block"
      logo={logoCC}
      name="Trường đại học Công Thương"
      code="DCT"
      majorsCount="75"
    />
    <SignUpForm 
      logo="Logo_CC_tron_co_chu.svg"
      name="Career Compass"
    ></SignUpForm>
    <LoginForm 
      logo="Logo_CC_tron_co_chu.svg"
      name="Career Compass"
    ></LoginForm>
    </>
  )
}

export default App

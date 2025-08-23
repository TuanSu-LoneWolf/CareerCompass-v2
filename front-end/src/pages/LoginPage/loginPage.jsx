import { LoginForm } from "../../components/library/loginForm/loginForm.jsx";
import logoCC from "../../assets/Logo_CC_tron_co_chu.svg";
export function LoginPage() {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <LoginForm
      logo={logoCC}
      name="Career Compass"
    ></LoginForm>
    </div>
  )
}
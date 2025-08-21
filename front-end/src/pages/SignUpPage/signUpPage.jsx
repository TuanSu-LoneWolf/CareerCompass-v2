import { SignUpForm } from "../../components/library/signUpForm/signUpForm";
import logoCC from "../../../public/Logo_CC_tron_co_chu.svg";
export function SignUpPage() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <SignUpForm
      logo={logoCC}
      name="Career Compass"
    ></SignUpForm>
    </div>
  )
}
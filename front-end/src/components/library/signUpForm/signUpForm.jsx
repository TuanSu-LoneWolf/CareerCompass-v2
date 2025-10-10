import { useState } from "react";
import { Input } from "../input/input.jsx";
import { User, Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../../firebase.js";
import "../cards/card.css";

export function SignUpForm({ logo, name }) {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Xử lý đăng ký bằng email
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const fullName = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    let newErrors = {};
    if (!fullName) newErrors.name = "Vui lòng nhập họ tên";

    if (!email) newErrors.email = "Vui lòng nhập email";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Email không hợp lệ";

    if (!password) newErrors.password = "Vui lòng nhập mật khẩu";
    else if (password.length < 6)
      newErrors.password = "Mật khẩu ít nhất 6 ký tự";

    if (confirmPassword !== password)
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
      // alert("Đăng ký thành công!");
      navigate("/login"); // ✅ Chuyển sang trang đăng nhập
    } catch (error) {
      console.error("Đăng ký thất bại:", error);
      if (error.code === "auth/email-already-in-use") {
        setErrors({ email: "Email này đã được sử dụng" });
      } else {
        alert("Đăng ký thất bại: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Xử lý đăng ký / đăng nhập Google
  const handleGoogleSignUp = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("Google user:", user.email);
      navigate("/"); // ✅ Vào thẳng trang chủ
    } catch (error) {
      console.error("Google signup error:", error);
      alert("Không thể đăng nhập bằng Google: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card-base w-[95%] sm:w-lg mx-auto bg-[var(--card)] shadow-md rounded-2xl p-6 space-y-6 max-h-screen overflow-auto hide-scrollbar"
    >
      <div className="flex flex-col items-center px-5">
        <img className="block mx-auto w-40" src={logo} alt="Logo" />
        <h2 className="inline-block mx-auto mt-3 text-center text-[var(--muted-foreground)]">
          Đăng ký tài khoản {name}
        </h2>
        <p className="text-center text-[var(--primary)]">
          Mỗi người nên sử dụng riêng một tài khoản, tài khoản nhiều người sử
          dụng chung sẽ bị khóa.
        </p>
      </div>

      <div className="space-y-4">
        <Input
          label="Họ và tên *"
          name="name"
          type="text"
          placeholder="Họ và tên"
          variant="primary"
          iconLeft={User}
          error={errors.name}
        />
        <Input
          label="Email *"
          name="email"
          type="email"
          placeholder="Địa chỉ email"
          variant="primary"
          iconLeft={Mail}
          error={errors.email}
        />
        <Input
          label="Mật khẩu *"
          name="password"
          type="password"
          placeholder="Mật khẩu"
          variant="primary"
          iconLeft={Lock}
          error={errors.password}
        />
        <Input
          label="Xác nhận mật khẩu *"
          name="confirmPassword"
          type="password"
          placeholder="Xác nhận mật khẩu"
          variant="primary"
          iconLeft={Lock}
          error={errors.confirmPassword}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-[var(--primary)] text-white font-bold py-2 rounded-md hover:bg-[var(--primary-hover)] transition cursor-pointer mb-0 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Đang đăng ký..." : "Đăng ký"}
      </button>

      {/* GoogleSignUp */}
      <div className="w-full">
        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-[var(--foreground-light)]"></div>
          <span className="px-2 text-[var(--muted-foreground)] text-sm">
            hoặc
          </span>
          <div className="flex-grow h-px bg-[var(--foreground-light)]"></div>
        </div>

        {/* Google button */}
        <button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 outline-none border border-[var(--border)] text-[var(--muted-foreground)] rounded-lg py-2 hover:border-[var(--secondary)] hover:text-[var(--secondary)] transition cursor-pointer mb-4 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          <span>Đăng nhập bằng Google</span>
        </button>

        <div className="flex justify-center items-center gap-1 text-[var(--muted-foreground)]">
          <span>Đã có tài khoản?</span>
          <Link to="/login" className="text-[var(--primary)] font-bold">
            Đăng nhập
          </Link>
        </div>
      </div>
    </form>
  );
}

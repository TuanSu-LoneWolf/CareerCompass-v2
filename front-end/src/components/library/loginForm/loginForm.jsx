import { useState } from "react";
import { Input } from "../input/input.jsx";
import { Mail, Lock } from "lucide-react";
import "../cards/card.css"

export function LoginForm({ logo, name }) {
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    let newErrors = {};
    if (!email) newErrors.email = "Vui lòng nhập email";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email không hợp lệ";

    if (!password) newErrors.password = "Vui lòng nhập mật khẩu";
    else if (password.length < 6) newErrors.password = "Mật khẩu ít nhất 6 ký tự";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Login thành công", { email, password });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card-base w-[95%] sm:w-lg mx-auto bg-[var(--card)] shadow-md rounded-xl p-6 space-y-6 max-h-screen overflow-auto hide-scrollbar"
    >
      <div className="flex flex-col items-center px-2">
        <img className="block mx-auto w-40" src={logo}/>
        <h2 className="inline-block mx-auto my-3 text-center text-[var(--muted-foreground)]">Đăng nhập tài khoản {name}</h2>
        <p className="text-center text-[var(--primary)]">Mỗi người nên sử dụng riêng một tài khoản, tài khoản nhiều người sử dụng chung sẽ bị khóa.</p>
      </div>

      <div className="space-y-4">
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="Địa chỉ email"
          variant="primary"
          iconLeft={Mail}
          error={errors.email}
        />
        <Input
          label="Mật khẩu"
          name="password"
          type="password"
          placeholder="Mật khẩu"
          variant="primary"
          iconLeft={Lock}
          error={errors.password}
          forgotPassword
        />
      </div>
      <button
        type="submit"
        className="w-full bg-[var(--primary)] text-white font-bold py-2 rounded-md hover:bg-[var(--primary-hover)] transition cursor-pointer mb-0"
      >
        Đăng nhập
      </button>

      {/* GoogleLogin */}
      <div className="w-full">

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-[var(--foreground-light)]"></div>
          <span className="px-2 text-[var(--muted-foreground)] text-sm">hoặc</span>
          <div className="flex-grow h-px bg-[var(--foreground-light)]"></div>
        </div>

        {/* Google button */}
        <button type="button" className="w-full flex items-center justify-center gap-2 outline-none border border-[var(--border)] text-[var(--muted-foreground)] rounded-lg py-2 hover:border-[var(--secondary)] hover:text-[var(--secondary)] transition cursor-pointer mb-4">
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          <span>Đăng nhập bằng Google</span>
        </button>
        <div className="flex justify-center items-center gap-1 text-[var(--muted-foreground)]">
          <span>Chưa có tài khoản?</span>
          <a href="/signup" className="text-[var(--primary)] font-bold">Đăng ký</a>
        </div>
      </div>
    </form>
  );
}

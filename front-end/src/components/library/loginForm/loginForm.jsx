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
      className="card-base max-w-lg mx-auto bg-white shadow-md rounded-xl p-6 space-y-6"
    >
      <div className="flex flex-col items-center px-2">
        <img className="block mx-auto w-40" src={logo}/>
        <h2 className="inline-block mx-auto my-3">Đăng nhập tài khoản {name}</h2>
        <p className="text-center text-[var(--primary)]">Mỗi người nên sử dụng riêng một tài khoản, tài khoản nhiều người sử dụng chung sẽ bị khóa.</p>
      </div>

      <div className="space-y-4">
        <Input
          name="email"
          type="email"
          placeholder="Địa chỉ email"
          variant="primary"
          iconLeft={Mail}
          error={errors.email}
        />
        <Input
          name="password"
          type="password"
          placeholder="Mật khẩu"
          variant="primary"
          iconLeft={Lock}
          error={errors.password}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-[var(--primary)] text-white font-bold py-2 rounded-md hover:bg-[var(--primary-hover)] transition"
      >
        Đăng nhập
      </button>
    </form>
  );
}

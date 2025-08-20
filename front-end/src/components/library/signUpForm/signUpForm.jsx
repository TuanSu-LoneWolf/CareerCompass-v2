import { useState } from "react";
import { Input } from "../input/input.jsx";
import { User, Mail, Lock } from "lucide-react";
import "../cards/card.css";

export function SignUpForm({ logo, name }) {
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    let newErrors = {};
    if (!name) newErrors.name = "Vui lòng nhập họ tên";

    if (!email) newErrors.email = "Vui lòng nhập email";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email không hợp lệ";

    if (!password) newErrors.password = "Vui lòng nhập mật khẩu";
    else if (password.length < 6) newErrors.password = "Mật khẩu ít nhất 6 ký tự";

    if (confirmPassword !== password)
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Đăng ký thành công", { name, email, password });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card-base max-w-lg mx-auto bg-white shadow-md rounded-2xl p-6 space-y-6"
    >
      <div className="flex flex-col items-center px-5">
        <img className="block mx-auto w-40" src={logo}/>
        <h2 className="inline-block mx-auto my-3">Đăng ký tài khoản {name}</h2>
        <p className="text-center text-[var(--primary)]">Mỗi người nên sử dụng riêng một tài khoản, tài khoản nhiều người sử dụng chung sẽ bị khóa.</p>
      </div>

      <div className="space-y-4">
        <Input
          label="Họ và tên"
          type="text"
          placeholder="Họ và tên"
          variant="primary"
          iconLeft={User}
          error={errors.name}
        />
        <Input
          label="Email"
          type="email"
          placeholder="Địa chỉ email"
          variant="primary"
          iconLeft={Mail}
          error={errors.email}
        />
        <Input
          label="Mật khẩu"
          type="password"
          placeholder="Mật khẩu"
          variant="primary"
          iconLeft={Lock}
          error={errors.password}
        />
        <Input
          label="Xác nhận mật khẩu"
          type="password"
          placeholder="Xác nhận mật khẩu"
          variant="primary"
          iconLeft={Lock}
          error={errors.confirmPassword}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-[var(--primary)] text-white font-bold py-2 rounded-md hover:bg-[var(--primary-hover)] transition"
      >
        Đăng ký
      </button>
    </form>
  );
}

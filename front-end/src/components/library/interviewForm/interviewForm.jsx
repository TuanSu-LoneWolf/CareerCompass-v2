// CareerForm.jsx
import { useState } from "react";
import { Input, Radio } from "../input/input.jsx";
import { Mail, Phone, User, ChevronDown, Check } from "lucide-react";
import careersData from "../../../../../front-end/Data/interview/interview.json";

export function InterviewForm({ onSuccess }) {
  const [errors, setErrors] = useState({});
  const [option, setOption] = useState("");
  const [career, setCareer] = useState("");
  const [openCareer, setOpenCareer] = useState(false);
  const [hoverCareer, setHoverCareer] = useState(null);

  const options = [
    { key: "hoc-sinh", value: "Học sinh" },
    { key: "sinh-vien", value: "Sinh viên" },
    { key: "nguoi-di-lam", value: "Người đi làm" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const phone = formData.get("phone");

    let newErrors = {};

    if (!name) newErrors.name = "Vui lòng nhập họ và tên";
    if (!option) newErrors.option = "Vui lòng chọn bậc học";
    if (!career) newErrors.career = "Vui lòng chọn tỉnh/thành phố";

    if (email && !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (phone && !/^(0|\+84)\d{9}$/.test(phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ (10 chữ số)";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Thông tin hợp lệ ✅", {
        name,
        option,
        career,
        email,
        phone,
      });
      if (onSuccess) onSuccess({ name, option, career, email, phone });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card-base w-[95%] sm:w-3xl mx-auto bg-[var(--card)] shadow-md rounded-2xl p-6 space-y-6"
    >
      {/* Title */}
      <div className="flex gap-2 items-center">
        <User className="w-6 h-6 text-[var(--primary)]" />
        <h2 className="text-2xl font-bold text-[var(--primary)]">
          Thông tin cá nhân
        </h2>
      </div>

      <div className="space-y-4">
        {/* Họ và tên */}
        <Input
          label="Họ và tên *"
          name="name"
          type="text"
          placeholder="Nhập họ và tên"
          variant="primary"
          iconLeft={User}
          error={errors.name}
          onChange={() => setErrors((prev) => ({ ...prev, name: undefined }))}
        />

        {/* Radio */}
        <Radio
          label="Bạn là"
          options={options}
          value={option}
          onChange={(val) => {
            setOption(val);
            setErrors((prev) => ({ ...prev, option: undefined }));

            // ✅ Nếu trước đó có lỗi thì submit lại
            if (errors.option) {
              // giả lập event để gọi handleSubmit
              handleSubmit(
                new Event("submit", { cancelable: true, bubbles: true })
              );
            }
          }}
          error={errors.option}
        />

        {/* Dropdown Nhóm ngành ứng tuyển */}
        <div className="flex flex-col w-full relative">
          <label
            className={`mb-1 text-sm font-medium ${
              errors.career ? "text-red-500" : "text-[var(--primary)]"
            }`}
          >
            Nhóm ngành ứng tuyển{" "}
            <span
              className={`text-[var(--primary)]] ${
                errors.career ? "text-red-500" : "text-[var(--primary)]"
              }`}
            >
              *
            </span>
          </label>
          <button
            type="button"
            onClick={() => setOpenCareer(!openCareer)}
            className={`flex items-center justify-between w-full px-3 py-2 rounded-lg border text-left text-gray-400 ${
              errors.career
                ? "border-red-500 text-red-500"
                : "border-[var(--border)] text-[var(--input-foreground)]"
            } bg-[var(--input)]`}
          >
            {career || "-- Chọn nhóm ngành ứng tuyển --"}
            <ChevronDown className="w-4 h-4 ml-2" />
          </button>

          {openCareer && (
            <div
              className="absolute z-20 mt-16 w-full bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-lg overflow-hidden max-h-[200px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none]"
              onMouseLeave={() => setHoverCareer(null)}
            >
              {careersData.careers.map((c, i) => {
                const isSelected = career === c.name;
                const isHover = hoverCareer === c.name;
                return (
                  <div
                    key={i}
                    onClick={() => {
                      setCareer(c.name);
                      setErrors((prev) => ({ ...prev, career: undefined }));
                      setOpenCareer(false);
                    }}
                    onMouseEnter={() => setHoverCareer(c.name)}
                    className={`flex items-center justify-between px-4 py-2 text-sm cursor-pointer
                      ${
                        isHover || (isSelected && hoverCareer === null)
                          ? "bg-[var(--accent)] text-[var(--filter-hover)]"
                          : "bg-[var(--card)] text-[var(--muted-foreground)]"
                      }
                    `}
                  >
                    {c.name}
                    {isSelected && <Check className="w-4 h-4" />}
                  </div>
                );
              })}
            </div>
          )}
          {errors.career && (
            <p className="text-red-500 text-sm mt-1">{errors.career}</p>
          )}
        </div>

        {/* Email */}
        <Input
          label="Email (không bắt buộc)"
          name="email"
          type="email"
          placeholder="Địa chỉ email"
          variant="primary"
          iconLeft={Mail}
          error={errors.email}
          onChange={() => setErrors((prev) => ({ ...prev, email: undefined }))}
        />

        {/* Số điện thoại */}
        <Input
          label="Số điện thoại (không bắt buộc)"
          name="phone"
          type="tel"
          placeholder="Nhập số điện thoại"
          variant="primary"
          iconLeft={Phone}
          error={errors.phone}
          onChange={() => setErrors((prev) => ({ ...prev, phone: undefined }))}
        />
      </div>

      {/* Nút submit */}
      <button
        type="submit"
        className="w-full bg-[var(--primary)] text-white font-bold py-2 rounded-md hover:bg-[var(--primary-hover)] transition cursor-pointer"
      >
        Tiếp tục
      </button>
    </form>
  );
}

// CareerForm.jsx
import { useState } from "react";
import { Input, StudentLevelRadio } from "../input/input.jsx";
import { Mail, Phone, User, ChevronDown, Check } from "lucide-react";

export function CareerForm({ onSuccess }) {
  const [errors, setErrors] = useState({});
  const [level, setLevel] = useState("");
  const [city, setCity] = useState("");
  const [openCity, setOpenCity] = useState(false);
  const [hoverCity, setHoverCity] = useState(null);

  const VietNamProvinces = [
  // Thành phố trực thuộc TW
  "Hà Nội",
  "Hải Phòng",
  "Đà Nẵng",
  "Huế",
  "Hồ Chí Minh",
  "Cần Thơ",

  // Các tỉnh (A → Z)
  "An Giang",
  "Bắc Ninh",
  "Cao Bằng",
  "Điện Biên",
  "Gia Lai",
  "Hà Tĩnh",
  "Khánh Hòa",
  "Lâm Đồng",
  "Lào Cai",
  "Nghệ An",
  "Phú Thọ",
  "Quảng Ngãi",
  "Quảng Ninh",
  "Quảng Trị",
  "Sơn La",
  "Tây Ninh",
  "Thanh Hóa",
  "Thái Nguyên",
  "Tuyên Quang"
];


  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const phone = formData.get("phone");

    let newErrors = {};

    if (!name) newErrors.name = "Vui lòng nhập họ và tên";
    if (!level) newErrors.level = "Vui lòng chọn bậc học";
    if (!city) newErrors.city = "Vui lòng chọn tỉnh/thành phố";

    if (email && !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (phone && !/^(0|\+84)\d{9}$/.test(phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ (10 chữ số)";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Thông tin hợp lệ ✅", { name, level, city, email, phone });
      if (onSuccess) onSuccess({ name, level, city, email, phone });
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

        {/* Radio học sinh */}
        <StudentLevelRadio
          value={level}
          onChange={(val) => {
            setLevel(val);
            setErrors((prev) => ({ ...prev, level: undefined }));
          }}
          error={errors.level}
        />

        {/* Dropdown Tỉnh/Thành phố */}
        <div className="flex flex-col w-full relative">
          <label
            className={`mb-1 text-sm font-medium ${
              errors.city ? "text-red-500" : "text-[var(--primary)]"
            }`}
          >
            Tỉnh/Thành phố hiện tại{" "}
            <span className="text-[var(--primary)]">*</span>
          </label>
          <button
            type="button"
            onClick={() => setOpenCity(!openCity)}
            className={`flex items-center justify-between w-full px-3 py-2 rounded-lg border text-left text-gray-400 ${
              errors.city
                ? "border-red-500 text-red-500"
                : "border-[var(--border)] text-[var(--input-foreground)]"
            } bg-[var(--input)]`}
          >
            {city || "-- Chọn tỉnh/thành phố --"}
            <ChevronDown className="w-4 h-4 ml-2" />
          </button>

          {openCity && (
            <div
              className="absolute z-20 mt-16 w-full bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-lg overflow-hidden max-h-[200px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none]"
              onMouseLeave={() => setHoverCity(null)}
            >
              {VietNamProvinces.map((c, i) => {
                const isSelected = city === c;
                const isHover = hoverCity === c;
                return (
                  <div
                    key={i}
                    onClick={() => {
                      setCity(c);
                      setErrors((prev) => ({ ...prev, city: undefined }));
                      setOpenCity(false);
                    }}
                    onMouseEnter={() => setHoverCity(c)}
                    className={`flex items-center justify-between px-4 py-2 text-sm cursor-pointer
                      ${
                        isHover || (isSelected && hoverCity === null)
                          ? "bg-[var(--accent)] text-[var(--filter-hover)]"
                          : "bg-[var(--card)] text-[var(--muted-foreground)]"
                      }
                    `}
                  >
                    {c}
                    {isSelected && <Check className="w-4 h-4" />}
                  </div>
                );
              })}
            </div>
          )}
          {errors.city && (
            <p className="text-red-500 text-sm mt-1">{errors.city}</p>
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

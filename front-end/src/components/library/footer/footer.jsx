import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 px-6 border border-gray-700">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Logo + About */}
        <div>
          <img src="/Logo_CC_tron_co_chu.svg" className="w-40"></img>
          <p className="mt-3 text-sm text-justify">
            Nền tảng định hướng nghề nghiệp thông minh, giúp học sinh khám phá bản thân và chọn ngành phù hợp.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Liên kết</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-white transition">Trang chủ</a></li>
            <li><a href="/universities-majors" className="hover:text-white transition">Danh sách Đại học</a></li>
            <li><a href="/career-guidance" className="hover:text-white transition">Hướng nghiệp</a></li>
            <li><a href="/interview-practice" className="hover:text-white transition">Luyện phỏng vấn</a></li>
            <li><a href="/cv-check" className="hover:text-white transition">Kiểm tra CV</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Liên hệ</h3>
          <p className="text-sm">Email: tuansu1561@gmail.com</p>
          <p className="text-sm">SĐT: 0906 950 881</p>
          <p className="text-sm">Địa chỉ: TP.HCM, Việt Nam</p>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Kết nối</h3>
          <div className="flex space-x-4 text-gray-400 text-xl">
            <a href="#" className="hover:text-blue-500 transition"><Facebook /></a>
            <a href="#" className="hover:text-pink-500 transition"><Instagram /></a>
            <a href="#" className="hover:text-blue-700 transition"><Linkedin /></a>
            <a href="#" className="hover:text-sky-400 transition"><Twitter /></a>
            <a href="#" className="hover:text-red-500 transition"><Youtube /></a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Career Compass. All rights reserved.
      </div>
    </footer>
  );
}

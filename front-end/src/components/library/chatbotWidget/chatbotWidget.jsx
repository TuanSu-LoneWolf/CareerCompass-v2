import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Nút mở chat */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Cửa sổ chat */}
      {isOpen && (
        <div className="w-80 h-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-blue-600 text-white flex justify-between items-center px-4 py-2">
            <h3 className="font-semibold">Career Compass Chatbot</h3>
            <button onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {/* Body (messages) */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2 text-sm bg-gray-50">
            <div className="bg-gray-200 text-gray-800 p-2 rounded-lg max-w-[70%]">
              Xin chào 👋! Tôi có thể giúp gì cho bạn?
            </div>
            {/* Chỗ này bạn sẽ map message list */}
          </div>

          {/* Input */}
          <div className="border-t p-2 flex items-center gap-2">
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-200"
            />
            <button className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition">
              Gửi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

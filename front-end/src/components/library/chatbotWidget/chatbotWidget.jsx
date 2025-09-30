import { useState, useEffect, useRef } from "react";
import { Bot, User, Send, X } from "lucide-react";

export function ChatbotWidget() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const currentTime = getCurrentTime();
      setMessages([
        {
          sender: "bot",
          text: "Chào bạn! Mình sẽ hỗ trợ tư vấn hướng nghiệp. Bạn hãy nhập câu hỏi nhé.",
          time: currentTime,
        },
      ]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getCurrentTime = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const currentTime = getCurrentTime();
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: input, time: currentTime },
    ]);

    const question = input;
    setInput("");

    const loadingMsg = {
      sender: "bot",
      text: "Đang xử lý...",
      time: getCurrentTime(),
      loading: true,
    };
    setMessages((prev) => [...prev, loadingMsg]);

    try {
      const response = await fetch("http://localhost:5000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) throw new Error(`Lỗi server: ${response.status}`);
      const data = await response.json();

      setMessages((prev) =>
        prev.map((msg, i) =>
          i === prev.length - 1
            ? {
                ...msg,
                text: data.answer || "Xin lỗi, không thể xử lý yêu cầu.",
                loading: false,
                time: getCurrentTime(),
              }
            : msg
        )
      );
    } catch (error) {
      console.error("API error:", error);
      setMessages((prev) =>
        prev.map((msg, i) =>
          i === prev.length - 1
            ? {
                ...msg,
                text: "Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.",
                loading: false,
                time: getCurrentTime(),
              }
            : msg
        )
      );
    }
  };

  return (
    <div className="w-full z-50">
      {/* Nút mở chat */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="cursor-pointer fixed right-0 bottom-4 sm:right-4 w-14 h-14 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg flex items-center justify-center hover:scale-105 transition"
        >
          <Bot className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Khung chat */}
      {isOpen && (
        <div className="fixed right-0 bottom-4 sm:right-4 flex flex-col w-full sm:max-w-[350px]  h-[500px] rounded-2xl shadow-lg overflow-hidden border border-[var(--border)] bg-[var(--background)] text-gray-900">
          {/* Header */}
          <div className="flex justify-between items-center h-16 py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-500">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div className="ml-2">
                <h1 className="text-base font-bold text-white">
                  Career Compass
                </h1>
                <p className="text-xs text-gray-100">Trợ lí hướng nghiệp</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Chat window */}
          <div className="flex flex-grow flex-col overflow-y-auto p-3 space-y-2 bg-[var(--background)] hide-scrollbar">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start ${
                  msg.sender === "bot" ? "justify-start" : "justify-end"
                }`}
              >
                {msg.sender === "bot" && (
                  <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full bg-indigo-500 mr-2">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}
                <div
                  className={`inline-block max-w-[70%] w-fit px-3 py-3 rounded-[var(--radius)] shadow-sm text-sm text-[var(--foreground)] ${
                    msg.sender === "bot"
                      ? "bg-[var(--card)]"
                      : "bg-[var(--card)]"
                  }`}
                >
                  <div
                    className="whitespace-pre-wrap break-words"
                    style={{ overflowWrap: "anywhere" }}
                  >
                    {msg.text}
                  </div>
                  <div className="text-[10px] text-[var(--muted-foreground)] mt-1">
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messageEndRef}></div>
          </div>

          {/* Input area */}
          <div className="flex items-center border-t border-[var(--border)] px-3 py-2 bg-[var(--card)]">
            <input
              type="text"
              placeholder="Nhập câu hỏi..."
              className="flex-grow bg-transparent outline-none text-sm px-2 text-[var(--muted-foreground)]"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <button
              onClick={sendMessage}
              className="cursor-pointer ml-2 bg-gradient-to-r from-indigo-500 to-purple-500 p-2 rounded-lg hover:opacity-80 transition"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

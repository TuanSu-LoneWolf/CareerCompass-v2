import { useState, useRef, useEffect } from "react";
import { Mic } from "lucide-react";

export function VoiceRecorderWithSTT({ onChange }) {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = "vi-VN";
      recognition.interimResults = true; // nhận kết quả tạm thời
      recognition.continuous = true;

      recognition.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        onChange((prev) => prev + transcript); // nối thêm vào nội dung hiện tại
      };

      recognitionRef.current = recognition;
    } else {
      console.warn("Browser không hỗ trợ SpeechRecognition");
    }
  }, [onChange]);

  const handleRecord = async () => {
    if (isRecording) {
      // Dừng ghi âm
      mediaRecorderRef.current.stop();
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      // Bắt đầu ghi âm
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorder.start();
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        onClick={handleRecord}
        className={`flex justify-center items-center rounded-full w-16 h-16 cursor-pointer duration-300 transition-all hover:bg-amber-600 ${
          isRecording ? "bg-amber-600 animate-pulse" : "bg-[var(--secondary)]"
        }`}
      >
        <Mic
          className={`w-5 h-5 text-white`}
        />
      </div>
      <p className="text-[12px] text-[var(--muted-foreground)]">
        {isRecording ? "Đang ghi âm..." : "Nhấn để bắt đầu ghi âm"}
      </p>
    </div>
  );
}

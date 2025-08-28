import './button.css'
import loadingIcon from '../../../assets/loading.png';
import { ArrowRight, ArrowLeft } from "lucide-react";

export function Button ({
    children,
    type = "primary",
    loading = false,
    start = false,
    back = false,
    disabled = false,
    className="",
    onClick
}) {
    return (
        <button onClick={onClick} className = {`${type} ${disabled ? "disabled" : ''} ${loading ? "loading" : ''} ${className} flex justify-center items-center gap-2 group`}>
            {loading && (<img src={loadingIcon} className="animate-spin w-4 h-4" alt="Loading_icon"></img>)}
            {back && (<ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-[-4px]" />)}
            {children}
            {start && (<ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />)}
        </button>
    )
}

export function FloatingButton ({ icon, text, color = "text-blue-500", dotColor }) {
  return (
    <button className="bg-[var(--card)] px-4 py-2 rounded-xl shadow-md flex items-center gap-2">
      {/* Nếu có dotColor thì hiện chấm tròn, ngược lại hiện icon */}
      {dotColor ? (
        <span className={`w-3 h-3 rounded-full`} style={{ backgroundColor: dotColor }}></span>
      ) : (
        <span className={color}>{icon}</span>
      )}
      <span className="font-medium">{text}</span>
    </button>
  );
};
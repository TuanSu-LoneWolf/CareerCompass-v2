import './button.css'
import loadingIcon from '../../../assets/loading.png';

const Button = ({
    children,
    type = "primary",
    loading = false,
    disabled = false,
    className=""
}) => {
    return (
        <button className = {`${type} ${disabled ? "disabled" : ''} ${loading ? "loading" : ''} ${className}`}>
            {loading && (<img src={loadingIcon} className="animate-spin w-4 h-4" alt="Loading_icon"></img>)}
            {children}
        </button>
    )
}

export default Button;
interface ButtonProps {
    text: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export default function Button({ 
    text, 
    onClick, 
    variant = 'primary', 
    disabled = false,
    size = 'sm'
}: ButtonProps) {
    const baseClasses = "px-3 py-1 text-xs rounded transition-colors focus:outline-none focus:ring-2";
    
    const variantClasses = {
        primary: "text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
        secondary: "text-gray-600 border border-gray-300 bg-white hover:bg-gray-50 focus:ring-gray-500",
        danger: "text-white bg-red-600 hover:bg-red-700 focus:ring-red-500"
    };
    
    const disabledClasses = "bg-gray-400 cursor-not-allowed hover:bg-gray-400";
    
    const sizeClasses = {
        sm: "px-2 py-1 text-xs",
        md: "px-3 py-2 text-sm", 
        lg: "px-4 py-2 text-base"
    };

    const className = `${baseClasses} ${sizeClasses[size]} ${
        disabled ? disabledClasses : variantClasses[variant]
    }`;

    return (
        <button 
            onClick={onClick} 
            disabled={disabled}
            className={className}
        >
            {text}
        </button>
    );
}
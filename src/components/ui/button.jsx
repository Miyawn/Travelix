export function Button({ children, className = "", onClick, variant = "default", type = "button" }) {
  const baseStyle =
    "px-4 py-2 rounded-xl font-semibold transition duration-200";

  const variantStyle = {
    default: "bg-blue-500 text-white hover:bg-blue-600",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyle} ${variantStyle[variant] || ""} ${className}`}
    >
      {children}
    </button>
  );
}

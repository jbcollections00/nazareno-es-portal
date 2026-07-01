export default function Card({
  children,
  className = "",
}) {
  return (
    <div
      className={`
        bg-white
        rounded-3xl
        shadow-sm
        hover:shadow-lg
        transition
        duration-300
        ${className}
      `}
    >
      {children}
    </div>
  );
}
``
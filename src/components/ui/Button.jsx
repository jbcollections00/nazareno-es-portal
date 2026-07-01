import Link from "next/link";

export default function Button({
  children,
  href,
  variant = "primary",
}) {
  const styles = {
    primary:
      "bg-blue-900 text-white hover:bg-blue-800",
    secondary:
      "bg-yellow-400 text-blue-900 hover:bg-yellow-300",
    outline:
      "border border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white",
  };

  const className = `
    inline-flex
    items-center
    justify-center
    px-6
    py-3
    rounded-xl
    font-semibold
    transition
    duration-300
    ${styles[variant]}
  `;

  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button className={className}>
      {children}
    </button>
  );
}
export default function SectionTitle({
  title,
  subtitle,
  center = false,
}) {
  return (
    <div
      className={`mb-12 ${
        center ? "text-center" : ""
      }`}
    >
      <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-4 text-slate-600 max-w-3xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
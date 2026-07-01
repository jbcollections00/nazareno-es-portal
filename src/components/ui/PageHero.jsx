import Container from "./Container";

export default function PageHero({
  title,
  description,
}) {
  return (
    <section className="bg-blue-900 text-white py-20">
      <Container>
        <h1 className="text-5xl md:text-6xl font-bold">
          {title}
        </h1>

        <p className="mt-6 text-blue-100 max-w-3xl text-lg">
          {description}
        </p>
      </Container>
    </section>
  );
}
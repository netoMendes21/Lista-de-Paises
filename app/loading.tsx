export default function Loading() {
  return (
    <section className="loading-grid" role="status" aria-label="Carregando países">
      <p className="sr-only">Carregando países…</p>
      <div className="country-grid" aria-hidden="true">
        {Array.from({ length: 20 }, (_, index) => (
          <div key={index} className="skeleton" />
        ))}
      </div>
    </section>
  );
}

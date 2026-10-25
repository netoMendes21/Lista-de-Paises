import Link from "next/link";

export default function AttractionNotFound() {
  return (
    <section className="message-state">
      <h1>Atração não encontrada</h1>
      <p>Este lugar não está disponível no destino selecionado.</p>
      <Link href="/" className="navigation-button">
        Explorar países
      </Link>
    </section>
  );
}

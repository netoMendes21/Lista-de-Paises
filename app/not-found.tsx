import Link from "next/link";

export default function NotFound() {
  return (
    <section className="message-state">
      <h1>País não encontrado</h1>
      <p>Há muitos outros lugares para descobrir.</p>
      <Link href="/" className="navigation-button">
        Voltar para a lista de países
      </Link>
    </section>
  );
}

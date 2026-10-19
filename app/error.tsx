"use client";
import Link from "next/link";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <section className="message-state">
      <h1>Não foi possível carregar os países.</h1>
      <p>O serviço de dados pode estar indisponível. Tente novamente em instantes.</p>
      <button onClick={reset} className="primary-button">
        Tentar novamente
      </button>
      <Link href="/">Voltar para a lista</Link>
    </section>
  );
}

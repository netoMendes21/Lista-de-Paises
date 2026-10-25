import Link from "next/link";
import Icon from "@/components/icon";

export default function BackLink({ href }: { href: string }) {
  return (
    <Link href={href} className="back-link navigation-button">
      <Icon name="arrow-left" />
      <span>Voltar</span>
    </Link>
  );
}

type IconName = "globe" | "sun" | "moon" | "search" | "filter" | "arrow-left";

/** Ícones locais reutilizados por URL, com a cor herdada do tema. */
export default function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  return (
    <span
      className={`icon ${className}`.trim()}
      style={{ maskImage: `url("/icons/${name}.svg")` }}
      aria-hidden="true"
    />
  );
}

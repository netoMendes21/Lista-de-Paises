import GlobeIcon from "@/components/globe-icon";

export default function LoadingState({ message }: { message: string }) {
  return (
    <section className="loading-state" role="status" aria-live="polite">
      <GlobeIcon />
      <p>{message}</p>
    </section>
  );
}

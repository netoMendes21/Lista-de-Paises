"use client";

import Icon from "@/components/icon";
import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const update = () => {
    let preference: string | null = null;
    try {
      preference = localStorage.getItem("countries-theme");
    } catch {
      /* Tema disponível sem armazenamento. */
    }
    document.documentElement.dataset.theme =
      preference === "light" || preference === "dark"
        ? preference
        : media.matches
          ? "dark"
          : "light";
    callback();
  };
  media.addEventListener("change", update);
  window.addEventListener("storage", update);
  window.addEventListener("themechange", callback);
  update();
  return () => {
    media.removeEventListener("change", update);
    window.removeEventListener("storage", update);
    window.removeEventListener("themechange", callback);
  };
}

export default function ThemeToggle() {
  const theme = useSyncExternalStore(
    subscribe,
    () => document.documentElement.dataset.theme,
    () => undefined,
  );
  function setTheme(value: "light" | "dark") {
    document.documentElement.dataset.theme = value;
    try {
      localStorage.setItem("countries-theme", value);
    } catch {
      /* Mantém a escolha nesta página. */
    }
    window.dispatchEvent(new Event("themechange"));
  }
  return (
    <div className="theme-switch" role="group" aria-label="Tema da página">
      <button
        type="button"
        className="theme-light"
        aria-label="Usar tema claro"
        aria-pressed={theme === "light"}
        onClick={() => setTheme("light")}
      >
        <Icon name="sun" />
      </button>
      <button
        type="button"
        className="theme-dark"
        aria-label="Usar tema escuro"
        aria-pressed={theme === "dark"}
        onClick={() => setTheme("dark")}
      >
        <Icon name="moon" />
      </button>
    </div>
  );
}

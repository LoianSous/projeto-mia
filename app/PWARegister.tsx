"use client";

import { useEffect } from "react";

function getBasePathFromLocation() {
  // Funciona tanto em local (/) quanto em GH Pages (/projeto-mia)
  // Heurística: se estiver no GH pages, o 1º segmento é o nome do repo.
  // Como seu repo é "projeto-mia", usamos isso como detecção.
  const p = window.location.pathname;

  if (p.startsWith("/projeto-mia")) return "/projeto-mia";
  return "";
}

export default function PWARegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const base = getBasePathFromLocation();
    const swUrl = `${base}/sw.js`;

    navigator.serviceWorker
      .register(swUrl, { scope: `${base || "/"}${base ? "/" : ""}` })
      .catch((err) => console.error("SW register failed:", err));
  }, []);

  return null;
}
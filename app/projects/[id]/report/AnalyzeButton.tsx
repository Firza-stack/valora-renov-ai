"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AnalyzeButton({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function analyzeProject() {
    setLoading(true);

    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ projectId }),
    });

    const result = await response.json();

    setLoading(false);

    if (!response.ok) {
      alert("Erreur IA : " + result.error);
      return;
    }

    alert("Analyse IA terminée !");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={analyzeProject}
      disabled={loading}
      className="rounded-xl bg-[#173f2b] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
    >
      {loading ? "Analyse en cours..." : "Lancer l’analyse IA"}
    </button>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GenerateImageButton({
  projectId,
  sourceImageUrl,
}: {
  projectId: string;
  sourceImageUrl: string;
}) {
  const router = useRouter();
  const [style, setStyle] = useState("Jungle");
  const [loading, setLoading] = useState(false);

  async function generateImage() {
    setLoading(true);

    const response = await fetch("/api/generate-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ projectId, sourceImageUrl, style }),
    });

    const result = await response.json();

    setLoading(false);

    if (!response.ok) {
      alert("Erreur génération : " + result.error);
      return;
    }

    alert("Image générée !");
    router.refresh();
  }

  return (
    <div className="mt-6 rounded-2xl border border-[#d8d2c3] bg-[#faf8f2] p-5">
      <label className="mb-2 block text-sm font-semibold">
        Style de rénovation
      </label>

      <select
        value={style}
        onChange={(e) => setStyle(e.target.value)}
        className="mb-4 w-full rounded-xl border border-[#d8d2c3] px-4 py-3 outline-none"
      >
        <option>Jungle</option>
        <option>Moderne chaleureux</option>
        <option>Japandi</option>
        <option>Minimaliste</option>
        <option>Haussmannien moderne</option>
      </select>

      <button
        type="button"
        onClick={generateImage}
        disabled={loading}
        className="w-full rounded-xl bg-[#173f2b] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {loading ? "Génération en cours..." : "Générer l’image après rénovation"}
      </button>
    </div>
  );
}
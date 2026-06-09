"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Project = {
  id: string;
  title: string;
  city: string;
  surface: number;
  purchase_price: number;
  objective: string;
  condition: string;
};

export default function EditProjectForm({ project }: { project: Project }) {
  const router = useRouter();

  const [title, setTitle] = useState(project.title ?? "");
  const [city, setCity] = useState(project.city ?? "");
  const [surface, setSurface] = useState(String(project.surface ?? ""));
  const [purchasePrice, setPurchasePrice] = useState(
    String(project.purchase_price ?? "")
  );
  const [objective, setObjective] = useState(project.objective ?? "Revente");
  const [condition, setCondition] = useState(project.condition ?? "À rénover");

  async function updateProject() {
    const { error } = await supabase
      .from("Projects")
      .update({
        title,
        city,
        surface: Number(surface),
        purchase_price: Number(purchasePrice),
        objective,
        condition,
      })
      .eq("id", project.id);

    if (error) {
      alert("Erreur modification : " + error.message);
      return;
    }

    alert("Projet modifié !");
    router.push("/");
    router.refresh();
  }

  return (
    <div className="space-y-6 rounded-2xl bg-white p-8 shadow-sm">
      <div>
        <label className="mb-2 block text-sm font-semibold">Nom du projet</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-xl border border-[#d8d2c3] px-4 py-3 outline-none"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold">Ville</label>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full rounded-xl border border-[#d8d2c3] px-4 py-3 outline-none"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold">Surface (m²)</label>
        <input
          type="number"
          value={surface}
          onChange={(e) => setSurface(e.target.value)}
          className="w-full rounded-xl border border-[#d8d2c3] px-4 py-3 outline-none"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold">
          Prix d’achat (€)
        </label>
        <input
          type="number"
          value={purchasePrice}
          onChange={(e) => setPurchasePrice(e.target.value)}
          className="w-full rounded-xl border border-[#d8d2c3] px-4 py-3 outline-none"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold">Objectif</label>
        <select
          value={objective}
          onChange={(e) => setObjective(e.target.value)}
          className="w-full rounded-xl border border-[#d8d2c3] px-4 py-3 outline-none"
        >
          <option>Revente</option>
          <option>Location</option>
          <option>Résidence principale</option>
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold">État général</label>
        <select
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          className="w-full rounded-xl border border-[#d8d2c3] px-4 py-3 outline-none"
        >
          <option>À rafraîchir</option>
          <option>À rénover</option>
          <option>Rénovation lourde</option>
        </select>
      </div>

      <button
        type="button"
        onClick={updateProject}
        className="w-full rounded-xl bg-[#173f2b] px-5 py-4 font-semibold text-white"
      >
        Enregistrer les modifications
      </button>
    </div>
  );
}
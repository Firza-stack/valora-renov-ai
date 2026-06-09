"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function NewProjectPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const [surface, setSurface] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [objective, setObjective] = useState("Revente");
  const [condition, setCondition] = useState("À rénover");
  const [files, setFiles] = useState<FileList | null>(null);

  async function createProject() {
    const { data, error } = await supabase
      .from("Projects")
      .insert({
        title,
        city,
        surface: Number(surface),
        purchase_price: Number(purchasePrice),
        objective,
        condition,
      })
      .select()
      .single();

    if (error) {
      alert("Erreur projet : " + error.message);
      return;
    }

    if (files && files.length > 0) {
      for (const file of Array.from(files)) {
        const filePath = `${data.id}/${Date.now()}-${file.name}`;

        const uploadResult = await supabase.storage
          .from("project-images")
          .upload(filePath, file);

        if (uploadResult.error) {
          alert("Erreur upload image : " + uploadResult.error.message);
          return;
        }

        const publicUrl = supabase.storage
          .from("project-images")
          .getPublicUrl(filePath).data.publicUrl;

        const imageInsert = await supabase.from("ProjectImages").insert({
          project_id: data.id,
          image_url: publicUrl,
        });

        if (imageInsert.error) {
          alert("Erreur sauvegarde image : " + imageInsert.error.message);
          return;
        }
      }
    }

    alert("Projet créé avec photos !");
    router.push("/");
  }

  return (
    <main className="min-h-screen bg-[#f4f1ea] px-6 py-10 text-[#10291f]">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-2 text-4xl font-bold">Nouveau projet</h1>

        <p className="mb-10 text-[#5f6f65]">
          Créez une nouvelle analyse immobilière.
        </p>

        <div className="space-y-6 rounded-2xl bg-white p-8 shadow-sm">
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Nom du projet
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Appartement Mont-de-Marsan"
              className="w-full rounded-xl border border-[#d8d2c3] px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">Ville</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Mont-de-Marsan"
              className="w-full rounded-xl border border-[#d8d2c3] px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Surface (m²)
            </label>
            <input
              type="number"
              value={surface}
              onChange={(e) => setSurface(e.target.value)}
              placeholder="67"
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
              placeholder="107000"
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
            <label className="mb-2 block text-sm font-semibold">
              État général
            </label>
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

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Photos du bien
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setFiles(e.target.files)}
              className="w-full rounded-xl border border-[#d8d2c3] p-3"
            />
          </div>

          <button
            type="button"
            onClick={createProject}
            className="w-full rounded-xl bg-[#173f2b] px-5 py-4 font-semibold text-white"
          >
            Créer le projet
          </button>
        </div>
      </div>
    </main>
  );
}
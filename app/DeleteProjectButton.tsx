"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function DeleteProjectButton({ projectId }: { projectId: string }) {
  const router = useRouter();

  async function deleteProject() {
    const confirmDelete = confirm(
      "Supprimer ce projet, ses photos et ses analyses IA ?"
    );

    if (!confirmDelete) return;

    // 1. Récupérer les images liées au projet
    const { data: images, error: imagesError } = await supabase
      .from("ProjectImages")
      .select("*")
      .eq("project_id", projectId);

    if (imagesError) {
      alert("Erreur récupération images : " + imagesError.message);
      return;
    }

    // 2. Supprimer les fichiers du Storage
    if (images && images.length > 0) {
      const filePaths = images
        .map((image) => {
          const url = image.image_url as string;
          const marker = "/project-images/";
          const index = url.indexOf(marker);

          if (index === -1) return null;

          return url.substring(index + marker.length);
        })
        .filter(Boolean) as string[];

      if (filePaths.length > 0) {
        const { error: storageError } = await supabase.storage
          .from("project-images")
          .remove(filePaths);

        if (storageError) {
          alert("Erreur suppression fichiers : " + storageError.message);
          return;
        }
      }
    }

    // 3. Supprimer les lignes images
    const { error: deleteImagesError } = await supabase
      .from("ProjectImages")
      .delete()
      .eq("project_id", projectId);

    if (deleteImagesError) {
      alert("Erreur suppression images : " + deleteImagesError.message);
      return;
    }

    // 4. Supprimer les analyses IA
    const { error: deleteAnalysesError } = await supabase
      .from("ProjectAnalyses")
      .delete()
      .eq("project_id", projectId);

    if (deleteAnalysesError) {
      alert("Erreur suppression analyses : " + deleteAnalysesError.message);
      return;
    }

    // 5. Supprimer le projet
    const { error: deleteProjectError } = await supabase
      .from("Projects")
      .delete()
      .eq("id", projectId);

    if (deleteProjectError) {
      alert("Erreur suppression projet : " + deleteProjectError.message);
      return;
    }

    alert("Projet supprimé complètement");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={deleteProject}
      className="mt-3 w-full rounded-xl border border-red-300 px-4 py-3 text-sm font-semibold text-red-600"
    >
      Supprimer
    </button>
  );
}
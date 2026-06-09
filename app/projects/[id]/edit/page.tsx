import Link from "next/link";
import { supabase } from "@/lib/supabase";
import EditProjectForm from "./EditProjectForm";

type EditPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProjectPage({ params }: EditPageProps) {
  const { id } = await params;

  const { data: project, error } = await supabase
    .from("Projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !project) {
    return (
      <main className="min-h-screen bg-[#f4f1ea] px-6 py-10 text-[#10291f]">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold">Projet introuvable</h1>

          <Link href="/" className="mt-6 inline-block text-[#173f2b] underline">
            Retour au dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f1ea] px-6 py-10 text-[#10291f]">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 flex items-start justify-between">
          <div>
            <h1 className="mb-2 text-4xl font-bold">Modifier le projet</h1>
            <p className="text-[#5f6f65]">
              Modifiez les informations de cette analyse.
            </p>
          </div>

          <Link
            href="/"
            className="rounded-xl border border-[#173f2b] px-5 py-3 text-sm font-semibold text-[#173f2b]"
          >
            Retour
          </Link>
        </div>

        <EditProjectForm project={project} />
      </div>
    </main>
  );
}
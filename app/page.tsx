import Link from "next/link";
import { supabase } from "@/lib/supabase";
import DeleteProjectButton from "./DeleteProjectButton";

export default async function Home() {
  const { data: projects } = await supabase
    .from("Projects")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-[#f4f1ea] text-[#10291f]">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-10">
        <header className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Valora Renov AI</h1>

            <p className="text-sm text-[#5f6f65]">
              Analyse rénovation & potentiel immobilier
            </p>
          </div>

          <Link
            href="/projects/new"
            className="rounded-xl bg-[#173f2b] px-5 py-3 text-sm font-semibold text-white"
          >
            + Nouveau projet
          </Link>
        </header>

        <div className="mb-8">
          <h2 className="text-4xl font-bold tracking-tight">
            Mes analyses
          </h2>

          <p className="mt-3 max-w-2xl text-[#5f6f65]">
            Tous vos projets immobiliers analysés.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {projects?.map((project) => (
            <div
              key={project.id}
              className="rounded-2xl border border-[#d8d2c3] bg-white p-6 shadow-sm"
            >
              <p className="mb-2 text-sm font-semibold text-[#5f6f65]">
                {project.objective}
              </p>

              <h3 className="text-xl font-bold">
                {project.city}
              </h3>

              <p className="mt-2 text-sm text-[#5f6f65]">
                {project.surface} m²
              </p>

              <div className="mt-6 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Prix achat</span>
                  <strong>
                    {project.purchase_price?.toLocaleString()} €
                  </strong>
                </div>

                <div className="flex justify-between">
                  <span>État</span>
                  <strong>{project.condition}</strong>
                </div>
              </div>

              <div className="mt-6 space-y-3">
  <Link
    href={`/projects/${project.id}/report`}
    className="block w-full rounded-xl border border-[#173f2b] px-4 py-3 text-center text-sm font-semibold text-[#173f2b]"
  >
    Voir le rapport
  </Link>

  <Link
    href={`/projects/${project.id}/edit`}
    className="block w-full rounded-xl bg-[#173f2b] px-4 py-3 text-center text-sm font-semibold text-white"
  >
    Modifier
  </Link>
</div>
              <DeleteProjectButton projectId={project.id} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
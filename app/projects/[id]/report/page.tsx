import Link from "next/link";
import { supabase } from "@/lib/supabase";
import AnalyzeButton from "./AnalyzeButton";
import GenerateImageButton from "./GenerateImageButton";

type ReportPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function DynamicReportPage({ params }: ReportPageProps) {
  const { id } = await params;

  const { data: project, error } = await supabase
    .from("Projects")
    .select("*")
    .eq("id", id)
    .single();

  const { data: images } = await supabase
    .from("ProjectImages")
    .select("*")
    .eq("project_id", id);

  const { data: generatedImages } = await supabase
  .from("GeneratedImages")
  .select("*")
  .eq("project_id", id)
  .order("created_at", { ascending: false });

const { data: analyses } = await supabase
  .from("ProjectAnalyses")
  .select("*")
  .eq("project_id", id)
  .order("created_at", { ascending: false })
  .limit(1);

const latestAnalysis = analyses?.[0];

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

  const purchasePrice = Number(project.purchase_price);
  const surface = Number(project.surface);

  const notaryFees = purchasePrice * 0.08;

  let lowRate = 300;
  let midRate = 500;
  let highRate = 700;

  if (project.condition === "À rénover") {
    lowRate = 500;
    midRate = 675;
    highRate = 850;
  }

  if (project.condition === "Rénovation lourde") {
    lowRate = 900;
    midRate = 1200;
    highRate = 1500;
  }

  const worksLow = surface * lowRate;
  const worksMid = surface * midRate;
  const worksHigh = surface * highRate;

  const totalCost = purchasePrice + notaryFees + worksMid;

  const resaleValueLow = totalCost * 1.1;
  const resaleValueHigh = totalCost * 1.35;
  const resaleValueMid = (resaleValueLow + resaleValueHigh) / 2;

  const margin = resaleValueMid - totalCost;
  const roi = (margin / totalCost) * 100;

  return (
    <main className="min-h-screen bg-[#f4f1ea] px-6 py-10 text-[#10291f]">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex items-start justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold text-[#5f6f65]">
              Rapport dynamique
            </p>

            <h1 className="text-4xl font-bold">
              {project.city} — {project.surface} m²
            </h1>

            <p className="mt-3 text-[#5f6f65]">
              Objectif : {project.objective} · État général :{" "}
              {project.condition}
            </p>
          </div>

         <div className="flex gap-3">
  <AnalyzeButton projectId={project.id} />

  <Link
    href="/"
    className="rounded-xl border border-[#173f2b] px-5 py-3 text-sm font-semibold text-[#173f2b]"
  >
    Retour dashboard
  </Link>
</div>
        </header>

        <section className="mb-8 grid gap-5 md:grid-cols-4">
          <Card title="Prix achat" value={formatEuro(purchasePrice)} />
          <Card title="Travaux moyens" value={formatEuro(worksMid)} />
          <Card
            title="Valeur après travaux"
            value={formatEuro(resaleValueMid)}
          />
          <Card title="Marge estimée" value={formatEuro(margin)} />
        </section>

        <section className="mb-8 rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-2xl font-bold">Photos du bien</h2>

          {images && images.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-3">
             {images.map((image) => (
  <div key={image.id}>
    <img
      src={image.image_url}
      alt="Photo du bien"
      className="h-56 w-full rounded-xl object-cover"
    />

    <GenerateImageButton
      projectId={project.id}
      sourceImageUrl={image.image_url}
    />
  </div>
))}
<section className="mb-8 rounded-2xl bg-white p-8 shadow-sm">
  <h2 className="mb-6 text-2xl font-bold">Images après rénovation</h2>

  {generatedImages && generatedImages.length > 0 ? (
    <div className="grid gap-8">
      {generatedImages.map((image) => (
        <div key={image.id}>
          <img
            src={image.generated_image_url}
            alt="Image après rénovation"
            className="max-h-[700px] w-full rounded-xl object-contain"
          />
          <p className="mt-2 text-sm font-semibold text-[#5f6f65]">
            Style : {image.style}
          </p>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-[#5f6f65]">
      Aucune image générée pour le moment.
    </p>
  )}
</section>
            </div>
          ) : (
            <p className="text-[#5f6f65]">Aucune photo ajoutée.</p>
          )}
        </section>

        <section className="mb-8 rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="mb-4 text-2xl font-bold">Analyse automatique</h2>

          {latestAnalysis ? (
  <div className="whitespace-pre-wrap leading-7 text-[#405247]">
    {latestAnalysis.analysis}
  </div>
) : (
  <p className="leading-7 text-[#405247]">
    Aucune analyse IA disponible pour le moment.
  </p>
)}
        </section>

        <section className="mb-8 grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold">Travaux estimés</h2>

            <div className="space-y-4">
              <BudgetLine
                label="Fourchette basse"
                value={formatEuro(worksLow)}
              />
              <BudgetLine
                label="Scénario moyen"
                value={formatEuro(worksMid)}
              />
              <BudgetLine
                label="Fourchette haute"
                value={formatEuro(worksHigh)}
              />
              <BudgetLine label="Ratio bas" value={`${lowRate} €/m²`} />
              <BudgetLine label="Ratio moyen" value={`${midRate} €/m²`} />
              <BudgetLine label="Ratio haut" value={`${highRate} €/m²`} />
            </div>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold">Projection financière</h2>

            <div className="space-y-4">
              <BudgetLine
                label="Prix d’achat"
                value={formatEuro(purchasePrice)}
              />
              <BudgetLine
                label="Frais de notaire estimés"
                value={formatEuro(notaryFees)}
              />
              <BudgetLine
                label="Travaux moyens"
                value={formatEuro(worksMid)}
              />
              <BudgetLine
                label="Coût total projet"
                value={formatEuro(totalCost)}
              />
              <BudgetLine
                label="Valeur revente basse"
                value={formatEuro(resaleValueLow)}
              />
              <BudgetLine
                label="Valeur revente haute"
                value={formatEuro(resaleValueHigh)}
              />
              <BudgetLine label="ROI estimé" value={`${roi.toFixed(1)} %`} />
            </div>
          </div>
        </section>

        <section className="rounded-2xl bg-[#173f2b] p-8 text-white">
          <h2 className="mb-4 text-2xl font-bold">Recommandation</h2>

          <p className="leading-7 text-[#e6eee9]">
            {roi > 20
              ? "Le projet semble intéressant sur le papier. La marge estimée offre une première sécurité, à condition de maîtriser les travaux et de confirmer la valeur de revente locale."
              : "Le projet semble à surveiller. La rentabilité estimée est limitée : il faudrait négocier le prix d’achat, réduire le budget travaux ou viser une meilleure valorisation après rénovation."}
          </p>
        </section>
      </div>
    </main>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold text-[#5f6f65]">{title}</p>
      <p className="mt-3 text-2xl font-bold">{value}</p>
    </div>
  );
}

function BudgetLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-[#e8e2d4] pb-3 text-sm">
      <span className="text-[#405247]">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function formatEuro(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}
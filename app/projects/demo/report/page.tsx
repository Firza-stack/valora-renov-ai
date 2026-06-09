export default function DemoReportPage() {
  return (
    <main className="min-h-screen bg-[#f4f1ea] px-6 py-10 text-[#10291f]">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex items-start justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold text-[#5f6f65]">
              Rapport d’analyse
            </p>
            <h1 className="text-4xl font-bold">Mont-de-Marsan — 67 m²</h1>
            <p className="mt-3 text-[#5f6f65]">
              Objectif : revente · État général : à rénover
            </p>
          </div>

          <button className="rounded-xl bg-[#173f2b] px-5 py-3 text-sm font-semibold text-white">
            Exporter PDF
          </button>
        </header>

        <section className="mb-8 grid gap-5 md:grid-cols-4">
          <Card title="Prix achat" value="107 000 €" />
          <Card title="Travaux moyens" value="38 000 €" />
          <Card title="Valeur après travaux" value="195 000 €" />
          <Card title="Marge estimée" value="41 440 €" />
        </section>

        <section className="mb-8 rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="mb-4 text-2xl font-bold">Analyse visuelle</h2>
          <p className="leading-7 text-[#405247]">
            Le bien présente une base intéressante avec de beaux volumes et une
            bonne luminosité. L’état général est daté, mais les travaux semblent
            principalement esthétiques : sols, peinture, cuisine, salle de bain
            et finitions. Le potentiel de valorisation est bon pour une revente
            après rénovation maîtrisée.
          </p>
        </section>

        <section className="mb-8 grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold">Travaux estimés</h2>

            <div className="space-y-4">
              <BudgetLine label="Peinture complète" value="4 000 – 6 000 €" />
              <BudgetLine label="Sols" value="5 000 – 8 000 €" />
              <BudgetLine label="Cuisine" value="6 000 – 12 000 €" />
              <BudgetLine label="Salle de bain" value="5 000 – 9 000 €" />
              <BudgetLine label="Électricité partielle" value="3 000 – 6 000 €" />
              <BudgetLine label="Finitions / imprévus" value="4 000 – 9 000 €" />
            </div>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-bold">Projection financière</h2>

            <div className="space-y-4">
              <BudgetLine label="Prix d’achat" value="107 000 €" />
              <BudgetLine label="Frais de notaire estimés" value="8 560 €" />
              <BudgetLine label="Travaux moyens" value="38 000 €" />
              <BudgetLine label="Coût total projet" value="153 560 €" />
              <BudgetLine label="Valeur revente estimée" value="195 000 €" />
              <BudgetLine label="ROI estimé" value="27 %" />
            </div>
          </div>
        </section>

        <section className="rounded-2xl bg-[#173f2b] p-8 text-white">
          <h2 className="mb-4 text-2xl font-bold">Recommandation</h2>
          <p className="leading-7 text-[#e6eee9]">
            Projet intéressant pour une stratégie de revente, à condition de
            maîtriser le budget travaux et de vérifier les points sensibles :
            électricité, DPE, chauffage et éventuels travaux cachés. Une
            négociation sous 102 000 € améliorerait fortement la marge de
            sécurité.
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
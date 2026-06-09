import { NextResponse } from "next/server";
import OpenAI from "openai";
import { supabase } from "@/lib/supabase";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { projectId } = await request.json();

    if (!projectId) {
      return NextResponse.json(
        { error: "projectId manquant" },
        { status: 400 }
      );
    }

    const { data: project, error: projectError } = await supabase
      .from("Projects")
      .select("*")
      .eq("id", projectId)
      .single();

    if (projectError || !project) {
      return NextResponse.json(
        { error: "Projet introuvable" },
        { status: 404 }
      );
    }

    const { data: images } = await supabase
      .from("ProjectImages")
      .select("*")
      .eq("project_id", projectId);

    const imageUrls = images?.map((image) => image.image_url) ?? [];

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `
Tu es un expert en rénovation immobilière et achat-revente.

Analyse ce bien immobilier à partir des informations et des photos.

Informations :
- Ville : ${project.city}
- Surface : ${project.surface} m²
- Prix d'achat : ${project.purchase_price} €
- Objectif : ${project.objective}
- État général déclaré : ${project.condition}

Réponds en français avec cette structure :

1. Impression générale
2. Points forts
3. Points faibles
4. Travaux visibles probables
5. Risques à vérifier
6. Style recommandé après rénovation
7. Potentiel de valorisation
8. Recommandation finale

Sois concret, prudent et utile pour une décision d'achat-revente.
              `,
            },
            ...imageUrls.map((url) => ({
              type: "image_url" as const,
              image_url: {
                url,
              },
            })),
          ],
        },
      ],
    });

    const analysis =
      response.choices[0]?.message?.content ?? "Analyse indisponible.";

    const { error: insertError } = await supabase
      .from("ProjectAnalyses")
      .insert({
        project_id: projectId,
        analysis,
      });

    if (insertError) {
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erreur pendant l'analyse IA" },
      { status: 500 }
    );
  }
}
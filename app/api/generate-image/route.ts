import { NextResponse } from "next/server";
import OpenAI from "openai";
import axios from "axios";
import { toFile } from "openai/uploads";
import { supabase } from "@/lib/supabase";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { projectId, sourceImageUrl, style } = await request.json();

    if (!projectId || !sourceImageUrl || !style) {
      return NextResponse.json(
        { error: "projectId, sourceImageUrl et style sont requis" },
        { status: 400 }
      );
    }

    const imageResponse = await axios.get(sourceImageUrl, {
      responseType: "arraybuffer",
    });

    const imageBuffer = Buffer.from(imageResponse.data);

    const imageFile = await toFile(imageBuffer, "source.png", {
      type: "image/png",
    });

    const prompt = `
Transforme cette photo immobilière en projection après rénovation photoréaliste.

Style : ${style}

Priorité absolue :
- conserver exactement la perspective de la photo source
- conserver l’angle de caméra
- conserver la profondeur de la pièce
- conserver les proportions, murs, ouvertures, fenêtres, portes, plafond et sol
- ne pas changer la disposition générale
- ne pas inventer une nouvelle pièce

Améliorations autorisées :
- moderniser les sols
- repeindre les murs
- améliorer l’éclairage
- ajouter du mobilier cohérent
- ajouter de la décoration dans le style demandé
- rendre le bien plus attractif pour une revente immobilière

Contraintes :
- rendu photoréaliste
- pas de texte
- pas de flyer
- pas de plan 3D
- pas de vue grand angle artificielle
- conserver une image crédible d’intérieur réel
`;

    const response = await openai.images.edit({
      model: "gpt-image-1",
      image: imageFile,
      prompt,
      size: "1024x1024",
    });

    const base64Image = response.data?.[0]?.b64_json;

    if (!base64Image) {
      return NextResponse.json(
        { error: "Image générée indisponible" },
        { status: 500 }
      );
    }

    const generatedBuffer = Buffer.from(base64Image, "base64");
    const cleanStyle = String(style).replaceAll(" ", "-").toLowerCase();
    const filePath = `${projectId}/${Date.now()}-${cleanStyle}.png`;

    const uploadResult = await supabase.storage
      .from("generated-images")
      .upload(filePath, generatedBuffer, {
        contentType: "image/png",
      });

    if (uploadResult.error) {
      return NextResponse.json(
        { error: uploadResult.error.message },
        { status: 500 }
      );
    }

    const generatedImageUrl = supabase.storage
      .from("generated-images")
      .getPublicUrl(filePath).data.publicUrl;

    const { error: insertError } = await supabase.from("GeneratedImages").insert({
      project_id: projectId,
      source_image_url: sourceImageUrl,
      generated_image_url: generatedImageUrl,
      style,
    });

    if (insertError) {
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ generatedImageUrl });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erreur pendant la génération image" },
      { status: 500 }
    );
  }
}
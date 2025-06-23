import { NextResponse } from "next/server";
import { prisma } from "@/lib/utils/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { leadId, reponses } = body;
    
    // Validation de base
    if (!leadId || !reponses) {
      return NextResponse.json(
        { error: "L'ID du lead et les réponses sont requis" },
        { status: 400 }
      );
    }
    
    // Vérifier si le lead existe
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
    });
    
    if (!lead) {
      return NextResponse.json(
        { error: "Lead non trouvé" },
        { status: 404 }
      );
    }
    
    // Vérifier si un formulaire existe déjà pour ce lead
    const existingFormulaire = await prisma.formulaire.findUnique({
      where: { leadId },
    });
    
    let formulaire;
    
    if (existingFormulaire) {
      // Mettre à jour le formulaire existant
      formulaire = await prisma.formulaire.update({
        where: { leadId },
        data: { reponses: JSON.stringify(reponses) },
      });
    } else {
      // Créer un nouveau formulaire
      formulaire = await prisma.formulaire.create({
        data: {
          leadId,
          reponses: JSON.stringify(reponses),
        },
      });
    }
    
    return NextResponse.json({ id: formulaire.id }, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement du formulaire:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'enregistrement du formulaire" },
      { status: 500 }
    );
  }
}

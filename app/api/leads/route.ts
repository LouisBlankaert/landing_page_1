import { NextResponse } from "next/server";
import { prisma } from "@/lib/utils/prisma";

export async function POST(request: Request) {
  try {
    console.log("API route /api/leads appelée");
    const body = await request.json();
    console.log("Données reçues:", body);
    const { prenom, nom, email, telephone } = body;
    
    // Validation de base
    if (!prenom || !nom || !email || !telephone) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }
    
    // Vérifier si le lead existe déjà avec cet email OU ce numéro de téléphone
    console.log("Recherche d'un lead existant avec l'email ou le téléphone:", email, telephone);
    const existingLead = await prisma.lead.findFirst({
      where: {
        OR: [
          { email },
          { telephone }
        ]
      },
    });
    console.log("Lead existant:", existingLead);
    
    if (existingLead) {
      // Si le lead existe déjà, on retourne son ID et un message indiquant qu'il existe déjà
      const existingWith = existingLead.email === email ? "email" : "téléphone";
      return NextResponse.json({ 
        id: existingLead.id, 
        message: `Un compte existe déjà avec cet ${existingWith}` 
      }, { status: 200 });
    }
    
    // Créer un nouveau lead
    console.log("Création d'un nouveau lead");
    const lead = await prisma.lead.create({
      data: {
        prenom,
        nom,
        email,
        telephone,
      },
    });
    console.log("Nouveau lead créé:", lead);
    
    return NextResponse.json({ id: lead.id }, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création du lead:", error);
    console.error("Stack trace:", (error as Error).stack);
    return NextResponse.json(
      { error: "Erreur lors de la création du lead" },
      { status: 500 }
    );
  }
}

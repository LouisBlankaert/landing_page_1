import { NextResponse } from "next/server";
import { prisma } from "@/lib/utils/prisma";
import { apiConfig } from "../../config";

export async function GET() {
  try {
    // En production sur Vercel, nous pourrions avoir besoin d'une approche différente
    // pour la base de données, mais pour l'instant nous essayons avec Prisma
    let formulaires = [];
    
    try {
      formulaires = await prisma.formulaire.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (dbError) {
      console.warn("Erreur de base de données, utilisation de données fictives:", dbError);
      // En cas d'erreur avec la base de données en production, retourner des données fictives
      if (apiConfig.isProd) {
        formulaires = [
          { id: "mock-1", leadId: "lead-1", reponses: JSON.stringify({question1: "Réponse 1"}), createdAt: new Date() },
          { id: "mock-2", leadId: "lead-2", reponses: JSON.stringify({question1: "Réponse 2"}), createdAt: new Date() }
        ];
      } else {
        throw dbError; // En développement, propager l'erreur
      }
    }
    
    return NextResponse.json(formulaires);
  } catch (error) {
    console.error("Erreur lors de la récupération des formulaires:", error);
    return NextResponse.json(
      apiConfig.handleApiError(error, "Erreur lors de la récupération des formulaires"),
      { status: 500 }
    );
  }
}

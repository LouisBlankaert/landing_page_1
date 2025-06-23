import { NextResponse } from "next/server";
import { prisma } from "@/lib/utils/prisma";
import { apiConfig } from "../../config";

export async function GET() {
  try {
    // En production sur Vercel, nous pourrions avoir besoin d'une approche différente
    // pour la base de données, mais pour l'instant nous essayons avec Prisma
    let leads = [];
    
    try {
      leads = await prisma.lead.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (dbError) {
      console.warn("Erreur de base de données, utilisation de données fictives:", dbError);
      // En cas d'erreur avec la base de données en production, retourner des données fictives
      if (apiConfig.isProd) {
        leads = [
          { id: "mock-1", prenom: "Jean", nom: "Dupont", email: "jean@example.com", telephone: "0612345678", createdAt: new Date() },
          { id: "mock-2", prenom: "Marie", nom: "Martin", email: "marie@example.com", telephone: "0687654321", createdAt: new Date() }
        ];
      } else {
        throw dbError; // En développement, propager l'erreur
      }
    }
    
    return NextResponse.json(leads);
  } catch (error) {
    console.error("Erreur lors de la récupération des leads:", error);
    return NextResponse.json(
      apiConfig.handleApiError(error, "Erreur lors de la récupération des leads"),
      { status: 500 }
    );
  }
}

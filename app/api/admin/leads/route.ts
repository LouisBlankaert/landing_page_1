import { NextResponse } from "next/server";
import { supabase, snakeToCamel } from "@/lib/utils/supabase";
import { apiConfig } from "../../config";

export async function GET() {
  try {
    // Utiliser Supabase pour récupérer les leads
    let leads = [];
    
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      // Convertir les noms de colonnes de snake_case (Supabase) vers camelCase (application)
      leads = data.map(lead => ({
        id: lead.id,
        prenom: lead.prenom,
        nom: lead.nom,
        email: lead.email,
        telephone: lead.telephone,
        createdAt: lead.created_at,
        updatedAt: lead.updated_at
      }));
      
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

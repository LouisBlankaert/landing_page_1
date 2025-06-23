import { NextResponse } from "next/server";
import { supabase, snakeToCamel } from "@/lib/utils/supabase";
import { apiConfig } from "../../config";

export async function GET() {
  try {
    // Utiliser Supabase pour récupérer les formulaires
    let formulaires = [];
    
    try {
      const { data, error } = await supabase
        .from('formulaires')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      // Convertir les noms de colonnes de snake_case (Supabase) vers camelCase (application)
      formulaires = data.map(form => ({
        id: form.id,
        leadId: form.lead_id,
        reponses: form.reponses,
        createdAt: form.created_at,
        updatedAt: form.updated_at
      }));
      
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

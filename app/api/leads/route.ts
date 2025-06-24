import { NextResponse } from "next/server";
import { supabase, camelToSnake, snakeToCamel } from "@/lib/utils/supabase";

export async function POST(request: Request) {
  try {
    console.log("API route /api/leads appelée");
    console.log("URL Supabase:", process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log("Clé Supabase disponible:", !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    
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
    
    // Rechercher les leads existants avec l'email ou le téléphone fournis
    const { data: existingLeadsEmail, error: searchErrorEmail } = await supabase
      .from('leads')
      .select('*')
      .eq('email', email);
      
    const { data: existingLeadsPhone, error: searchErrorPhone } = await supabase
      .from('leads')
      .select('*')
      .eq('telephone', telephone);
      
    // Combiner les résultats
    const existingLeads = [...(existingLeadsEmail || []), ...(existingLeadsPhone || [])];
    const searchError = searchErrorEmail || searchErrorPhone;
    
    if (searchError) {
      console.error("Erreur lors de la recherche de leads existants:", searchError);
      return NextResponse.json(
        { error: "Erreur lors de la recherche de leads existants" },
        { status: 500 }
      );
    }
    
    const existingLead = existingLeads && existingLeads.length > 0 ? snakeToCamel(existingLeads[0]) : null;
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
    
    const { data: newLead, error: insertError } = await supabase
      .from('leads')
      .insert([
        { 
          prenom, 
          nom, 
          email, 
          telephone,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select();
    
    if (insertError) {
      console.error("Erreur lors de la création du lead:", insertError);
      return NextResponse.json(
        { error: "Erreur lors de la création du lead" },
        { status: 500 }
      );
    }
    
    const formattedLead = snakeToCamel(newLead[0]);
    console.log("Nouveau lead créé:", formattedLead);
    
    return NextResponse.json({ id: formattedLead.id }, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création du lead:", error);
    console.error("Stack trace:", (error as Error).stack);
    return NextResponse.json(
      { error: "Erreur lors de la création du lead" },
      { status: 500 }
    );
  }
}

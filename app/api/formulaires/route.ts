import { NextResponse } from "next/server";
import { supabase, snakeToCamel } from "@/lib/utils/supabase";

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
    const { data: leadData, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single();
    
    if (leadError || !leadData) {
      return NextResponse.json(
        { error: "Lead non trouvé" },
        { status: 404 }
      );
    }
    
    // Vérifier si un formulaire existe déjà pour ce lead
    const { data: existingFormulaire, error: formulaireError } = await supabase
      .from('formulaires')
      .select('*')
      .eq('lead_id', leadId)
      .single();
    
    let formulaire;
    
    if (existingFormulaire && !formulaireError) {
      // Mettre à jour le formulaire existant
      const { data: updatedFormulaire, error: updateError } = await supabase
        .from('formulaires')
        .update({ 
          reponses: JSON.stringify(reponses),
          updated_at: new Date().toISOString()
        })
        .eq('lead_id', leadId)
        .select()
        .single();
      
      if (updateError) {
        throw updateError;
      }
      
      formulaire = updatedFormulaire;
    } else {
      // Créer un nouveau formulaire
      const { data: newFormulaire, error: insertError } = await supabase
        .from('formulaires')
        .insert([
          {
            lead_id: leadId,
            reponses: JSON.stringify(reponses),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select()
        .single();
      
      if (insertError) {
        throw insertError;
      }
      
      formulaire = newFormulaire;
    }
    
    const formattedFormulaire = snakeToCamel(formulaire);
    return NextResponse.json({ id: formattedFormulaire.id }, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement du formulaire:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'enregistrement du formulaire" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";

// Route API mock pour remplacer /api/admin/formulaires en production
export async function GET() {
  // Données fictives pour les formulaires
  const mockFormulaires = [
    { 
      id: "mock-form-1", 
      leadId: "lead-1", 
      reponses: JSON.stringify({
        question1: "Réponse 1",
        question2: "Réponse 2",
        budget: "300000-400000€"
      }), 
      createdAt: new Date().toISOString() 
    },
    { 
      id: "mock-form-2", 
      leadId: "lead-2", 
      reponses: JSON.stringify({
        question1: "Réponse 3",
        question2: "Réponse 4",
        budget: "400000-500000€"
      }), 
      createdAt: new Date(Date.now() - 86400000).toISOString() // 1 jour avant
    }
  ];
  
  return NextResponse.json(mockFormulaires);
}

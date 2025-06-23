import { NextResponse } from "next/server";

// Route API mock pour remplacer /api/admin/leads en production
export async function GET() {
  // Données fictives pour les leads
  const mockLeads = [
    { 
      id: "mock-lead-1", 
      prenom: "Jean", 
      nom: "Dupont", 
      email: "jean.dupont@example.com", 
      telephone: "0612345678", 
      createdAt: new Date().toISOString() 
    },
    { 
      id: "mock-lead-2", 
      prenom: "Marie", 
      nom: "Martin", 
      email: "marie.martin@example.com", 
      telephone: "0687654321", 
      createdAt: new Date(Date.now() - 86400000).toISOString() // 1 jour avant
    },
    { 
      id: "mock-lead-3", 
      prenom: "Pierre", 
      nom: "Bernard", 
      email: "pierre.bernard@example.com", 
      telephone: "0698765432", 
      createdAt: new Date(Date.now() - 172800000).toISOString() // 2 jours avant
    }
  ];
  
  return NextResponse.json(mockLeads);
}

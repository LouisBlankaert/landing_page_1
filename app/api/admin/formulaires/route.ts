import { NextResponse } from "next/server";
import { prisma } from "@/lib/utils/prisma";

export async function GET() {
  try {
    const formulaires = await prisma.formulaire.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json(formulaires);
  } catch (error) {
    console.error("Erreur lors de la récupération des formulaires:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des formulaires" },
      { status: 500 }
    );
  }
}

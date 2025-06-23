import { NextResponse } from "next/server";
import { prisma } from "@/lib/utils/prisma";

export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json(leads);
  } catch (error) {
    console.error("Erreur lors de la récupération des leads:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des leads" },
      { status: 500 }
    );
  }
}

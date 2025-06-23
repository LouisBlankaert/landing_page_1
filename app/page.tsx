"use client";

import { useState, useEffect } from "react";
import { VideoPlayer } from "@/components/ui/video-player";
import { Button } from "@/components/ui/button";
import { PhotoGrid } from "@/components/ui/photo-grid";
import { LeadFormData } from "@/components/ui/form-popup";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [leadId, setLeadId] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  // Vérifier si la vidéo a déjà été déverrouillée lors du chargement de la page
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isVideoUnlocked = localStorage.getItem("videoUnlocked") === "true";
      if (isVideoUnlocked) {
        setFormSubmitted(true);
      }
    }
  }, []);
  
  // Fonction pour gérer la capture de lead depuis le formulaire popup
  const handleLeadCapture = async (data: LeadFormData) => {
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Une erreur est survenue");
      }
      
      // Stocker l'ID du lead pour l'utiliser plus tard
      setLeadId(result.id);
      // Indiquer que le formulaire a été soumis
      setFormSubmitted(true);
      
      return result;
    } catch (error) {
      console.error("Erreur lors de la capture du lead:", error);
      throw error;
    }
  };
  
  // Fonction pour rediriger vers le formulaire détaillé
  const handlePostuleClick = () => {
    // Si l'utilisateur a déjà rempli le formulaire (soit dans cette session, soit dans une précédente)
    // on le redirige vers le formulaire détaillé
    if (formSubmitted) {
      // Si on a un leadId dans cette session, on l'utilise
      if (leadId) {
        router.push(`/formulaire?leadId=${leadId}`);
      } else {
        // Sinon, on redirige simplement vers le formulaire sans paramètre
        // Le formulaire devra demander les informations de base à nouveau
        router.push(`/formulaire`);
      }
    } else {
      // Ce cas ne devrait pas se produire car le bouton n'est affiché que si formSubmitted est true
      alert("Veuillez d'abord regarder la vidéo et remplir le formulaire.");
    }
  };
  
  // Photos de propriétés immobilières pour la grille
  const photos = [
    { src: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914", alt: "Maison moderne avec piscine" },
    { src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c", alt: "Villa de luxe" },
    { src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c", alt: "Appartement haut de gamme" },
    { src: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b", alt: "Maison avec jardin" },
    { src: "https://images.unsplash.com/photo-1560448075-bb485b067938", alt: "Loft moderne" },
    { src: "https://images.unsplash.com/photo-1600585154526-990dced4db0d", alt: "Villa contemporaine" },
    { src: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3", alt: "Penthouse avec vue" },
    { src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c", alt: "Propriété de prestige" },
  ];
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-black text-white py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">Votre Opportunité Immobilière</h1>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8 space-y-12">
        <section className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">Découvrez Comment Réussir dans l'Immobilier</h2>
          
          {/* Première vidéo avec verrouillage */}
          <VideoPlayer 
            videoUrl="/videos/main-video.mp4" 
            thumbnailUrl="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"
            isLocked={true}
            onLeadCapture={handleLeadCapture}
          />
          
          {formSubmitted && (
            <div className="mt-6 flex justify-center">
              <Button 
                size="lg" 
                onClick={handlePostuleClick}
                className="px-8 py-3 text-lg"
              >
                Postule Maintenant
              </Button>
            </div>
          )}
        </section>
        
        {formSubmitted && (
          <>
            <section className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6 text-center">Témoignages de Nos Agents Immobiliers</h2>
              
              {/* Deuxième vidéo sans verrouillage */}
              <VideoPlayer 
                videoUrl="/videos/testimonials.mp4" 
                thumbnailUrl="https://images.unsplash.com/photo-1600880292203-757bb62b4baf"
                isLocked={false}
              />
            </section>
            
            <section className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold mb-6 text-center">Nos Propriétés Vendues</h2>
              
              {/* Grille de photos */}
              <PhotoGrid photos={photos} columns={4} rows={2} />
              
              <div className="mt-10 flex justify-center">
                <Button 
                  size="lg" 
                  onClick={handlePostuleClick}
                  className="px-8 py-3 text-lg"
                >
                  Postule Maintenant
                </Button>
              </div>
            </section>
          </>
        )}
      </main>
      
      <footer className="bg-black text-white py-8 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold mb-2">Votre Agence Immobilière</h3>
              <p>Transformez votre carrière dans l'immobilier</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-gray-300">Instagram</a>
              <a href="#" className="hover:text-gray-300">Facebook</a>
              <a href="#" className="hover:text-gray-300">LinkedIn</a>
              <a href="/admin" className="hover:text-gray-300">Admin</a>
            </div>
          </div>
          <p>© {new Date().getFullYear()} Votre Agence Immobilière. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}

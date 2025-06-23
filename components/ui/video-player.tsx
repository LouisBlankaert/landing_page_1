import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { FormPopup, LeadFormData } from "./form-popup";

// Charger ReactPlayer dynamiquement côté client uniquement
const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: false, // Désactiver le rendu côté serveur
});

interface VideoPlayerProps {
  videoUrl: string;
  thumbnailUrl?: string;
  isLocked?: boolean;
  onLeadCapture?: (data: LeadFormData) => Promise<void>;
}

export function VideoPlayer({
  videoUrl,
  thumbnailUrl,
  isLocked = false,
  onLeadCapture
}: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [unlocked, setUnlocked] = useState(!isLocked);
  // Utiliser any pour le type de ref car ReactPlayer est chargé dynamiquement
  const playerRef = useRef<any>(null);

  const handlePlay = () => {
    if (isLocked && !unlocked) {
      setPlaying(false);
      setShowForm(true);
    } else {
      setPlaying(true);
    }
  };

  const handleFormSubmit = async (data: LeadFormData) => {
    if (onLeadCapture) {
      await onLeadCapture(data);
    }
    // Déverrouiller la vidéo et sauvegarder l'état dans le localStorage
    setUnlocked(true);
    localStorage.setItem("videoUnlocked", "true");
    setShowForm(false);
    setPlaying(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
  };

  // Utiliser un état pour suivre si nous sommes côté client
  const [isMounted, setIsMounted] = useState(false);
  
  // Vérifier si nous sommes côté client après le montage du composant
  // et vérifier si la vidéo a déjà été déverrouillée
  useEffect(() => {
    setIsMounted(true);
    
    // Vérifier si la vidéo a déjà été déverrouillée
    if (isLocked && typeof window !== "undefined") {
      const isVideoUnlocked = localStorage.getItem("videoUnlocked") === "true";
      if (isVideoUnlocked) {
        setUnlocked(true);
      }
    }
  }, [isLocked]);
  
  return (
    <div className="relative w-full aspect-video">
      <div className="relative w-full h-full">
        {isMounted && (
          <ReactPlayer
            ref={playerRef}
            url={videoUrl}
            width="100%"
            height="100%"
            playing={playing}
            controls={unlocked || !isLocked}
            light={thumbnailUrl || false}
            onPlay={handlePlay}
            onPause={() => setPlaying(false)}
            className="rounded-lg overflow-hidden"
          />
        )}
        
        {isLocked && !unlocked && !playing && !showForm && (
          <div 
            className="absolute inset-0 bg-black/30 flex items-center justify-center cursor-pointer"
            onClick={() => setShowForm(true)}
          >
            <div className="bg-white rounded-full p-4 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </div>
          </div>
        )}
      </div>
      
      {showForm && (
        <FormPopup onSubmit={handleFormSubmit} onClose={handleFormClose} />
      )}
    </div>
  );
}

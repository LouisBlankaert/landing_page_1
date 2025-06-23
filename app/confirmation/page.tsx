"use client";

import { VideoPlayer } from "@/components/ui/video-player";
import { TodoList } from "@/components/ui/todo-list";

export default function ConfirmationPage() {
  // Liste des tâches à faire
  const todoItems = [
    "Prends cette opportunité au serieux",
    "Regarde tes spams (mon mail est peut-être dedans)",
    "Garde un oeil sur tes messages et réponds au plus vite",
    "Follow moi sur Instagram & YouTube",
    "Rejoins le Discord, tous les résultats des membres y sont"
  ];
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-black text-white py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">Félicitations !</h1>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-10">
          <section className="text-center">
            <h2 className="text-3xl font-bold mb-4">Votre candidature a été soumise avec succès !</h2>
            <p className="text-xl text-gray-600 mb-8">
              Nous avons bien reçu votre candidature. Voici les prochaines étapes à suivre.
            </p>
          </section>
          
          <section>
            <h3 className="text-2xl font-bold mb-6 text-center">Message important</h3>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <VideoPlayer 
                videoUrl="/videos/main-video.mp4" 
                isLocked={false} // S'assurer que la vidéo n'est pas verrouillée
              />
            </div>
            <p className="mt-4 text-center text-gray-700">
              Regardez cette vidéo pour connaître les prochaines étapes et maximiser vos chances de réussite.
            </p>
          </section>
          
          <section className="max-w-2xl mx-auto">
            <TodoList items={todoItems} />
          </section>
          
          <section className="text-center">
            <h3 className="text-2xl font-bold mb-4">Restez connecté</h3>
            <p className="text-gray-600">
              Suivez-nous sur les réseaux sociaux pour ne rien manquer :
            </p>
            
            <div className="flex justify-center gap-6 mt-6">
              <a href="#" className="text-blue-600 hover:underline">Instagram</a>
              <a href="#" className="text-red-600 hover:underline">YouTube</a>
              <a href="#" className="text-indigo-600 hover:underline">Discord</a>
            </div>
          </section>
        </div>
      </main>
      
      <footer className="bg-black text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} Votre Entreprise. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}

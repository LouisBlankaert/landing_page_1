"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface FormQuestion {
  id: string;
  question: string;
  type: "text" | "textarea" | "radio" | "checkbox" | "select";
  options?: string[];
  required?: boolean;
}

// Composant principal qui utilise Suspense pour envelopper le contenu utilisant useSearchParams
export default function FormulairePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Chargement du formulaire...</div>}>
      <FormulaireContent />
    </Suspense>
  );
}

// Composant client qui utilise useSearchParams
function FormulaireContent() {
  const { useSearchParams } = require("next/navigation");
  const searchParams = useSearchParams();
  const leadId = searchParams?.get("leadId") || null;
  
  const router = useRouter();
  const [reponses, setReponses] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Informations personnelles (nécessaires si pas de leadId)
  const [infoPerso, setInfoPerso] = useState({
    prenom: "",
    nom: "",
    email: "",
    telephone: ""
  });
  
  // Si aucun leadId n'est fourni, nous permettons quand même à l'utilisateur de remplir le formulaire
  // car il a peut-être déjà rempli le formulaire popup lors d'une session précédente
  
  // Questions du formulaire
  const questions: FormQuestion[] = [
    {
      id: "objectif",
      question: "Quel est votre objectif principal ?",
      type: "select",
      options: [
        "Augmenter mes revenus",
        "Développer mon entreprise",
        "Apprendre de nouvelles compétences",
        "Changer de carrière",
        "Autre"
      ],
      required: true
    },
    {
      id: "situation",
      question: "Quelle est votre situation actuelle ?",
      type: "radio",
      options: [
        "Salarié",
        "Entrepreneur",
        "Étudiant",
        "Sans emploi",
        "Autre"
      ],
      required: true
    },
    {
      id: "experience",
      question: "Avez-vous déjà une expérience dans ce domaine ?",
      type: "radio",
      options: ["Oui", "Non"],
      required: true
    },
    {
      id: "motivation",
      question: "Qu'est-ce qui vous motive à postuler aujourd'hui ?",
      type: "textarea",
      required: true
    },
    {
      id: "disponibilite",
      question: "Combien d'heures par semaine pouvez-vous consacrer à ce projet ?",
      type: "select",
      options: [
        "Moins de 5 heures",
        "5 à 10 heures",
        "10 à 20 heures",
        "Plus de 20 heures"
      ],
      required: true
    }
  ];
  
  const handleChange = (questionId: string, value: string) => {
    setReponses((prev) => ({ ...prev, [questionId]: value }));
    
    // Effacer l'erreur lorsque l'utilisateur répond
    if (errors[questionId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  };
  
  // Gestion des changements dans les champs d'informations personnelles
  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInfoPerso(prev => ({ ...prev, [name]: value }));
    
    // Effacer l'erreur lorsque l'utilisateur tape
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Valider les questions du formulaire
    questions.forEach((question) => {
      if (question.required && !reponses[question.id]) {
        newErrors[question.id] = "Cette réponse est requise";
      }
    });
    
    // Si pas de leadId, valider également les informations personnelles
    if (!leadId) {
      if (!infoPerso.prenom.trim()) {
        newErrors.prenom = "Le prénom est requis";
      }
      if (!infoPerso.nom.trim()) {
        newErrors.nom = "Le nom est requis";
      }
      if (!infoPerso.email.trim()) {
        newErrors.email = "L'email est requis";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(infoPerso.email)) {
        newErrors.email = "Format d'email invalide";
      }
      if (!infoPerso.telephone.trim()) {
        newErrors.telephone = "Le téléphone est requis";
      } else if (!/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/.test(infoPerso.telephone)) {
        newErrors.telephone = "Format de téléphone invalide";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Si nous n'avons pas de leadId, nous devons d'abord créer un lead avec les informations du formulaire
      let actualLeadId = leadId;
      
      if (!actualLeadId) {
        // Créer un nouveau lead avec les informations saisies dans le formulaire
        const leadResponse = await fetch("/api/leads", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prenom: infoPerso.prenom,
            nom: infoPerso.nom,
            email: infoPerso.email,
            telephone: infoPerso.telephone,
          }),
        });
        
        const leadResult = await leadResponse.json();
        
        if (!leadResponse.ok) {
          throw new Error(leadResult.error || "Une erreur est survenue lors de la création du lead");
        }
        
        actualLeadId = leadResult.id;
      }
      
      // Maintenant, soumettre le formulaire avec le leadId
      const response = await fetch("/api/formulaires", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          leadId: actualLeadId,
          reponses,
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Une erreur est survenue");
      }
      
      // Rediriger vers la page de confirmation
      router.push("/confirmation");
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire:", error);
      setIsSubmitting(false);
      alert(`Erreur: ${(error as Error).message}`);
    }
  };
  
  const renderQuestion = (question: FormQuestion) => {
    switch (question.type) {
      case "text":
        return (
          <input
            type="text"
            id={question.id}
            value={reponses[question.id] || ""}
            onChange={(e) => handleChange(question.id, e.target.value)}
            className={`w-full px-3 py-2 border rounded-md ${
              errors[question.id] ? "border-red-500" : "border-gray-300"
            }`}
          />
        );
        
      case "textarea":
        return (
          <textarea
            id={question.id}
            value={reponses[question.id] || ""}
            onChange={(e) => handleChange(question.id, e.target.value)}
            rows={4}
            className={`w-full px-3 py-2 border rounded-md ${
              errors[question.id] ? "border-red-500" : "border-gray-300"
            }`}
          />
        );
        
      case "radio":
        return (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <div key={option} className="flex items-center">
                <input
                  type="radio"
                  id={`${question.id}-${option}`}
                  name={question.id}
                  value={option}
                  checked={reponses[question.id] === option}
                  onChange={() => handleChange(question.id, option)}
                  className="mr-2"
                />
                <label htmlFor={`${question.id}-${option}`}>{option}</label>
              </div>
            ))}
          </div>
        );
        
      case "select":
        return (
          <select
            id={question.id}
            value={reponses[question.id] || ""}
            onChange={(e) => handleChange(question.id, e.target.value)}
            className={`w-full px-3 py-2 border rounded-md ${
              errors[question.id] ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Sélectionnez une option</option>
            {question.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
        
      default:
        return null;
    }
  };
  
  // Nous affichons le formulaire même sans leadId
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-black text-white py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">Formulaire de Candidature</h1>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Complétez votre candidature</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Afficher les champs d'informations personnelles si pas de leadId */}
            {!leadId && (
              <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
                <h3 className="text-lg font-semibold mb-3 text-blue-800">Vos informations personnelles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="prenom" className="block font-medium">
                      Prénom <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      id="prenom"
                      name="prenom"
                      value={infoPerso.prenom}
                      onChange={handleInfoChange}
                      className={`w-full px-3 py-2 border rounded-md ${errors.prenom ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.prenom && <p className="text-red-500 text-sm">{errors.prenom}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="nom" className="block font-medium">
                      Nom <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      id="nom"
                      name="nom"
                      value={infoPerso.nom}
                      onChange={handleInfoChange}
                      className={`w-full px-3 py-2 border rounded-md ${errors.nom ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.nom && <p className="text-red-500 text-sm">{errors.nom}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="block font-medium">
                      Email <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={infoPerso.email}
                      onChange={handleInfoChange}
                      className={`w-full px-3 py-2 border rounded-md ${errors.email ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="telephone" className="block font-medium">
                      Téléphone <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="tel"
                      id="telephone"
                      name="telephone"
                      value={infoPerso.telephone}
                      onChange={handleInfoChange}
                      className={`w-full px-3 py-2 border rounded-md ${errors.telephone ? "border-red-500" : "border-gray-300"}`}
                      placeholder="Ex: 06 12 34 56 78"
                    />
                    {errors.telephone && <p className="text-red-500 text-sm">{errors.telephone}</p>}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">Ces informations sont nécessaires pour compléter votre candidature.</p>
              </div>
            )}
            {questions.map((question) => (
              <div key={question.id} className="space-y-2">
                <label htmlFor={question.id} className="block font-medium">
                  {question.question}
                  {question.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                
                {renderQuestion(question)}
                
                {errors[question.id] && (
                  <p className="text-red-500 text-sm">{errors[question.id]}</p>
                )}
              </div>
            ))}
            
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Envoi en cours..." : "Soumettre ma candidature"}
              </Button>
            </div>
          </form>
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

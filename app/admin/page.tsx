"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Lead {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  createdAt: string;
}

interface Formulaire {
  id: string;
  leadId: string;
  reponses: string;
  createdAt: string;
}

export default function AdminPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [formulaires, setFormulaires] = useState<Formulaire[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Utiliser la variable d'environnement pour le mot de passe admin
  // Fallback sur "admin123" si la variable n'est pas définie (uniquement pour le développement)
  const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === adminPassword) {
      setIsAuthenticated(true);
      localStorage.setItem("adminAuthenticated", "true");
    } else {
      setError("Mot de passe incorrect");
    }
  };

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà authentifié
    const isAuth = localStorage.getItem("adminAuthenticated") === "true";
    setIsAuthenticated(isAuth);

    if (isAuth) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Récupérer les leads
      const leadsResponse = await fetch("/api/admin/leads");
      if (!leadsResponse.ok) {
        throw new Error("Erreur lors de la récupération des leads");
      }
      const leadsData = await leadsResponse.json();
      setLeads(leadsData);

      // Récupérer les formulaires
      const formulairesResponse = await fetch("/api/admin/formulaires");
      if (!formulairesResponse.ok) {
        throw new Error("Erreur lors de la récupération des formulaires");
      }
      const formulairesData = await formulairesResponse.json();
      setFormulaires(formulairesData);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("adminAuthenticated");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Administration</h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800"
            >
              Se connecter
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-black text-white py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Administration</h1>
          <div className="flex items-center space-x-4">
            <Link href="/" className="hover:underline">
              Retour au site
            </Link>
            <button
              onClick={handleLogout}
              className="bg-white text-black px-3 py-1 rounded-md hover:bg-gray-200"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="text-center py-8">Chargement...</div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : (
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4">Leads ({leads.length})</h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-3 px-4 text-left">ID</th>
                      <th className="py-3 px-4 text-left">Prénom</th>
                      <th className="py-3 px-4 text-left">Nom</th>
                      <th className="py-3 px-4 text-left">Email</th>
                      <th className="py-3 px-4 text-left">Téléphone</th>
                      <th className="py-3 px-4 text-left">Date de création</th>
                      <th className="py-3 px-4 text-left">Formulaire</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.length > 0 ? (
                      leads.map((lead) => (
                        <tr key={lead.id} className="border-t hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm">{lead.id.substring(0, 8)}...</td>
                          <td className="py-3 px-4">{lead.prenom}</td>
                          <td className="py-3 px-4">{lead.nom}</td>
                          <td className="py-3 px-4">{lead.email}</td>
                          <td className="py-3 px-4">{lead.telephone}</td>
                          <td className="py-3 px-4">{new Date(lead.createdAt).toLocaleString()}</td>
                          <td className="py-3 px-4">
                            {formulaires.some(f => f.leadId === lead.id) ? (
                              <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                Complété
                              </span>
                            ) : (
                              <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                                Non complété
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-gray-500">
                          Aucun lead trouvé
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
            
            <section>
              <h2 className="text-xl font-bold mb-4">Formulaires détaillés ({formulaires.length})</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formulaires.length > 0 ? (
                  formulaires.map((formulaire) => {
                    const lead = leads.find(l => l.id === formulaire.leadId);
                    const reponses = JSON.parse(formulaire.reponses);
                    
                    return (
                      <div key={formulaire.id} className="bg-white p-6 rounded-lg shadow-md">
                        <div className="mb-4">
                          <h3 className="font-bold text-lg">
                            {lead ? `${lead.prenom} ${lead.nom}` : "Lead inconnu"}
                          </h3>
                          <p className="text-sm text-gray-500">
                            ID: {formulaire.id.substring(0, 8)}...
                          </p>
                          <p className="text-sm text-gray-500">
                            Date: {new Date(formulaire.createdAt).toLocaleString()}
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="font-medium">Réponses:</h4>
                          <div className="bg-gray-50 p-3 rounded">
                            <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
                              {JSON.stringify(reponses, null, 2)}
                            </pre>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-2 py-8 text-center text-gray-500">
                    Aucun formulaire détaillé trouvé
                  </div>
                )}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

// Configuration pour les routes API en production
export const apiConfig = {
  // Indique si nous sommes en production
  isProd: process.env.NODE_ENV === 'production',
  
  // Fonction pour gérer les erreurs d'API de manière cohérente
  handleApiError: (error: any, message: string = "Une erreur est survenue") => {
    console.error(`API Error: ${message}`, error);
    return { error: message, details: process.env.NODE_ENV !== 'production' ? error.message : undefined };
  }
};

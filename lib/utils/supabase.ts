import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Fonctions utilitaires pour travailler avec Supabase
export const formatDate = (date: string | Date) => {
  return new Date(date).toISOString();
};

// Convertir les noms de colonnes de snake_case (Supabase) vers camelCase (votre application)
export const snakeToCamel = (obj: any): any => {
  if (obj === null || typeof obj !== 'object') return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(item => snakeToCamel(item));
  }
  
  return Object.keys(obj).reduce<Record<string, any>>((acc, key) => {
    const camelKey = key.replace(/(_\w)/g, k => k[1].toUpperCase());
    acc[camelKey] = snakeToCamel(obj[key]);
    return acc;
  }, {});
};

// Convertir les noms de colonnes de camelCase (votre application) vers snake_case (Supabase)
export const camelToSnake = (obj: any): any => {
  if (obj === null || typeof obj !== 'object') return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(item => camelToSnake(item));
  }
  
  return Object.keys(obj).reduce<Record<string, any>>((acc, key) => {
    const snakeKey = key.replace(/([A-Z])/g, k => `_${k.toLowerCase()}`);
    acc[snakeKey] = camelToSnake(obj[key]);
    return acc;
  }, {});
};
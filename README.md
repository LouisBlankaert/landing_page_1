# Landing Page Immobilière

Cette application Next.js est une landing page immobilière avec vidéo verrouillée, formulaire détaillé, et gestion des leads.

## Fonctionnalités

- Page d'accueil avec vidéo verrouillée et formulaire de capture de lead
- Formulaire détaillé pour collecter des informations supplémentaires
- Page de confirmation avec vidéo et instructions
- Interface d'administration pour visualiser les leads et formulaires
- Base de données PostgreSQL pour le stockage des données

## Prérequis

- Node.js 18+ et npm/pnpm
- Base de données PostgreSQL

## Installation

```bash
# Installer les dépendances
pnpm install

# Configurer la base de données
pnpx prisma migrate dev

# Lancer le serveur de développement
pnpm dev
```

## Variables d'environnement

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```
DATABASE_URL="postgresql://user:password@localhost:5432/database_name"
```

## Déploiement sur Vercel

1. Créez un compte sur [Vercel](https://vercel.com) si ce n'est pas déjà fait
2. Connectez votre dépôt GitHub à Vercel
3. Configurez les variables d'environnement suivantes dans les paramètres du projet :
   - `DATABASE_URL` : URL de connexion à votre base de données PostgreSQL
4. Déployez votre application

### Configuration PostgreSQL pour Vercel

Pour que l'application fonctionne correctement sur Vercel :

1. Utilisez un service PostgreSQL compatible avec les environnements serverless comme:
   - [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
   - [Supabase](https://supabase.com)
   - [Neon](https://neon.tech)
   - [Railway](https://railway.app)

2. Assurez-vous que votre base de données est accessible depuis les fonctions serverless de Vercel

3. Vérifiez que le schéma de base de données est correctement déployé avec:
   ```bash
   npx prisma db push
   ```

## Structure du projet

- `app/` : Pages et routes API de l'application
- `components/` : Composants React réutilisables
- `prisma/` : Schéma de base de données et migrations
- `public/` : Fichiers statiques (vidéos, images)

## Maintenance

Pour mettre à jour le schéma de la base de données :

```bash
# Après modification du schéma dans prisma/schema.prisma
pnpx prisma migrate dev --name nom_de_la_migration
```

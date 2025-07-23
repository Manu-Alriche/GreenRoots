# GreenRoots - Guide d'installation

Ce projet GreenRoots est composé de deux parties : une API backend (Node.js/Express) et une application frontend (SvelteKit).

## Prérequis

- Node.js (version 18 ou supérieure)
- PostgreSQL
- npm

## Installation étape par étape

### 1. Cloner le projet

```bash
git clone [URL_DU_REPO]
cd GreenRoot-Front
```

### 2. Configuration de la base de données PostgreSQL

1. Installez PostgreSQL sur votre machine
2. Créez une base de données pour le projet
3. Notez l'URL de connexion PostgreSQL

### 3. Configuration de l'API (Backend)

#### 3.1. Naviguer vers le dossier API
```bash
cd api
```

#### 3.2. Installer les dépendances
```bash
npm install
```

#### 3.3. Créer le fichier .env
Créez un fichier `.env` dans le dossier `api` avec les variables suivantes :

```env
# Base de données
PG_URL=postgresql://username:password@localhost:5432/database_name

# JWT Secret
JWT_SECRET=votre_secret_jwt_tres_securise

# Session Secret
SESSION_SECRET=votre_secret_session_tres_securise

# URL Frontend
FRONTEND_URL=http://localhost:5173

# Configuration Email (pour les notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre_email@gmail.com
EMAIL_PASS=votre_mot_de_passe_app
CONTACT_RECEIVER_EMAIL=votre_email@gmail.com

# Port API
PORT=3000
```

#### 3.4. Initialiser la base de données
```bash
npm run db:reset
```

#### 3.5. Démarrer l'API
```bash
npm run dev
```

L'API sera accessible sur `http://localhost:3000`

### 4. Configuration du Client (Frontend)

#### 4.1. Ouvrir un nouveau terminal et naviguer vers le dossier client
```bash
cd client
```

#### 4.2. Installer les dépendances
```bash
npm install
```

#### 4.3. Créer le fichier .env (optionnel)
Créez un fichier `.env` dans le dossier `client` si nécessaire :

```env
# URL de l'API
VITE_API_URL=http://localhost:3000
```

#### 4.4. Démarrer l'application frontend
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## Scripts disponibles

### API (dossier `api`)
- `npm run dev` : Démarrer l'API en mode développement
- `npm run db:create` : Créer les tables de la base de données
- `npm run db:seed` : Insérer les données de test
- `npm run db:reset` : Recréer et réinitialiser la base de données

### Client (dossier `client`)
- `npm run dev` : Démarrer l'application en mode développement
- `npm run build` : Construire l'application pour la production
- `npm run preview` : Prévisualiser la version de production
- `npm run lint` : Vérifier la syntaxe du code
- `npm run format` : Formatter le code

## Accés à l'application

Une fois les deux serveurs démarrés :

1. **Frontend** : http://localhost:5173
2. **API** : http://localhost:3000

## Problèmes courants

### Erreur de connexion à la base de données
- Vérifiez que PostgreSQL est démarré
- Vérifiez l'URL de connexion dans le fichier `.env`
- Assurez-vous que la base de données existe

### Erreur CORS
- Vérifiez que l'API autorise les requêtes depuis `http://localhost:5173`
- La configuration CORS est dans `api/app.js`

### Erreur de JWT
- Vérifiez que `JWT_SECRET` est défini dans le fichier `.env` de l'API
- Assurez-vous que le secret est suffisamment long et sécuris
# 🌿 GreenRoots – Plateforme de reforestation participative

GreenRoots est une plateforme e-commerce permettant aux utilisateurs d’acheter des arbres à planter afin de participer activement à la reforestation mondiale. Le projet s’inscrit dans une démarche pédagogique réalisée dans le cadre de la formation DWWM (Développeur Web et Web Mobile).

---

## 🚀 Fonctionnalités principales

- 🏡 **Accueil** présentant la mission GreenRoots et les arbres disponibles
- 👤 **Inscription / Connexion** avec authentification via JWT
- 🌳 **Consultation d'arbres** disponibles à l'achat
- 🛒 **Commande d’un arbre** (simulée dans le MVP)
- 📦 **Suivi des commandes passées** par utilisateur
- 🛠️ **Interface d’administration** (CRUD des arbres - rôle admin)

---

## 🛠️ Stack technique

### Front-End (déployé sur [Vercel](https://vercel.com/))

- [SvelteKit](https://kit.svelte.dev/) – Framework fullstack moderne
- [Tailwind CSS](https://tailwindcss.com/) – Framework CSS utilitaire

### Back-End (déployé sur [Railway](https://railway.com/))

- [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/) – Base de données relationnelle
- [Sequelize](https://sequelize.org/) – ORM pour Node.js
- [JWT](https://jwt.io/) – Authentification sécurisée

---

## 📁 Structure du projet

```
/client    → Front-end SvelteKit
/api       → Back-end Express + PostgreSQL
```

---

<!-- ## 🌍 Déploiement

### 🎯 Front : Vercel

- [https://greenroots.vercel.app](https://greenroots.vercel.app)

### 🔗 API : Render

- [https://greenroots-api.onrender.com](https://greenroots-api.onrender.com)

--- -->

## 🧪 Lancer le projet en local

### Cloner le repo

```bash
git clone https://github.com/votre-utilisateur/greenroots.git
cd greenroots
```

### 🔧 Front-end

```bash
cd client
npm install
npm run dev
```

### 🧰 Back-end

```bash
cd api
npm install
npm run dev
```

### 🔑 Variables d’environnement `.env`

**Front-end**

```
# HTTP server
VITE_API_URL=http://localhost:3000

# JWT
JWT_SECRET=jwt_secret

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
```

**Back-end**

```
# HTTP server
PORT=5000

# Postgres URL
PG_URL=postgres://user:password@localhost:5432/greenroots
JWT_SECRET=ton_secret
FRONTEND_URL=http://localhost:5173

# JWT
JWT_SECRET=jwt_secret
SESSION_SECRET=dev_session_secret

# Nodemailer
EMAIL_USER=Votre_Adresse_Email_de_lenvoyer
EMAIL_PASS=Mot_de_passe_dapplication
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
CONTACT_RECEIVER_EMAIL=Votre_Adresse_Email_de_lenvoyer

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
```

---

## 👥 Rôles utilisateurs

- **Admin** : Gère les arbres, les utilisateurs, les commandes
- **Utilisateur** : Navigue, commande des arbres, suit ses plantations
- **Partenaire** _(évolution)_ : Propose ses propres arbres à la plantation

---

## 📌 Objectifs pédagogiques

Ce projet couvre de nombreuses compétences du métier de développeur web :

- Intégration front avec SvelteKit, TailwindCSS
- Gestion des états, appels API, routage
- Conception de base de données (MCD, MLD)
- Développement d’une API REST sécurisée avec Express
- Mise en place d’une authentification avec JWT
- Organisation agile (méthode Scrum)
<!-- - Déploiement cloud (Vercel / Railway) -->

---

## 🙌 Remerciements

Merci à l’équipe pédagogique et aux collègues de formation pour les retours, conseils et revues de code. Ce projet est un exercice pratique fictif mais riche en apprentissage.

---

## 📃 Licence

Ce projet est libre de droits dans un cadre pédagogique uniquement.

---

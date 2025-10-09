## Structure des fichiers `routes/` pour SvelteKit (Front-end)

Voici la structure complète à créer dans `src/routes/` pour le front-end:

```
src/routes/
├── +layout.svelte
├── +page.svelte              # Landing page /
├── arbres/
│   ├── +page.svelte          # /arbres
│   └── [id]/
│       └── +page.svelte      # /arbres/[id]
├── panier/
│   └── +page.svelte          # /panier
├── connexion/
│   └── +page.svelte          # /connexion
├── inscription/
│   └── +page.svelte          # /inscription
├── profil/
│   ├── +page.svelte          # /profil
│   └── commandes/
│       └── +page.svelte      # /profil/commandes
├── mentions/
│   └── +page.svelte          # /mentions
├── remerciement/
│   └── +page.svelte          # /remerciement
└── 404.svelte                # Page d’erreur
```

## Liste des routes API (back-end Express)

Ces endpoints seront consommés par le front-end.

### 🧑 Utilisateurs

| Méthode | Endpoint      | Description                         |
| ------- | ------------- | ----------------------------------- |
| POST    | /api/register | Inscription d’un utilisateur        |
| POST    | /api/login    | Connexion + retour du JWT           |
| GET     | /api/user     | Récupère les infos du user connecté |

### 🌳 Arbres (trees)

| Méthode | Endpoint       | Description                    |
| ------- | -------------- | ------------------------------ |
| GET     | /api/trees     | Liste de tous les arbres       |
| GET     | /api/trees/:id | Détails d’un arbre             |
| POST    | /api/trees     | Création (admin ou partenaire) |
| PUT     | /api/trees/:id | Édition d’un arbre             |
| DELETE  | /api/trees/:id | Suppression                    |

### 🛒 Commandes

| Méthode | Endpoint           | Description                       |
| ------- | ------------------ | --------------------------------- |
| POST    | /api/commandes     | Créer une commande (panier)       |
| GET     | /api/commandes     | Liste des commandes du user       |
| GET     | /api/commandes/:id | Détail d’une commande (optionnel) |

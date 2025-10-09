## 🌐 Arborescence des routes utilisateur

```
/
├── /                       # Landing page (présentation GreenRoots, CTA)
├── /arbres                 # Catalogue des arbres à planter
│   └── /[id]               # Détail d’un arbre sélectionné
├── /panier                 # Récapitulatif de commande (faux tunnel d’achat)
├── /connexion              # Formulaire de connexion
├── /inscription            # Formulaire d’inscription
├── /profil                 # Espace utilisateur connecté
│   └── /commandes          # Historique des commandes passées
└── /mentions               # Mentions légales / RGPD
```

## 🔒 Routes protégées (authentification requise)

| Route               | Accès requis         | Description                |
| ------------------- | -------------------- | -------------------------- |
| `/profil`           | Utilisateur connecté | Page d'accueil utilisateur |
| `/profil/commandes` | Utilisateur connecté | Historique des achats      |

## 🧑‍💻 Routes Admin / Back-office (optionnelles)

```
/admin
├── /arbres         # Gestion (CRUD) des arbres
├── /utilisateurs   # Liste & gestion des utilisateurs
└── /commandes      # Suivi des commandes
```

> Ces routes sont accessibles uniquement avec un rôle `admin` ou `partenaire`.

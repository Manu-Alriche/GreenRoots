## Liste des rôles et accès

### 👤 Utilisateur non connecté (visiteur)

**Accès :**

- Pages publiques : accueil, catalogue des arbres, fiche d’un arbre
- Pages d’authentification : inscription / connexion
- Mentions légales / CGU / Politique RGPD

**Autorisations :**

- Naviguer sur le site
- Consulter les arbres
- Créer un compte
- Se connecter

### 👤 Utilisateur connecté (client)

**Accès :**

- Pages publiques
- Panier / commande
- Profil utilisateur / historique

**Autorisations :**

- Ajouter des arbres au panier
- Passer une commande (simulation)
- Voir ses commandes passées
- Gérer ses infos personnelles (optionnel)
- Se déconnecter

### 👩‍💼 Administrateur (rôle = "admin")

**Accès :**

- Back-office sécurisé (routes /admin/\*\*)
- Interface CRUD arbres
- Gestion utilisateurs / commandes

**Autorisations :**

- Ajouter / modifier / supprimer un arbre
- Consulter tous les utilisateurs
- Consulter toutes les commandes
- Modérer les ajouts de partenaires (future feature)
- Attribuer des rôles (optionnel)

### 🌿 Partenaire (rôle = "partenaire") (fonctionnalité évolutive)

**Accès :**

- Interface pour proposer des arbres à planter

**Autorisations :**

- Créer une fiche d’arbre à proposer
- Voir ses propres arbres / statistiques
- Gérer son "stock partenaire" (si implémenté)

#### 🗃️ Exemple dans la BDD (colonne role dans users)

| id  | nom       | email               | role       |
| --- | --------- | ------------------- | ---------- |
| 1   | Alice     | alice@greenroots.fr | admin      |
| 2   | Bob       | bob@example.com     | client     |
| 3   | ONG Trees | trees@partner.org   | partenaire |

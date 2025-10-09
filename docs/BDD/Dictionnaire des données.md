# Dictionnaire des données

## 🔹 Table : user

| Champ               | Type    | Contraintes               | Description                     |
| ------------------- | ------- | ------------------------- | ------------------------------- |
| `id`                | INTEGER | PK, Auto Increment        | Identifiant unique              |
| `firstName`         | STRING  |                           | Prénom de l'utilisateur         |
| `lastName`          | STRING  |                           | Nom de famille                  |
| `email`             | STRING  | UNIQUE, NOT NULL          | Email unique                    |
| `password`          | STRING  | NOT NULL                  | Mot de passe crypté             |
| `email_verified`    | BOOLEAN | NOT NULL, default `false` | Email vérifié ou non            |
| `email_verified_at` | DATE    | NULLABLE                  | Date de vérification de l'email |
| `role_id`           | INTEGER | FK → role(id), NOT NULL   | Rôle de l'utilisateur           |

## 🔹 Table : role

| Champ  | Type    | Contraintes        | Description                  |
| ------ | ------- | ------------------ | ---------------------------- |
| `id`   | INTEGER | PK, Auto Increment | Identifiant de rôle          |
| `name` | STRING  | NOT NULL           | Nom du rôle (admin, user...) |

## 🔹 Table : password_reset_tokens

| Champ        | Type       | Contraintes                      | Description               |
| ------------ | ---------- | -------------------------------- | ------------------------- |
| `id`         | INTEGER    | PK, Auto Increment               | Identifiant               |
| `user_id`    | INTEGER    | FK → user(id), NOT NULL          | Utilisateur concerné      |
| `token`      | STRING(64) | UNIQUE, NOT NULL, default généré | Jeton unique              |
| `expires_at` | DATE       | NOT NULL, default +1h            | Expiration du jeton       |
| `used`       | BOOLEAN    | NOT NULL, default `false`        | Jeton déjà utilisé ou non |

## 🔹 Table : email_verification_tokens

| Champ        | Type       | Contraintes                      | Description           |
| ------------ | ---------- | -------------------------------- | --------------------- |
| `id`         | INTEGER    | PK, Auto Increment               | Identifiant           |
| `user_id`    | INTEGER    | FK → user(id), NOT NULL          | Utilisateur concerné  |
| `token`      | STRING(64) | UNIQUE, NOT NULL, default généré | Jeton de vérification |
| `expires_at` | DATE       | NOT NULL, default +24h           | Expiration du jeton   |
| `used`       | BOOLEAN    | NOT NULL, default `false`        | Jeton utilisé ou non  |

## 🔹 Table : tree

| Champ           | Type      | Contraintes                      | Description           |
| --------------- | --------- | -------------------------------- | --------------------- |
| `id`            | INTEGER   | PK, Auto Increment               | Identifiant           |
| `reference`     | STRING(8) | UNIQUE, NOT NULL, default généré | Code de référence     |
| `name`          | STRING    |                                  | Nom de l’arbre        |
| `description`   | TEXT      |                                  | Description           |
| `price`         | FLOAT     |                                  | Prix                  |
| `stock`         | INTEGER   | NOT NULL, default `0`, min `0`   | Stock disponible      |
| `status`        | ENUM      | NOT NULL, default `'active'`     | Statut actif/inactif  |
| `deactivatedAt` | DATE      | NULLABLE                         | Date de désactivation |
| `imageUrl`      | STRING    | NULLABLE                         | URL image             |

## 🔹 Table : order

| Champ          | Type       | Contraintes               | Description                            |
| -------------- | ---------- | ------------------------- | -------------------------------------- |
| `id`           | INTEGER    | PK, Auto Increment        | Identifiant de commande                |
| `firstName`    | STRING     |                           | Prénom du client (copie à la commande) |
| `lastName`     | STRING     |                           | Nom du client                          |
| `localisation` | STRING     |                           | Localisation de livraison              |
| `note`         | TEXT       |                           | Note client                            |
| `total`        | FLOAT      |                           | Total en euros                         |
| `reference`    | STRING(10) | UNIQUE, NOT NULL, default | Référence unique de commande           |
| `user_id`      | INTEGER    | FK → user(id), NOT NULL   | Référence utilisateur ayant commandé   |

## 🔹 Table : order_item

| Champ      | Type    | Contraintes             | Description                       |
| ---------- | ------- | ----------------------- | --------------------------------- |
| `id`       | INTEGER | PK, Auto Increment (\*) | Identifiant de l’item (optionnel) |
| `quantity` | INTEGER | NOT NULL                | Quantité commandée                |
| `order_id` | INTEGER | FK → order(id)          | Commande associée                 |
| `tree_id`  | INTEGER | FK → tree(id)           | Arbre associé                     |

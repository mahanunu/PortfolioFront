# Portfolio Fullstack - Projet Étudiant

Ce projet est une application web fullstack comprenant un backend Symfony (API Platform) et un frontend Next.js.

## Membres du Groupe

- Kaoutar ARARE
- Mahalia PIRES
- Omar AISSI
- Aziz MAKNI

## Prérequis

Avant de commencer, assurez-vous d'avoir les éléments suivants installés sur votre système :

- PHP >= 8.1 (avec les extensions PHP requises par Symfony : ctype, iconv, pdo_sqlite, etc.)
- Composer (gestionnaire de dépendances PHP)
- Node.js >= 18.x
- npm ou yarn (gestionnaire de paquets Node.js)
- Symfony CLI (optionnel mais recommandé pour le backend)
- Un serveur de base de données compatible avec Doctrine (ex: SQLite, MySQL, PostgreSQL). Ce README se concentre sur SQLite pour la simplicité.
- Client SQLite en ligne de commande (si vous souhaitez utiliser le fichier `import_data.sql` directement).

## Installation et Lancement

### 1. Backend (Symfony API - PortfolioBack)

**Configuration de l'environnement Backend :**

Créez un fichier `.env.local` à la racine du dossier `PortfolioBack` (copiez `PortfolioBack/.env` et modifiez-le si nécessaire).
Assurez-vous que la variable `DATABASE_URL` est correctement configurée. Pour SQLite, cela ressemblera à :
```
# PortfolioBack/.env ou PortfolioBack/.env.local
DATABASE_URL="mysql://root@127.0.0.1:3306/PortfolioProjet"
```

Pour les autres variables d'environnement importantes pour le backend (JWT, etc.) :
```env
# PortfolioBack/.env ou PortfolioBack/.env.local

###> lexik/jwt-authentication-bundle ###
JWT_SECRET_KEY=%kernel.project_dir%/config/jwt/private.pem
JWT_PUBLIC_KEY=%kernel.project_dir%/config/jwt/public.pem
JWT_PASSPHRASE=votreMotDePasseSuperSecretPourLesClesJWT
###< lexik/jwt-authentication-bundle ###

###> nelmio/cors-bundle ###
CORS_ALLOW_ORIGIN=^'http://localhost:3000'$
###< nelmio/cors-bundle ###

# Symfony
APP_ENV=dev
APP_SECRET=votreCleSecreteSymfonyTresLongueEtAleatoire
```

**Étapes d'installation Backend :**

```bash
# 1. Accédez au répertoire du backend
cd PortfolioBack

# 2. Installez les dépendances PHP avec Composer
composer install

# 3. (Si ce n'est pas déjà fait) Générez les clés JWT 
# (vous serez invité à entrer le JWT_PASSPHRASE défini dans votre .env)
php bin/console lexik:jwt:generate-keypair

# 4. Créez la base de données (si elle n'existe pas)
php bin/console doctrine:database:create --if-not-exists

# 5. Exécutez les migrations Doctrine pour créer le schéma de la base de données
php bin/console doctrine:migrations:migrate
```

**Chargement des données de démarrage :**

Vous avez deux options pour peupler la base de données avec des données initiales :

*   **Option A : Utiliser les Fixtures Doctrine (Recommandé pour la maintenabilité)**
    ```bash
    # PortfolioBack/
    php bin/console doctrine:fixtures:load
    # Répondez 'yes' à la confirmation si demandé
    ```
    Cela exécutera les classes de fixtures PHP situées dans `src/DataFixtures/` pour peupler la base de données. Les mots de passe seront correctement hashés.

*   **Option B : Importer le fichier SQL `import_data.sql` (Pour un jeu de données statique)**
    Le fichier `import_data.sql` (situé à la racine du projet global) contient des instructions SQL pour insérer des utilisateurs et des projets. Les mots de passe dans ce fichier sont des exemples de hashs Bcrypt.
    ```bash
    # Depuis la racine du projet global (où se trouve import_data.sql)
    sqlite3 PortfolioBack/var/data.db < import_data.sql
    
    # Ou si vous êtes dans le répertoire PortfolioBack/
    # sqlite3 var/data.db < ../import_data.sql
    ```
    Assurez-vous que le chemin vers `data.db` et `import_data.sql` est correct par rapport à votre position actuelle.
    Si vous utilisez cette méthode, il est conseillé de le faire après les migrations et avant de lancer le serveur. Les commandes `DELETE FROM` au début du script SQL nettoieront les tables concernées avant l'insertion.

**Lancement du serveur Backend :**

```bash
# Depuis le répertoire PortfolioBack/

# Avec Symfony CLI (recommandé) :
symfony serve
# Ou avec le serveur web interne de PHP :
# php -S localhost:8000 -t public
```
Le backend devrait maintenant être accessible sur `http://localhost:8000`.

### 2. Frontend (Next.js - PortfolioFront)

**Configuration de l'environnement Frontend :**

Le frontend est configuré pour communiquer avec le backend sur `http://localhost:8000`. Si votre backend tourne sur un port différent, vous devrez mettre à jour les URLs dans les composants frontend (ex: dans les appels `fetch`).

**Étapes d'installation Frontend :**

```bash
# 1. Accédez au répertoire du frontend
# Si vous êtes à la racine du projet global :
cd PortfolioFront 
# Si vous étiez dans PortfolioBack, faites cd ../PortfolioFront

# 2. Installez les dépendances Node.js
# Avec npm :
npm install
# Ou avec yarn :
# yarn install

# 3. Lancez le serveur de développement Next.js
# Avec npm :
npm run dev
# Ou avec yarn :
# yarn dev
```
Le frontend devrait maintenant être accessible sur `http://localhost:3000`.

## Informations Utiles

### Utilisateurs de Test (créés par les fixtures ou `import_data.sql`)

- **Admin :**
  - Email : `admin@example.com`
  - Mot de passe : `adminpass` (hashé : `$2y$13$HJG0.ghL0yN5YkStz17yN.cvkz7LhMVIFP9hV3G9rnbk067nLFF9S`)
- **Utilisateur Standard (Kaoutar) :**
  - Email : `kaoutar.arare@example.com`
  - Mot de passe : `password123` (hashé : `$2y$13$9gV.KPVV6gX9/fGvj5zKkeBJR6j4sV2jKOaQvO0fDxBEsV80qA.1y`)
- **Autres utilisateurs (Mahalia, Omar, Aziz) :**
  - Emails : `mahalia.pires@example.com`, `omar.aissi@example.com`, `aziz.makni@example.com`
  - Mot de passe pour tous : `password123` (hashé : `$2y$13$9gV.KPVV6gX9/fGvj5zKkeBJR6j4sV2jKOaQvO0fDxBEsV80qA.1y`)

*Note sur les mots de passe dans `import_data.sql`: Les hashs fournis sont des exemples. Pour des raisons de sécurité et de compatibilité avec la configuration de hashage de votre application Symfony, l'utilisation des fixtures Doctrine (`doctrine:fixtures:load`) est la méthode la plus fiable pour s'assurer que les mots de passe sont correctement hashés et utilisables.* 

### Structure des Rôles

- Les utilisateurs nouvellement créés via l'API ou les fixtures/SQL (sauf l'admin) ont par défaut les rôles `PUBLIC_ACCESS` (défini dans le constructeur de l'entité User) et `ROLE_USER` (ajouté dynamiquement par la méthode `getRoles()`).
- L'utilisateur admin a le rôle `ROLE_ADMIN`.

### Points d'API importants (Backend)

- `/api/auth` (POST) : Authentification (login), retourne un token JWT.
- `/api/users` (POST) : Création d'un nouvel utilisateur (public).
- `/api/projects` (GET) : Liste des projets (filtrée par visibilité pour les non-admins).
- `/api/projects/{id}` (GET) : Détail d'un projet (accès contrôlé par visibilité pour les non-admins).
- Les opérations POST, PATCH, DELETE sur `/api/projects` sont réservées aux admins.

## Dépannage

- **Erreurs CORS :** Assurez-vous que `CORS_ALLOW_ORIGIN` dans `PortfolioBack/.env.local` correspond bien à l'URL de votre frontend (par défaut `^http://localhost:3000`). Vérifiez également que le `NelmioCorsBundle` est correctement configuré et que le pare-feu Symfony autorise les requêtes `OPTIONS`.
- **Problèmes de base de données :** Si vous changez de SGBD (ex: de SQLite à MySQL), mettez à jour `DATABASE_URL` et assurez-vous que le SGBD est en cours d'exécution et accessible. Vous devrez peut-être recréer la base de données et ré-exécuter les migrations et les données de démarrage.
- **Erreurs JWT :** Vérifiez que les clés JWT (privée et publique) sont générées dans `PortfolioBack/config/jwt/` et que `JWT_PASSPHRASE` est correctement défini dans votre `.env.local`.

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/3bd8f19bdd0a4b74a1bb8672e008145f)](https://app.codacy.com/gh/thomasbnt/DW_P7_Groupomania_backend_OC?utm_source=github.com&utm_medium=referral&utm_content=thomasbnt/DW_P7_Groupomania_backend_OC&utm_campaign=Badge_Grade_Settings)
[![Wakatime](https://wakatime.com/badge/github/thomasbnt/DW_P7_Groupomania_backend_OC.svg?style=for-the-badge)](https://wakatime.com/badge/github/thomasbnt/DW_P7_Groupomania_backend_OC)
![Build with MariaDB](https://img.shields.io/badge/Build%20with%20MariaDB-%2300f.svg?&color=800&style=for-the-badge&logo=mongodb&logoColor=white)
[![build with ExpressJS](https://img.shields.io/badge/Build%20with%20Express-%234752C4.svg?&style=for-the-badge&color=white&logo=express&logoColor=black&alt=express)](https://github.com/expressjs/express)

![Groupomania logo](groupomania.svg)

> Projet n°6 OpenClassrooms Développeur Web. — 24 août 2022.

## Introduction

Cette partie est spécialement pour le **backend** du projet. Il est sous **ExpressJS** côté serveur, et sous **MariaDB** côté base de données.
Pour le choix de l'ORM, **Prisma** a été choisi.

## Installation

Pour pouvoir exécuter ce projet, veuillez suivre ces étapes.

1. Installez **NodeJS** (>= 16.10) et **npm**.
2. Installez les dépendances nécessaires aux deux parties (frontend et backend).
3. Copiez le fichier [.env.example](/.env.example) en `.env` et remplacez les valeurs par vos propres.
4. N'oubliez pas d'avoir un accès à votre base de données MariaDB
5. Exécutez le script backend, à coup de `npm run serve`. _Port 3000_
6. Exécutez le script frontend, à coup de `npm run start`. _Port 4200_ (Ou `ng serve`)
7. Vous pouvez maintenant accéder à l'interface de votre site.

## Configuration du .env
Exemple de `.env` :

```dotenv


```

> **Note**
> `FRONT_DOMAIN` est le domaine de votre site, ici utilisé pour des raisons de sécurité (cors), nous délimitons les calls API que depuis ce domaine.

## Cahier des charges

- API conforme aux exigences de sécurité
- Toutes les routes en DEL/POST/PUT pour les sauces et likes sont protégés par Bearer Token.

## Développement

- Projet réalisé avec **IntelliJ**.
- Testé avec [Hoppscotch](https://hoppscotch.io). (_Fichier de configuration : [`.hoppscotch.json`](hoppscotch.json)_)

## Contributions

Les contributions sont toujours les bienvenues ! Lisez les règles pour les contributions avant de pouvoir y participer.

Veuillez vous assurer que votre demande de pull request respecte les lignes directrices suivantes :

- Rechercher des suggestions précédentes avant d'en faire une nouvelle, afin d'éviter les doublons.
- Les fichiers README suggérés devraient être beau ou se démarquer d'une manière ou d'une autre.
- Faire une demande de pull request individuelle pour chaque suggestion.
- De nouvelles catégories ou des améliorations à la catégorisation existante sont les bienvenues.
- Gardez les descriptions courtes et simples, mais descriptives.
- Commencez la description avec une capitale et terminez par un arrêt/période complet.
- Vérifiez votre orthographe et votre grammaire.
- Assurez-vous que votre éditeur de texte est configuré pour supprimer les espaces de fin.

Merci pour vos suggestions !


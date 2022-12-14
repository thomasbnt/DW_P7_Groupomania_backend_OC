![Fait avec MariaDB](https://img.shields.io/badge/Fait%20avec%20MariaDB-%2300f.svg?&color=800&style=for-the-badge&logo=mongodb&logoColor=white)
[![Propulsé par Prisma](https://img.shields.io/badge/Propulsé%20par%20Prisma-%234752C4.svg?&style=for-the-badge&color=0B354B&logo=prisma&logoColor=white&alt=Prisma)](https://www.prisma.io/)
[![Réalisé avec ExpressJS](https://img.shields.io/badge/Réalisé%20avec%20Express-white.svg?&style=for-the-badge&color=259DFF&logo=express&logoColor=white&alt=express)](https://github.com/expressjs/express)
[![Codacy Badge](https://img.shields.io/codacy/grade/760b3a894bef4bf0bb4a72b4598c0455?style=for-the-badge)](https://www.codacy.com/gh/thomasbnt/DW_P7_Groupomania_backend_OC/dashboard)
[![Wakatime](https://wakatime.com/badge/github/thomasbnt/DW_P7_Groupomania_backend_OC.svg?style=for-the-badge)](https://wakatime.com/badge/github/thomasbnt/DW_P7_Groupomania_backend_OC)

![Groupomania logo](groupomania.svg)

> Projet n°7 OpenClassrooms Développeur Web. — 24 août 2022.

## Introduction

Cette partie est spécialement pour le **backend** du projet. Il est sous **ExpressJS** côté serveur, et sous **MariaDB** côté base de données.
Pour le choix de l'ORM, **Prisma** a été choisi.

> **Note**
>
> Si vous souhaitez voir la page **frontend**, veuillez [vous rendre sur ce dépôt GitHub](https://github.com/thomasbnt/DW_P7_Groupomania_frontend_OC).
>
> [![Partie Backend](https://img.shields.io/badge/Aller%20voir%20la%20partie%20Frontend%20→-informational?style=for-the-badge)](https://github.com/thomasbnt/DW_P7_Groupomania_frontend_OC)

## Installation

Pour pouvoir exécuter ce projet, veuillez suivre ces étapes.

1. Installez **NodeJS** (>= 16.10) et **npm**.
2. Installez les dépendances nécessaires.
3. Copiez le fichier [.env.example](/.env.example) en `.env` et remplacez les valeurs par vos propres.
4. N'oubliez pas d'avoir un accès à votre base de données MariaDB
5. Exécutez le script backend, à coup de `npm run serve`. _Port 3000_
6. Vous pouvez maintenant accéder à l'API.
7. Pour la tester, allez sur [localhost:3000/status](http://localhost:3000/status) devrait vous renvoyer un message de succès.

## Configuration du `.env`

Exemple de `.env` :

```dotenv
FRONTEND_URL=http://localhost:5000
DATABASE_URL=mysql://USER:MDP@IP:3306/BDD
```

> **Note** > `FRONTEND_URL` est le domaine de votre site, ici utilisé pour des raisons de sécurité (cors), nous délimitons les calls API que depuis ce domaine.

## Prisma

Génération des fichiers Prisma :

```bash
npx prisma generate
```

Pour la gestion de la base de données, nous utilisons **Prisma**. Pour plus d'informations, veuillez vous rendre sur [la documentation de Prisma](https://www.prisma.io/docs/).

Synchronisez le modèle de données `src/db/schema.prisma` avec la base de données :

```bash
npx prisma db push
```

Initialisation de la base de données avec des valeurs par défaut :

_Pour avoir le compte Admin_


```bash
npx prisma db seed
```

Email : **admin@ndd.local**
Mot de passe : **password**


## Développement

- Projet réalisé avec **IntelliJ**.
- Testé avec **Insomnia**
- Documentation format **OpenAI**

[![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=DW%20P7%20Groupomania%20API&uri=https%3A%2F%2Fraw.githubusercontent.com%2Fthomasbnt%2FDW_P7_Groupomania_backend_OC%2Fmain%2Fswagger.yaml)


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

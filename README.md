<div align="center">

# EpyTodo

**Une API REST de to-do list, avec authentification JWT.**

<img alt="Node.js" src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"/> <img alt="Express" src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white"/> <img alt="MySQL" src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white"/> <img alt="JWT" src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white"/>

<sub>Projet à 2 · 2023</sub>

</div>

<br/>

<p align="center"><img src=".github/assets/term-epytodo.png" alt="EpyTodo" width="820"/></p>

## Le projet en quelques mots

Notre première API web : des utilisateurs, des tâches, et une authentification par token. Les mots de passe sont hachés, les routes sont protégées, et on a ajouté en bonus une petite interface web.

## Ce que ça fait

- Inscription et connexion (`/register`, `/login`), mots de passe hachés avec **bcrypt**
- Routes protégées par **JWT**
- CRUD des utilisateurs (`/user`, `/users/:id`) et des tâches (`/todos`, `/todos/:id`, `/user/todos`)
- Schéma MySQL fourni (`epytodo.sql`)
- Bonus : interface web (inscription, connexion, liste et suppression des tâches)

## Lancer le projet

```bash
mysql -u root -p epytodo < epytodo.sql
cd my_app && npm install && node src/index.js
```

## L'équipe

<a href="https://github.com/Wilson-Epitech/epytodo/graphs/contributors"><img src="https://contrib.rocks/image?repo=Wilson-Epitech/epytodo" alt="Contributeurs"/></a>

Yanis Harkouk, Wilson Bordichon

**Ma partition :** J'ai monté le **serveur Express** et la structure du projet, les routes des **tâches**, l'inscription, la suppression d'utilisateurs, le **schéma SQL** et l'**interface web** bonus.

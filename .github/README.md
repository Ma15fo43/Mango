<div align="center">
    <h1>Mango 🥭</h1>
    <p>Mango is a <b>verified Discord bot</b> made in Typescript that will help you manage your server very easily.</p>
    <p>
        <img src="https://github.com/mazzlabs/Mango/actions/workflows/nodejs.yml/badge.svg" />
        <img src="https://badges.depfu.com/badges/6dea69dd7041b22fb2d1ae17eb72fbe3/overview.svg" />
        <img src="https://img.shields.io/github/license/mazzlabs/Mango" />
    </p>
</div>

## Table of contents
- [Intro](#Introduction)
- [Structure](#Structure)
- [Features](#Features)
    - [Screenshots](#Screenshots)
- [Links](#links)

## Introduction
I started this bot around June 2019 as a summer project to learn how to code. I worked very hard on it and one year later, the bot is in 290 guilds and has more than 170k users! To be part of Mango's growth, feel free to [invite it](https://discord.com/oauth2/authorize?client_id=497443144632238090&permissions=8&scope=bot) in your server :smile:

## Structure
Let's dive into the dev part.
<br>Mango's code is in the ```src/``` folder, divided into subfolders that are pretty self-explanatory.
- [```commands/```](https://github.com/mazzlabs/Mango/tree/master/src/commands) → Folder containing Mango's commands
    - [```fun/```](https://github.com/mazzlabs/Mango/tree/master/src/commands/fun) → Folder containing fun commands
    - [```game/```](https://github.com/mazzlabs/Mango/tree/master/src/commands/game) → Folder containing game commands
    - [```info/```](https://github.com/mazzlabs/Mango/tree/master/src/commands/info) → Folder containing info command
    - [```moderation/```](https://github.com/mazzlabs/Mango/tree/master/src/commands/moderation) → Folder containing moderation commands
- [```events/```](https://github.com/mazzlabs/Mango/tree/master/src/events) → Folder containing Mango's events
- [```models/```](https://github.com/mazzlabs/Mango/tree/master/src/models) → Folder containing Sequelize models
- [```utils/```](https://github.com/mazzlabs/Mango/tree/master/src/utils) → Folder containing various util files

## Features
- [x] Moderation
- [x] Games
- [x] Info
- [x] Economy
- [x] Scratch API 
- [ ] Hypixel API - coming soon!

You can get the help message by typing ```ma!help``` (or ```/help``` using slash commands).

Mango will welcome your members with a nice-looking picture with their avatar and the server member count, automatically. You don't have to do anything ;)

### Screenshots
The welcome message | The canvas command
------------------- | ------------------
<img src="https://i.imgur.com/BWYHFlh.png" alt="welcome" width=450> | <img src="https://i.imgur.com/uldNvl9.png" alt="tictactoe" width=450>

If help is needed, please contact me - https://t.me/enclosures

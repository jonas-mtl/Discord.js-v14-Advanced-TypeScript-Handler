<h1 align="center">
  <img alt="logo" src="https://cdn.discordapp.com/attachments/1006295421771067393/1021813247415959643/rt5fmlek.png" width="224px"/><br/>
  Discord.js v14 TypeScript Handler 
</h1>
<p align="center">Complete system for <b>Discord.js V.14</b> completely wtitten in <b>TypeScript</b> ~ Made by Jonas</p>

<p align="center">
<a href="https://github.com/JonasThierbach/Discord.js-v14-Typescript-Handler/fork"><img src="https://img.shields.io/github/forks/JonasThierbach/Discord.js-v14-Typescript-Handler?style=for-the-badge" alt="Fork Repo" /></a>
<a href="https://github.com/discordjs/discord.js/"><img src="https://img.shields.io/badge/discord.js-v14-blue?style=for-the-badge" alt="discord.js"></a>
<a href="https://nodejs.org/en/download/">
   <img src="https://img.shields.io/badge/node-16.16.x-brightgreen?style=for-the-badge" alt="node.js">
</a>
</p>

<p align="center">
<img src="https://img.shields.io/github/stars/JonasThierbach?style=for-the-badge" alt="Github Stars" />
<a href="https://discord.gg/uTCqcvC5Xf"><img src="https://img.shields.io/discord/989513288243097650?label=Personal%20Discord&style=for-the-badge" alt="Personal Discord" /></a>
</p>

## ⚡️ Features

- [x] Fully working & efficient Reload Command for developing
- [x] Advanced Prefix Commands Handler
- [x] Anti Crash Handler (toggable)
- [x] Select Menus & Modal Handler
- [x] Premium system with MongoDB
- [x] Cool Help Command included
- [x] Slash Commands Handler
- [x] Developer commands
- [x] Cooldown option
- [x] Events Handler
- [x] Button Handler

> **Everything Multi-Guild ready and easy to use!**

## 📖 Screenshot

<img src="https://cdn.discordapp.com/attachments/1011006518797275158/1021779560980828170/8e3363qv_1.png" alt="Preview" />

## 📝 Installation Guide

- You will need to install the TypeScript compiler either globally or in your workspace to transpile TypeScript source code to JavaScript:
  - [`download Guide`](https://www.typescriptlang.org/download) — `npm install -g typescript@lastest` **Version 4.7.x +**.
- Adjust the settings in `./src/config.ts` so everything suits you:
  - to enable the crash handler use: `ERROR_HANDLING: true,`
  - if you want to register your Slash Commands globally use: ` DEVELOPEMENT: false,`
- Install all dependencies by using `npm install`
- Change the colors and icons used for Embeds in `./src/Structures/Design/`
- To run the bot:
  - build first with `npm run build` / `tsc` >> start the bot with `npm run start` (to start once) / `npm run nodemon` (to restart automatically on build) - you will need to `npm install -g nodemon`

## ⚙️ Commands & Event Options

## Slash Commands:

### `Structure`

```js
data: [SlashCommandBuilder],
options: {
  cooldown?: number;
  isPremium?: boolean;
  description?: string;
}
execute: (interaction, client) => {}
```

| Option        | Description                                                     | Type     | Default | Required? |
| ------------- | --------------------------------------------------------------- | -------- | ------- | --------- |
| `isPremium`   | Sets whether to set a command premium / free.                   | `bool`   | `false` | No        |
| `Cooldown`    | Adds an automatic cooldown in ms to the command.                | `number` | `0`     | No        |
| `Description` | Description is used to list the Commands in the `/help`Command. | `string` |         | No        |

---

## Prefix Commands:

### `Structure`

```js
name: string,
description: string,
aliases: Array<string>,
permissions: Array<PermissionsString> | PermissionsString,
cooldown: number,
isPremium: boolean,
isDevCommand: boolean,
options: [{
  name: string;
  type: 'user' | 'role' | 'channel' | 'string' | 'number' | 'boolean' | string | number | boolean;
  required?: boolean;
}],
execute: (message, customArgs, client) => {}
```

| Option         | Description                                                          | Type               | Default | Required? |
| -------------- | -------------------------------------------------------------------- | ------------------ | ------- | --------- |
| `Name`         | Adds a name to the command.                                          | `string`           |         | Yes       |
| `Description`  | Description is used to list the Commands in the `/help`Command.      | `string`           |         | No        |
| `Aliases`      | Adds aliases for the command.                                        | `string`           |         | Yes       |
| `Permissions`  | Set Permissions for the command.                                     | `array` / `string` | `none`  | No        |
| `Cooldown`     | Adds an automatic cooldown in ms to the command.                     | `number`           | `0`     | No        |
| `isPremium`    | Sets whether to set a command premium / free.                        | `bool`             | `false` | No        |
| `isDevCommand` | When enabled, command is only available in the DevGuild (config.ts). | `array`            | `false` | No        |

---

## Events:

### `Structure`

```js
name: ClientEvent;
options: {
  ONCE?: boolean,
  REST?: boolean
};
```

| Option | Description                                                               | Type   | Default | Required? |
| ------ | ------------------------------------------------------------------------- | ------ | ------- | --------- |
| `ONCE` | Specifies if the event should run only once.                              | `bool` | `false` | No        |
| `REST` | Rest parameter collects variable numbers of arguments into a single array | `bool` | `false` | No        |

---

## Buttons:

### `Structure`

```js
  customId: string,
  checkIfCustomIdIncludes?: boolean,
  cooldown?: number,
  isPremium?: boolean,
  permissions?: Array<PermissionsString> | PermissionsString,
  allowInteractionAuthorOnly?: boolean,
  execute: (...args: any[]) => any,
```

| Option                       | Description                                                                                       | Type               | Default | Required? |
| ---------------------------- | ------------------------------------------------------------------------------------------------- | ------------------ | ------- | --------- |
| `customId`                   | The buttons CustomID.                                                                             | `string`           |         | Yes       |
| `checkIfCustomIdIncludes`    | Enables whether the Button event should execute if the interacted ButtonID includes the CustomID. | `boolean`          | `false` | No        |
| `Permissions`                | Set Permissions for the command.                                                                  | `array` / `string` | `none`  | No        |
| `Cooldown`                   | Adds an automatic cooldown in ms to the command.                                                  | `number`           | `0`     | No        |
| `isPremium`                  | Sets whether to set a command premium / free.                                                     | `bool`             | `false` | No        |
| `allowInteractionAuthorOnly` | Enables only author / user of the message interaction to use the button                           | `bool`             | `false` | No        |

---

## ⭐️ Made by Jonas#1713

> Credits for the and basic structure - basic system of the slash & events command handler go to [Amit Kumar](https://github.com/AmitKumarHQ) 😘

### If you want to say **thank you** or/and support active development of the Handler:

- Add a **[GitHub Star](https://github.com/JonasThierbach/Discord.js-v14-Typescript-Handler)** to the project _& [Amit Kumar's Projects](https://github.com/AmitKumarHQ?tab=repositories)_.
- Please give proper credits when you use the Handler, especially if you want to edit and post to public.
- Add me on Discord pleasee _(Im alone, searching some Dev friends and someone to collab with me)_.

<a href="https://www.producthunt.com/posts/create-go-app?utm_source=badge-review&utm_medium=badge&utm_souce=badge-create-go-app#discussion-body" target="_blank"><img src="https://discord.c99.nl/widget/theme-3/783252406753689601.png" alt="Discord Profile"  /></a>

## ⚠️ License

The Discord.js v14 TypeScript Handler is available under the **MIT License**

# Robbot

[![Build Status](https://travis-ci.org/robflop/robbot.svg?branch=master)](https://travis-ci.org/robflop/robbot)

A Discord bot to go along with my website, [megumin.love](https://megumin.love).

Written using discord.js, using opusscript, snekfetch, moment and prism-media packages (plus some standard node ones).

Add the bot to your server: [Invite me](https://discordapp.com/oauth2/authorize?client_id=257126756069277696&scope=bot&permissions=70274048)

## Self-hosting usage

(It is assumed you already have a Discord OAuth application and bot account aswell as [node.js](https://nodejs.org/en/) on version 7.6+ installed)

- Rename `config.example.json` in the `src/` folder to `config.json`
- Populate the owners array in config.json with your ID(s)
- Adjust other config settings to your liking
- Run `npm install` to install all dependencies
- (Feel free to ignore any "unmet dependency" warnings)
- Install ffmpeg - if on Windows, add it to your PATH aswell
- Start the bot using `node robbot.js`!

Optional: If you've got the bot running on a linux server, consider installing node-opus for better voice performance than opusscript.

(Opusscript used for development on Windows.)

### Adding commands

Adding commands to robbot is very easy. The command handler will automatically register any .js file within the commands folder so
the only thing you have to do is make your command file, write the code for it (*), and restart the bot.

That's all, now your command is available under the name you gave the js file.
Use it with `<prefix> <command>`. It will also be listed in the `help` command.

(\*) *Commands extend the Command class located in `structures/` and must at least provide the name property in the constructor aswell as a `run()` function outside the constructor or errors will happen. See existing commands for usage examples.*

#### Information

- By default, a command cooldown of 3 seconds is applied and the default prefix is set to `robbot,`.
- DiscordBots integration is disabled by default. Activate the command in the config and set your API token to use it. (Not able to activate using the `toggle` command)
- To make the bot use PM2 (relevant for `power` command aswell as `disconnect` handling), switch the config setting to true. It will then kill the pm2 process on usage of the `power` command and restart the process on disconnect.

#### License

Licensed under the [MIT License](https://github.com/robflop/robbot/blob/master/LICENSE.md).

## Out-of-the-box Commands

Refer to the [Wiki Usage page](https://github.com/robflop/robbot/wiki/Usage) for more in-depth explanations.

| Command       | Effect                                                                                             |
|-------------  |----------------------------------------------------------------------------------------------------|
| blacklist     | Blacklist a discord guild                                                                          |
| cancelSound   | Kill this guild's voice connection if playSound/randomSound bugged out                             |
| counter       | Display various information regarding the counter of <https://megumin.love>                        |
| eval          | Evaluate javascript code                                                                           |
| help          | Get usage help                                                                                     |
| ignore        | Make robbot ignore a user                                                                          |
| info          | Get various bot-related information                                                                |
| ping          | Measure the delay between command call and execution                                               |
| playSound     | Play a chosen sound from <https://megumin.love>                                                    |
| POST          | Update the guild count on <https://bots.discord.pw>                                                |
| randomSound   | Play random sound from <https://megumin.love>                                                      |
| reload        | Reload a command                                                                                   |
| setAvatar     | Change robbot's avatar                                                                             |
| setGame       | Change robbot's game                                                                               |
| setNickname   | Change robbot's nickname                                                                           |
| setUsername   | Change robbot's username                                                                           |
| power         | Restart or shutdown robbot                                                                         |
| toggle        | Toggle a command on or off                                                                         |
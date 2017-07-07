const Command = require('../structures/Command');
const { RichEmbed } = require('discord.js');

class HelpCommand extends Command {
	constructor() {
		super({
			name: 'help',
			description: 'Get usage help',
			aliases: ['h', 'commands'],
			args: [
				{
					type: 'string',
					name: 'command',
					defaultVal: ''
				}
			]
		});
	}

	async run(message, args, guildConfigs) {
		const { config: { commandPrefix }, commands, aliases } = message.client;
		const { disabledCommandLists, ignoredLists } = guildConfigs;
		const avatar = message.client.user.avatarURL;
		const icb = '``';

		if (args.command) {
			const command = commands.get(args.command) || commands.get(aliases.get(args.command));
			if (!command) return message.reply(`${args.command} isn't a valid command.`);

			const embed = new RichEmbed()
				.setAuthor(`robbot Command Help - ${command.name}`, avatar)
				.setDescription(`**${command.name.capitalize()}** - ${command.description}`)
				.setColor('RANDOM')
				.addField('Aliases', command.aliases.join(', ') || 'None', true)
				.addField('Cooldown', `${command.cooldown} seconds`, true)
				.addField('Syntax', `${commandPrefix} ${command.name} ${command.args.map(arg => `<${arg.name}>`).join(' ')}`, true);

			if (command.ownersOnly) embed.addField('Owners Only', 'Yes', true);
			if (command.guildOnly) embed.addField('Guild Only', 'Yes', true);

			if (command.perms.client) {
				embed.addField('Bot Permissions Needed', this.listPermissions(command.perms.client), true);
			}

			if (command.perms.member) {
				embed.addField('User Permissions Needed', this.listPermissions(command.perms.member), true);
			}

			return message.channel.send({ embed });
		}
		const wikiLink = 'https://github.com/robflop/robbot/wiki/Usage';

		let help = '**__Available Commands:__**\n\n';
		help += `${this.listCommands(commands)}\n\n`;

		if (message.channel.type === 'text') {
			const disabledCommandList = disabledCommandLists.has(message.guild.id) ? disabledCommandLists.get(message.guild.id).join(', ') : 'None';
			const ignoredList = ignoredLists.has(message.guild.id) ? ignoredLists.get(message.guild.id).join(', ') : 'None';

			help += `Disabled commands on the ${icb}${message.guild.name}${icb} server: ${icb}${disabledCommandList}${icb}\n\n`;
			help += `Ignored users on the ${icb}${message.guild.name}${icb} server: ${icb}${ignoredList}${icb}\n\n`;
		}

		help += `Also refer to ${wikiLink} for extensive Command usage help that explains each argument for every command in detail.`;

		return message.author.send(help, { split: true })
			.then(msg => msg.channel.type === 'text' ? message.reply('i\'ve sent you a list with all of my commands!') : null)
			.catch(() => message.reply('i ran into an error DM\'ing you!'));
	}

	listCommands(commands) {
		let commandsString = '';
		for (const command of commands.values()) {
			commandsString += `**${command.name.capitalize()}** - ${command.description}\n`;
		}
		return commandsString.slice(0, -1);
	}

	listPermissions(perms) {
		let permissionsString = '';
		for (const perm of perms) {
			permissionsString += `\`${perm.toString().replace(/_/g, ' ').toLowerCase().toTitleCase()}\`\n`;
		}
		return permissionsString.slice(0, -1);
	}
}

module.exports = HelpCommand;
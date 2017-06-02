const Command = require('../structures/Command');

class CancelSoundCommand extends Command {
	constructor() {
		super({
			name: 'cancelsound',
			description: 'Kill this guild\'s voice connection if playSound/randomSound bugged out',
			guildOnly: true,
			aliases: ['cs'],
			perms: {
				member: ['KICK_MEMBERS', 'BAN_MEMBERS']
			}
		});
	}

	async run(message, args) {
		if (!message.guild.voiceConnection) {
			return message.reply('i\'m not on a voiceChannel of this guild!');
		}

		await message.guild.voiceConnection.disconnect();
		return message.reply('sound playback aborted!');
	}
}

module.exports = CancelSoundCommand;
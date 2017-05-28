const Command = require('../structures/Command');

class SetAvatarCommand extends Command {
	constructor() {
		super({
			name: 'setavatar',
			description: 'Change robbot\'s avatar',
			ownersOnly: true,
			aliases: ['sa', 'avatar'],
			args: [
				{
					type: 'string',
					name: 'imageURL'
				}
			]
		});
	}

	async run(message, args) {
		if (!args.imageURL.startsWith('http')) return message.reply('invalid URL!');
		const validExts = ['png', 'jpg', 'gif', 'jpeg', 'webp'];
		const ext = args.url.substr(args.url.lastIndexOf('.') + 1);
		if (!validExts.includes(ext)) return message.reply('invalid file format! Only PNGs, JP(E)Gs, WebPs and GIFs are accepted.');
		message.client.user.setAvatar(args.imageURL)
		.then(user => {
			message.reply(`successfully set my avatar to \`${args.imageURL}\`!`);
			message.client.logger.info(`Avatar set to '${args.imageURL}'`);
		})
		.catch(err => message.reply(`an error occurred setting my avatar: \`${err.code}\`!`));
	}
}

module.exports = SetAvatarCommand;
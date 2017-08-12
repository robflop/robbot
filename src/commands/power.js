const { exec } = require('child_process');
const Command = require('../structures/Command');

class PowerCommand extends Command {
	constructor() {
		super({
			name: 'power',
			description: 'Restart or shutdown robbot',
			aliases: ['pw'],
			ownersOnly: true,
			args: [
				{
					type: 'string',
					name: 'action'
				}
			]
		});
	}

	async run(message, args) {
		if (args.action === 'shutdown') {
			return message.channel.send('robbot now shutting down! Bye!').then(msg => {
				message.client.logger.info('robbot shutting down!');

				if (message.client.config.pm2) {
					setTimeout(() => exec('pm2 stop robbot'), 2000);
				}
				else {
					setTimeout(() => process.exit(0), 2000);
				}
			});
		}

		else if (args.action === 'restart') {
			if (!message.client.config.pm2) message.channel.send('Sorry, restarting only works when using pm2!');

			return message.channel.send('robbot now restarting! See you soon!').then(msg => {
				message.client.logger.info('robbot restarting!');
				process.exit(0);
			});
		}

		else return message.channel.send(`'${args.action}' is not a valid action.`);
	}
}

module.exports = PowerCommand;
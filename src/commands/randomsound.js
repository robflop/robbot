const Command = require('../structures/Command');
const { inspect } = require('util');
const { join } = require('path');

class RandomSoundCommand extends Command {
	constructor() {
		super({
			name: 'randomsound',
			description: 'Play random sound from <https://megumin.love>',
			guildOnly: true,
			aliases: ['rs'],
			perms: {
				client: ['CONNECT', 'SPEAK']
			}
		});
	}

	async run(message, args) {
		const ws = message.client.meguWebSocket;

		if (!message.member.voiceChannel) {
			return message.reply('join a voice channel first!');
		}

		if (!message.member.voiceChannel.joinable) return message.reply("i can't connect to that voice channel!");

		if (message.guild.voiceConnection) {
			return message.reply('please wait for the current sound to finish!');
		}

		if (ws.readyState !== 1) message.client.logger.error(`(${this.name}) Error connecting to megumin.love, readyState ${ws.readyState}`);
		else ws.send(JSON.stringify({ type: 'click' }));

		const sounds = require('../data/sounds');
		const sound = sounds[Math.floor(Math.random() * sounds.length)];
		const soundPath = join(__dirname, '..', 'data', 'sounds', sound);
		const voiceChannel = message.member.voiceChannel;

		voiceChannel.join().then(connection => {
			const player = connection.playFile(`${soundPath}.mp3`);
			connection.on('error', () => message.reply('an error related to the voiceChannel connection itself occurred, sorry! (Try again, maybe?)')
				.then(message => voiceChannel.leave()));

			player.on('end', () => voiceChannel.leave());
			player.on('error', () => message.reply('an error occurred playing the sound file, sorry! (Try again, maybe?)'));
		// Since 'error' emits an 'end' event, this will result in the voiceconnection being terminated
		}).catch(error => message.reply('an error occurred while connecting to the voiceChannel, sorry! (Try again, maybe?)')
			.then(message => voiceChannel.leave()));
	}
}

module.exports = RandomSoundCommand;
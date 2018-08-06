const Command = require('../structures/Command');
const axios = require('axios');
const { RichEmbed } = require('discord.js');
const { inspect } = require('util');

class CounterCommand extends Command {
	constructor() {
		super({
			name: 'counter',
			description: 'Display various information regarding the counter of <https://megumin.love>',
			aliases: ['c'],
			args: [
				{
					type: 'string',
					name: 'primarySelector',
					defaultVal: 'general'
				},
				{
					type: 'string',
					name: 'secondarySelector',
					defaultVal: 'general'
				}
			]
		});
	}

	async run(message, args) {
		const { logger, config } = message.client;
		const cb = '```', icb = '``';
		const formatNumber = num => num.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.');
		const newDate = new Date();
		const fl = input => input < 9 ? `0${input}` : `${input}`;
		const time = `${fl(newDate.getHours())}:${fl(newDate.getMinutes())}`;
		const date = `${fl(newDate.getDate())}/${fl(newDate.getMonth() + 1)}/${fl(newDate.getFullYear())}`;
		if (args.primarySelector === 'history') {
			const history = require('../data/counterHistory.json');

			if (args.secondarySelector === 'general') {
				const historyHeader = '**__Here is an overview of the counter\'s saved progress history__**:\n';
				const historyBody = `${cb}${history.join('\n')}${cb}`;
				return message.channel.send(`${historyHeader}${historyBody}`, { split: { prepend: cb, append: cb } });
			}

			if (args.secondarySelector === 'append' && config.owners.includes(message.author.id)) {
				return axios.get('https://megumin.love/api/counter').then(counter => {
					const newCounter = `${formatNumber(counter.data.counter)} ${time} ${date}`;
					history.push(newCounter);
					logger.writeJSON(history, './data/counterHistory.json')
						.then(data => message.reply(`new entry successfully added: ${icb}${newCounter}${icb}`))
						.catch(err => message.reply(`an error occurred writing to the file: ${cb}${err}${cb}`));
				}).catch(err => {
					const errorDetails = `${err.host ? err.host : ''} ${err.message ? err.message : ''}`.trim();
					message.reply(`an error occurred getting the counter: ${icb}${err.code}: ${errorDetails}${icb}`);
					logger.error(inspect(err));
				});
			}

			if (args.secondarySelector === 'revert' && config.owners.includes(message.author.id)) {
				history.pop();
				logger.writeJSON(history, './data/counterHistory.json')
					.then(data => message.reply('latest history entry successfully removed.'))
					.catch(err => {
						message.reply(`an error occurred writing to the file: ${cb}${err}${cb}`);
						logger.error(inspect(err));
					});
			}
		}

		if (args.primarySelector === 'statistics') {
			if (args.secondarySelector === 'general') {
				axios.get('https://megumin.love/api/counter?statistics').then(statistics => {
					const embed = new RichEmbed();

					embed.setAuthor('megumin.love Counter Statistics', 'https://megumin.love/images/favicons/favicon-32x32.png')
						.setURL('https://megumin.love/')
						.setColor((Math.random() * 10e4).toFixed(5))
						.addField('All-time', formatNumber(statistics.data.alltime), true)
						.addField('Today', formatNumber(statistics.data.daily), true)
						.addField('This week', formatNumber(statistics.data.weekly), true)
						.addField('This month', formatNumber(statistics.data.monthly), true)
						.addField('This year', formatNumber(statistics.data.yearly), true)
						.addField('Average/day', formatNumber(statistics.data.average), true);
					return message.channel.send({ embed });
				}).catch(err => {
					const errorDetails = `${err.host ? err.host : ''} ${err.message ? err.message : ''}`.trim();
					message.reply(`an error occurred getting the statistics: ${cb}${err.code}: ${errorDetails}${cb}`);
					logger.error(inspect(err));
				});
			}
		}

		if (args.primarySelector === 'rankings') {
			if (args.secondarySelector === 'general') {
				axios.get('https://megumin.love/api/sounds').then(sounds => {
					const parsedRanks = sounds.data.sort((a, b) => b.count - a.count).slice(0, 12);
					const embed = new RichEmbed();
					embed.setAuthor('megumin.love Soundboard Rankings', 'https://megumin.love/images/favicons/favicon-32x32.png')
						.setURL('https://megumin.love/')
						.setColor((Math.random() * 10e4).toFixed(5));

					for (const rank of parsedRanks) {
						embed.addField(`#${parsedRanks.indexOf(rank) + 1}: ${rank.displayname}`, `${formatNumber(rank.count)} clicks`, true);
					}

					return message.channel.send({ embed });
				}).catch(err => {
					const errorDetails = `${err.host ? err.host : ''} ${err.message ? err.message : ''}`.trim();
					message.reply(`an error occurred getting the rankings: ${cb}${err.code}: ${errorDetails}${cb}`);
					logger.error(inspect(err));
				});
			}
		}

		if (args.primarySelector === 'general') {
			axios.get('https://megumin.love/api/counter').then(counter => {
				const formattedCounter = `**${formatNumber(counter.data)}**`.trim();
				return message.channel.send(`Current https://megumin.love count is: ${formattedCounter}`);
			}).catch(err => {
				const errorDetails = `${err.host ? err.host : ''} ${err.message ? err.message : ''}`.trim();
				message.reply(`an error occurred getting the counter: ${icb}${err.code}: ${errorDetails}${icb}`);
				logger.error(inspect(err));
			});
		}
	}
}

module.exports = CounterCommand;
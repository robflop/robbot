const Command = require('../structures/Command');
const snekfetch = require('snekfetch');
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
				return snekfetch.get('https://megumin.love/counter').then(counter => {
					const newCounter = `${formatNumber(counter.text)} ${time} ${date}`;
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
				snekfetch.get('https://megumin.love/counter?statistics').then(statistics => {
					const parsedStats = JSON.parse(statistics.text);
					const embed = new RichEmbed();
					embed.setAuthor('megumin.love Counter Statistics', 'https://megumin.love/images/favicon.ico')
						.setURL('https://megumin.love/')
						.setColor((Math.random() * 10e4).toFixed(5))
						.addField('All-time', formatNumber(parsedStats.alltime), true)
						.addField('Today', formatNumber(parsedStats.daily), true)
						.addField('This week', formatNumber(parsedStats.weekly), true)
						.addField('This month', formatNumber(parsedStats.monthly), true)
						.addBlankField(true)
						.addField('Average/day', formatNumber(parsedStats.average), true);
					return message.channel.send({ embed });
				}).catch(err => {
					const errorDetails = `${err.host ? err.host : ''} ${err.message ? err.message : ''}`.trim();
					message.reply(`an error occurred getting the statistics: ${cb}${err.code}: ${errorDetails}${cb}`);
					logger.error(inspect(err));
				});
			}

			if (args.secondarySelector === 'rankings') {
				snekfetch.get('https://megumin.love/counter?rankings').then(rankings => {
					const parsedRanks = JSON.parse(rankings.text).slice(0, 10);
					const embed = new RichEmbed();
					embed.setAuthor('megumin.love Soundboard Rankings', 'https://megumin.love/images/favicon.ico')
						.setURL('https://megumin.love/')
						.setColor((Math.random() * 10e4).toFixed(5));

					for (const rank of parsedRanks) {
						if (parsedRanks.indexOf(rank) + 1 === 10) embed.addBlankField(true); // centering of 10th rank
						embed.addField(`#${parsedRanks.indexOf(rank) + 1}: ${rank.displayName}`, `${rank.count} clicks`, true);
						if (parsedRanks.indexOf(rank) + 1 === 10) embed.addBlankField(true); // centering of 10th rank
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
			snekfetch.get('https://megumin.love/counter').then(counter => {
				const celebrations = counter.text % 100000 === 0 ? '🎉' : counter.text % 10000000 === 0 ? '🎊🎉' : '';
				const formattedCounter = `${celebrations} **${formatNumber(counter.text)}** ${celebrations}`.trim();
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
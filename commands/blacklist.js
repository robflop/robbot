const config = require('../config.json');
const fs = require('fs');
const moment = require('moment');
const blacklist = require('../serverconf/blacklist.json');

exports.main = function(client, msg, cooldown, botPerm, userPerm, chalk) {
	var command = "blacklist";
	if(cooldown.onCooldown(msg.author.id, msg)) return;
	if(msg.author.id !== config.ownerID) return msg.reply("you are not authorized to use this command!").then(msg => msg.delete(2000));
	var guildID = msg.content.substring(config.commandPrefix.length + command.length + 2);
	var toFind;
	var index = blacklist.indexOf(guildID);
	var timestamp = moment().format('DD/MM/YYYY HH:mm:ss');
	if(guildID.startsWith("find")) {
		guildID = "find";
		// redefine to properly use below
		toFind = msg.content.substring(msg.content.indexOf(guildID)+guildID.length+1);
		index = blacklist.indexOf(toFind);
		if(index == -1) return msg.reply(`Guild ID '${toFind}' was not found on the blacklist!`);
		else return msg.reply(`Guild ID '${toFind}' was found at position ${index} of the blacklist!`);
	};
	if(index == -1) {
		blacklist.push(guildID);
		fs.writeFileSync(`serverconf/blacklist.json`, JSON.stringify(blacklist));
		fs.appendFileSync(`${config.logPath}${config.serverLog}`, `\n[${timestamp}][BLACKLIST] ${msg.author.username}#${msg.author.discriminator} successfully added a server to the blacklist.`);
		msg.reply(`ID '${guildID}' is now blacklisted!`);
	}
	else {
		blacklist.splice(index, 1);
		fs.writeFileSync(`serverconf/blacklist.json`, JSON.stringify(blacklist));
		fs.appendFileSync(`${config.logPath}${config.serverLog}`, `\n[${timestamp}][BLACKLIST] ${msg.author.username}#${msg.author.discriminator} successfully removed a server from the blacklist.`);
		msg.reply(`ID '${guildID}' is no longer blacklisted!`);
	};
};

exports.desc = "Blacklist a server, making the bot automatically leave it upon joining [Bot owner only]";
exports.syntax = "<guildID to blacklist or 'find' argument> <guildID to search for if using 'find' arg>";
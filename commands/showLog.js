const config = require('../config.json'); // Import configuration
const fs = require('fs'); // For log writing
const moment = require('moment'); // Part of log writing

exports.main = function(bot, msg, cooldown, botPerm, userPerm, chalk) { // Export command function
	var command = "showLog"; // For logging purposes
	var timestamp = moment().format('DD/MM/YYYY HH:mm:ss');
	// Define timestamp
	var possibleLogs = [ // Whitelist of logs allowed to display
		config.shutdownLog,
		config.requestLog,
		config.serverLog,
		config.profileLog,
		config.ignoreLog
	];
	if (cooldown.onCooldown(msg.author.id, msg)) return;
	// Check for cooldown, if on cooldown notify user of it and abort command execution
	if(msg.author.id !== config.ownerID) {
	// If the user is not authorized...
		return msg.reply("you are not authorized to use this command!").then(msg => msg.delete(2000));
		// ...notify the user and abort command execution.
	};
	var arg = msg.content.substr(config.commandPrefix.length + command.length + 2);
	// Cut out the argument of the command
	var file = "";
	// Placeholder for file to read
	if (possibleLogs.indexOf(arg) > -1) {
	// If argument is a valid filename,...
		file = possibleLogs[possibleLogs.indexOf(arg)];
		// ...then set file to the given filename.
	}
	else {
	// If argument is an invalid filename...
		return msg.author.sendMessage(`Not a configured log file. Valid logs are: ${possibleLogs.join(", ")}`);
		// ...notify the user and abort command execution.
	}
	fs.readFile(`${config.logPath + file}`, "utf-8", (error, data) => {
	// Read the given argument file from the default log path
		if(error) {
		// If an error occurs...
			msg.author.sendMessage(`An error has occured: \`\`\`${error}\`\`\``);
			// ...notify the user of the error...
			return fs.appendFileSync(`${config.logPath}${config.serverLog}`, `\n[${timestamp}][SHOWLOG] ${msg.author.username}#${msg.author.discriminator} tried using the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command  on the '${msg.guild}' server, but an error occurred!`);
			// ...log the command use plus the error and abort command execution.
		};
		// If there is no error...
		msg.author.sendMessage(`\`\`\`${data}\`\`\``, {split: {prepend: "\`\`\`", append: "\`\`\`"}});
		// ...output the chosen log to the user...
		console.log(`[${timestamp}]${chalk.cyan("[SHOWLOG]")} ${msg.author.username}#${msg.author.discriminator} on the '${msg.guild}' server displayed a log file!`);
		fs.appendFileSync(`${config.logPath}${config.serverLog}`, `\n[${timestamp}][SHOWLOG] ${msg.author.username}#${msg.author.discriminator} successfully used the "${msg.content.substr(config.commandPrefix.length + 1, command.length)}" command  on the '${msg.guild}' server!`); // ...and log command use, when and by whom.
	});
};
exports.desc = "easily display one of the configured log files [Bot owner only]"; // Export command description
exports.syntax = "<logFile to display>" // Export command syntax
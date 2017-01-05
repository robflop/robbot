const config = require('../config.json'); // Import configuration
const request = require('request'); // For website interaction
const fs = require('fs'); // For log writing
const moment = require('moment'); // Part of log writing
const prism = require('prism-media'); // Prism for smoother file playing of very short files

exports.main = function(bot, msg, timeout, permission) { // Export command function
	var command = "randomsound"; // For logging purposes
	if(timeout.check(msg.author.id, msg)) { return; }; 
	// Check for cooldown, if on cooldown notify user of it and abort command execution.
	if(!msg.member.voiceChannel) { 
		// If the user that used the command is not in a voice channel on the server the command came from...
		if(!permission.hasPermission('SEND_MESSAGES')) {  
			// ... 1) and the bot can't send to the channel...
			msg.author.sendMessage("Join a voice channel first!"); 
			// ...PM the author of the msg...
			return; // ...and abort command execution.
		}  
		// ... 2) and the bot can send to the channel...
		msg.reply("join a voice channel first!"); 
		// ...notify the user to join a channel...
		return; // ...and abort command execution.
	}
	if(!msg.member.voiceChannel.joinable) { 
		// If the bot can't connect to the voicechannel... 
		msg.author.sendMessage("I can't connect to that voice channel!"); 
		// ...PM the author of the msg...
		return; // ...and abort command execution.
	}
	if(msg.guild.voiceConnection !== null) { 
		// If the bot is already in a voice channel of the server the command came from...
		if(!permission.hasPermission('SEND_MESSAGES')) {  
			// ... 1) and the bot can't send to the channel...
			msg.author.sendMessage('please wait for the current sound to finish!'); 
			// ...PM the user...
			return; // ...and abort command execution.
		}
		// ... 2) and the bot can send to the channel...
		msg.reply('please wait for the current sound to finish!'); 
		// ...notify the user...
		return; // ...and abort command execution.
	}
	// If a voice connection does not exist on the server the command is being used,...
	request.get('https://megumin.love/includes/cache_counter.php?count=1', function (error, response, body) { 
		// ...then increment the counter on megumin.love...
		if(error || response.statusCode !== 200) { 
			// ...and if there is an error or unusual response code...
			console.log(`An unusual response code was emitted when GETting the counter increment script: ${response.statusCode}`);
			fs.appendFileSync(`${config.logPath}${config.requestLog}`, `\n[${moment().format('DD/MM/YYYY HH:mm:ss')}][REQUEST-ERROR] (${command}) ${response.statusCode} | ${body}`); 
			// ...log the unusual request responses/errors...
			return; // ...and abort command execution.
		};
		// If there is no error, proceed with the command.
	}); 
	msg.member.voiceChannel.join().then(connection => { 
		// Check if message author is in a voice channel, if true join it,...
		var sounds = ["eugh1.mp3", "eugh2.mp3", "eugh3.mp3", "eugh4.mp3", "explosion.mp3", "itai.mp3", "n.mp3", "name.mp3", "plosion.mp3", "pull.mp3", "sion.mp3", "yamero.mp3"]; 
		// then set available files,...
		var sound = sounds[Math.floor(Math.random()*sounds.length)]; 
		// ...randomize which sound gets played...
		const player = connection.playFile(config.soundPath + sound); 
		// ...and play the file.
		player.on('end', () => {
			msg.member.voiceChannel.leave(); 
			// Leave voice channel once file finishes playing
		});
	});
};
exports.desc = "have the bot join your voice channel and play a random sound from the website"; // Export command description
exports.main = function(client, msg, msgArray, checks, chalk) {
	const command = "about";
	if(!checks.botPerm.has('SEND_MESSAGES')) return msg.author.send("I can't send messages to that channel!");
	msg.channel.send(`robbot made by robflop#0200. Made to complement the website <https://megumin.love> also by robflop#0200.\nCheck out the Github repo at <https://github.com/robflop/robbot>.\nInvite link for the bot: <https://robflop.me/robbot>.`);
};

exports.desc = "get general info about the bot";
exports.syntax = "";
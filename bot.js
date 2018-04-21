(function(){
	const config = require("./config.js");
	const Discord = require("discord.js");
	const locale = config.getLocale();

	var bot;

	module.exports.prepareBot = function(callback, Roles) {
		bot = new Discord.Client();

		bot.on("message", function(msg) {
			if((msg.content === "!updateLol")) {
				if(msg.member.hasPermission("MANAGE_ROLES")){
					Roles.requestUpdateRoles(msg.guild);
					msg.reply(locale["rolesUpdated"]);
				} else {
					msg.reply(locale["notAllowedToUpdate"]);
				}
			}
		});

		bot.on("guildMemberAdd", function(member){
			Roles.requestUpdateMember(member);
		})

		bot.on("guildMemberRemove", function(member){
			Roles.removeMemberFromQueueList(member);
		})

		bot.on("guildCreate", function(guild){
			Roles.requestUpdateRoles(guild);
		});

		bot.on("guildDelete", function(guild){
			Roles.removeGuildFromQueueList(guild);
		});

		bot.on("ready", function(){
			bot.user.setUsername(locale["botName"]);
			bot.user.setGame(locale["botGame"]);
			console.log(locale["botConnected"]);

			callback();
		});
	}

	module.exports.login = function(callback, Roles) {
		this.prepareBot(callback, Roles);

		bot.login(config.getDiscordBotKey());
	}

	module.exports.getAllGuilds = function() {
		return bot.guilds.array();
	}

	module.exports.getBot = function() {
		return bot;
	}
})();

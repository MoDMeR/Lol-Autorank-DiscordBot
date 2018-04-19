(function(){
	const ApiKey = require("./api_key.js");
	const Discord = require("discord.js");

	var bot;

	module.exports.prepareBot = function(callback, Roles) {
		bot = new Discord.Client();

		bot.on("message", function(msg) {
			if((msg.content === "!updateLol")) {
				if(msg.member.hasPermission("MANAGE_ROLES")){
					Roles.requestUpdateRoles(msg.guild);
					msg.reply("Grades mis à jour!");
				} else {
					msg.reply("Tu n'a pas l'autorisation de faire cette commande!");
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
			bot.user.setUsername("Lol Autograde");
			bot.user.setGame("rien car je suis un bot");
			console.log("Le bot s'est bien connecté!");

			callback();
		});
	}

	module.exports.login = function(callback, Roles) {
		this.prepareBot(callback, Roles);

		bot.login(ApiKey.getDiscordBotKey());
	}

	module.exports.getAllGuilds = function() {
		return bot.guilds.array();
	}

	module.exports.getBot = function() {
		return bot;
	}
})();

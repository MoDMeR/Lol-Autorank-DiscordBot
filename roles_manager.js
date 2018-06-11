(function() {
	const LolApi = require("./lol_api.js");
	const config = require("./config.js");
	const locale = config.getLocale();

	const roles = [{name: locale["not-playing"], color: "#030000"},
					{name: locale["newbie"], color: "NAVY"},
					{name: locale["unranked"], color: "#b99d7d"},
					{name: locale["bronze"], color: "#be6300"},
					{name: locale["silver"], color: "#928d8d"},
					{name: locale["gold"], color: "#f1df0a"},
					{name: locale["platinum"], color: "#2dc387"},
					{name: locale["diamond"], color: "#00adff"},
					{name: locale["challenger"], color: "#ffa80c"}];

	var queueList = new Map();

	var DiscordBot;
	var isUpdatingRoles = false;

	module.exports.checkRoles = function(guild) {
		createdRole = false;

		roles.forEach(function(item, index, array){
			role = guild.roles.find("name", item.name);
			if(role === null){
				guild.createRole({
					name: item.name,
					color: item.color,
					position: index+1,
					hoist: true,
					mentionable: true,
				})

				createdRole = true;
			}
		});

		if(guild.members.find("user", this.DiscordBot.getBot().user).hasPermission("MANAGE_ROLES")){
			console.log(guild.name+" : " + locale["botPermissionOk"]);
		} else {
			console.log(guild.name+" : " + locale["botPermissionProblem"]);
		}

		if(createdRole){
		    var channelToBroadcast = guild.channels.find("name", "general");
		    if(channelToBroadcast == undefined)
		        channelToBroadcast = guild.channels.find("type", "text");

		    channelToBroadcast.send(locale["rolesCreated"]);
		}
	}

	module.exports.setDiscordBot = function(newDiscordBot){
		this.DiscordBot = newDiscordBot;
	}

	module.exports.updateEveryGuildsRoles = function(DiscordBot){
		thisModule = this;

		DiscordBot.getAllGuilds().forEach(function(item, index, array){
			thisModule.requestUpdateRoles(item);
		});
	}

	module.exports.requestUpdateRoles = function(guild) {
		if(guild === undefined){
			this.updateEveryGuildsRoles();
			return;
		}

		this.checkRoles(guild);

		this.addGuildMembersToQueueList(guild);
	}

	module.exports.addGuildMembersToQueueList = function(guild) {
		thisModule = this;

		guild.members.array().forEach(function(item, index, array){
			thisModule.requestUpdateMember(item);
		});
	}

	module.exports.requestUpdateMember = function(member) {
		if(!member.user.bot){
			if(queueList.has(member.displayName)){
				queueList.get(member.displayName).push(member);
			} else {
				queueList.set(member.displayName, [member]);
			}
		}
	}

	module.exports.removeMemberFromQueueList = function(member) {
		if(!queueList.has(member.displayName))
			queueList.get(member.displayName).splice(queueList.get(member.displayName).indexOf(member), 1);
	}

	module.exports.removeGuildFromQueueList = function(guild) {
		thisModule = this;

		guild.members.array().forEach(function(item, index, array){
			thisModule.removeMemberFromQueueList(item);
		});
	}

	module.exports.processQueue = function() {
		if(isUpdatingRoles || queueList.size <= 0)
			return;

		console.log(locale["rolesUpdateStarted"]);
		isUpdatingRoles = true;
		this.processNextMember();
	}

	module.exports.processNextMember = function(){
		if(queueList.size <= 0){
			this.rolesUpdated();
			return;
		}

		var summonerName = queueList.keys().next().value;
		console.log(locale["memberRankProcessing"], summonerName);
		LolApi.getSummonerDetails(summonerName, this.summonerDetailsReceive, this);
	}

	module.exports.rolesUpdated = function(){
		isUpdatingRoles = false;
		console.log(locale["rolesUpdateFinished"]);
	}

	module.exports.summonerDetailsReceive = function(thisModule, summonerDetails) {
		if(summonerDetails === undefined){
			thisModule.processRole();
			return;
		}

		if(summonerDetails === "dtouch"){
			thisModule.processRole(-1);
			return;
		}

		var summonerLevel = summonerDetails.summonerLevel;

		if(summonerLevel < 30){
			thisModule.processRole(1);
		} else {
			var summonerId = summonerDetails.id;
			LolApi.getRankDetails(summonerId, thisModule.summonerRankReceive, thisModule);
		}
	}

	module.exports.summonerRankReceive = function(thisModule, summonerRank) {
		if(summonerRank === undefined){
			thisModule.processRole();
			return;
		}

		if(summonerRank === "dtouch"){
			thisModule.processRole(-1);
			return;
		}

		var gradeNumber = 2;

		summonerRank.forEach(function(item, position, array){
			if(item.queueType === "RANKED_SOLO_5x5"){
				if(item.tier === "BRONZE"){
					gradeNumber = 3;
				} else if(item.tier === "SILVER"){
					gradeNumber = 4;
				} else if(item.tier === "GOLD"){
					gradeNumber = 5;
				} else if(item.tier === "PLATINUM"){
					gradeNumber = 6;
				} else if(item.tier === "DIAMOND"){
					gradeNumber = 7;
				} else if(item.tier === "CHALLENGER"){
					gradeNumer = 8;
				}
			}
		});

		thisModule.processRole(gradeNumber);
	}

	module.exports.processRole = function(roleNumber){
		if(roleNumber === undefined){
			roleNumber = 0;
		}

		if(roleNumber !== -1){
			thisModule = this;
			var members = queueList.get(queueList.keys().next().value);
			members.forEach(function(item, position, array){
				discordRoles = thisModule.getDiscordRoles(item.guild)
				for(var i = 0 ; i < discordRoles.length ; i++){
					if(item.roles.find("name", discordRoles[i].name) !== null){
						if(discordRoles[i] !== discordRoles[roleNumber])
							item.removeRole(discordRoles[i]);
					}
				}
				try {
				if(item.roles.find("name", discordRoles[roleNumber].name) === null)
					item.addRole(discordRoles[roleNumber]);
				}catch(e){}
			});
		}

		queueList.delete(queueList.keys().next().value);
		this.processNextMember();
	}

	module.exports.getDiscordRoles = function(guild){
		var guildLolRoles = [];

		roles.forEach(function(item, position, array){
			for(var i = 0 ; i < guild.roles.array().length ; i++){
				if(item.name === guild.roles.array()[i].name)
					guildLolRoles.push(guild.roles.array()[i]);
			}
		});

		return guildLolRoles;
	}
})();

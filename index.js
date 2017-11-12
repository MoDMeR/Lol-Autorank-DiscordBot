const Roles = require("./roles_manager.js");
const DiscordBot = require("./bot.js");

function onBotReady(){
	Roles.setDiscordBot(DiscordBot);
	updateRoles();
	setInterval(updateRoles, 1000*60*60);
	setInterval(processQueue, 500);
}

function updateRoles(){
	Roles.updateEveryGuildsRoles(DiscordBot);
}

function processQueue(){
	Roles.processQueue();
}

DiscordBot.login(onBotReady, Roles);

//https://discordapp.com/oauth2/authorize?client_id=344166702944092162&scope=bot&permissions=268437512

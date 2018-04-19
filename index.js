const Roles = require("./roles_manager.js");
const DiscordBot = require("./bot.js");
const fs = require("fs");

function log(msg) {
	var date = new Date();
	var dateStr = date;
	fs.appendFile("log", dateStr+ " "+msg+"\n", function() {
		consoleOutput(dateStr +" "+ msg);
	});
}

consoleOutput = console.log;
console.log = function() {
	msg = "";
	for(var i = 0 ; i < arguments.length ; i++) {
		msg += arguments[i] + " ";
	}
	log(msg)
}

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

//Link to add discord bot -> https://discordapp.com/oauth2/authorize?client_id=344166702944092162&scope=bot&permissions=268437512

(function(){
	var yaml = require("js-yaml");
	var fs = require("fs");
	lolApiKey = "";
	discordBotKey = "";

	module.exports.getLolApiKey = function() {
		return lolApiKey;
	}

	module.exports.getDiscordBotKey = function() {
		return discordBotKey;
	}

	try {
	  var config = yaml.safeLoad(fs.readFileSync('keys.yml', 'utf8'));
	  lolApiKey = config["lolApiKey"];
	  discordBotKey = config["discordBotKey"];
	} catch (e) {
	  console.log(e);
	}
})();

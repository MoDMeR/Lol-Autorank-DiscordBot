(function() {
    var yaml = require("js-yaml");
    var fs = require("fs");

	try {
        var config = yaml.safeLoad(fs.readFileSync('config.yml', 'utf8'));
	} catch (e) {
        console.log(e);
	}

    module.exports.getDiscordBotKey = function() {
        return config["discordBotKey"];
    }

    module.exports.getLolApiKey = function() {
        return config["lolApiKey"];
    }
})();

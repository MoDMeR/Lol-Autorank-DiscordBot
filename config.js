(function() {
    var yaml = require("js-yaml");
    var fs = require("fs");
    var config = [];
    var configLoaded = false;

    function getDiscordBotKey() {
        return config["discordBotKey"];
    }

    function getLolApiKey() {
        return config["lolApiKey"];
    }

    function getLocale() {
        if(config["locale"] == undefined){
            loadLocale("fr");
            loadLocale(config["language"]);
        }

        return config["locale"];
    }

    function getConfig() {
        return config;
    }

    function loadLocale(language) {
        var locale = loadFile("locale/"+language+".yml");
        if(config["locale"] == undefined) {
            config["locale"] = [];
        }

        for(var key in locale){
            config["locale"][key] = locale[key];
        }
    }

    function loadFile(path) {
        var output = {};
    	try {
            output = yaml.safeLoad(fs.readFileSync(path, "utf8"));
        } catch (e) {
            console.log(e);
    	}

        return output;
    }

    function loadConfig() {
        config = loadFile("config.yml");
    }

    if(!configLoaded) {
        configLoaded = true;
        loadConfig();
    }

    module.exports.getDiscordBotKey = getDiscordBotKey;
    module.exports.getLolApiKey = getLolApiKey;
    module.exports.getLocale = getLocale;
    module.exports.loadFile = loadFile;
    module.exports.loadConfig = loadConfig;
})();

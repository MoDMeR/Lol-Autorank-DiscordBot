(function(){
	const http = require("https");
	const ApiKey = require("./api_key.js");

	var callbackFunction;
	var lastHttpRequest = "";
	var thisModule;

	module.exports.retry = function(){
		http.get(lastHttpRequest, callbackFunction);
	}

	module.exports.getSummonerDetails = function(summonerName, summonerDetailsReceive, parentModule) {
		if(summonerDetailsReceive !== undefined)
			callbackFunction = summonerDetailsReceive;

		thisModule = parentModule;
		lastHttpRequest = encodeURI("https://euw1.api.riotgames.com/lol/summoner/v3/summoners/by-name/"+summonerName+"?api_key="+ApiKey.getLolApiKey());
		lastHttpRequest = lastHttpRequest.replace("%2520", "%20");
		http.get(lastHttpRequest, this.httpCallback);
	}

	module.exports.getRankDetails = function(summonerId, summonerRankReceive, parentModule) {
		if(summonerRankReceive !== undefined)
			callbackFunction = summonerRankReceive;

		thisModule = parentModule;
		lastHttpRequest = encodeURI("https://euw1.api.riotgames.com/lol/league/v3/positions/by-summoner/"+summonerId+"?api_key="+ApiKey.getLolApiKey());
		lastHttpRequest = lastHttpRequest.replace("%2520", "%20");
		http.get(lastHttpRequest, this.httpCallback);
	}

	module.exports.httpCallback = function(reponse) {
		statusCode = reponse.statusCode;

		console.log(statusCode, lastHttpRequest)

		if(statusCode === 200) {
			//everything's ok
			rawData = "";
			reponse.setEncoding('utf8');
			reponse.on('data', function(chunk){rawData += chunk});
			reponse.on('end',  function() {
				try {
					parsedData = JSON.parse(rawData);
				} catch (e) {
					console.log(e.message);
				}
				callbackFunction(thisModule, parsedData);
			});
		}

		else if(statusCode === 403 || statusCode == 401){
			//api key pb
			console.log("[ERREUR] Api key problem. (Expired?)");
			callbackFunction(thisModule, "dtouch");
		}

		else if(statusCode === 404){
			//existe pas
			callbackFunction(thisModule);
		}

		else if(statusCode === 429) {
			//api key limit rate
			setTimeout(this.retry(), 500);
		}

		else if(statusCode === 503 || statusCode === 504){
			//server down
			setTimeout(this.retry(), 500);
		} else {
			callbackFunction(thisModule, "dtouch");
		}
	}
})();

# Lol-Autorank-DiscordBot
This project is a Discord bot to update roles based on your rank in LoL. The bot will update every 30 minutes every member's roles. You can use the official bot using this [link](https://discordapp.com/oauth2/authorize?client_id=344166702944092162&scope=bot&permissions=268437512). 

**IMPORTANT** The bot can't guess member's IGN. There are 2 options:
* The member's name is the same on Discord and LoL. You have nothing to do. Congratulation!!
* The member's name isn't the same on Discord and LoL. You have to change his nickname and write his LoL IGN.

## Installing
If you want to host your personnal bot to change the language or customize role's name, then follow these steps.

### Prerequisites
First you will need to install [NodeJs](https://nodejs.org/). Now to install the bot you need to clone the repository using git. Then install every dependency. To do so, run these commands:
```
git clone https://github.com/justine-martin/Lol-Autorank-DiscordBot.git
cd Lol-Autorank-DiscordBot
npm install
```
Now the bot is install. But to make it run you will need 2 keys. One to start your Discord Bot and another one to use the API from LoL.

### Discord Bot's Key
First let's get the one for the Discord bot. You will need to access your [application dashboard](https://discordapp.com/developers/applications/me). Create a new application. Then scroll down to the "Bot" section and click on "Create it". Then copy the token generated in this section to the config.yml. If you reset the token then you'll have to change the token in the config.yml too. 

Now let's invite our bot on our Discord Server! On the top of the page copy the "Client ID". Now go to this [page](https://discordapi.com/permissions.html#8), paste the ID and click on the link generated.

### LoL API
To get an api key from Riot you need to go on this [website](https://developer.riotgames.com/). Once you connected with your LoL account you have to register an application. If Riot approves it you'll get an API key. Copy it and paste it into the config.yml.

## And now?
Now your bot is set up. To run it you can use this command:
```
node index.js
```
You can edit the config.yml to custom your bot or edit the files in the [locale/](locale/) to change the bot sentences.

## Author

* **Justine Martin** (https://github.com/justine-martin)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

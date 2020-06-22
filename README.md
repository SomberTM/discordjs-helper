# About
discordjs-helper is meant to be a package that assits programmers in creating their very own discord.js bot |
discordjs-helper includes many helpful functions and classes such as
* **[playYoutube](https://www.npmjs.com/package/@sombertm/discordjs-helper#playyoutubevoicechannel-youtube_url-cb)** -> Plays youtube music
* **[pageReaction](https://www.npmjs.com/package/@sombertm/discordjs-helper#pagereactionmessageembedtoreactto-items-itemsperpage-startingpage)** -> Up and down arrow reactions on embeds
* **[roleReaction](https://www.npmjs.com/package/@sombertm/discordjs-helper#rolereactionmessagetoreactto-emoji-role)** -> Give roles when users react
* **[muteUser / unmuteUser](https://www.npmjs.com/package/@sombertm/discordjs-helper?activeTab=readme#muteuserto_mute-time_seconds-fn-mute_role)** -> Mute and unmute users easily
* **[commandRegistry](https://www.npmjs.com/package/@sombertm/discordjs-helper?activeTab=readme#commandregistryaboslutecommandsfolderpath-registrytype)** Reads command files from provided directory
* etc...
# Installation
```
npm i @sombertm/discordjs-helper
```
# Working On
Currently Working on the Logger class
* Logging to a given channel
* Logging to the console
* Colors for different logs
* Ability to blacklist certain events
* Will eventually cover 100% of the client events
* Will also eventually have the ability to listen to events on its own (currently just functions that take event callbacks)
# Examples
###### This is the base code we will be using throughout the following examples. To see how to use certain functions skip ahead
```javascript
const { Client } = require('discordjs'); //npm i discord.js
const helper = require('@sombertm/discordjs-helper');

//Create a new client
const client = new Client();

//The prefix the bot will use. Replace "!" with your prefix
const prefix = "!";

//Log to the console when the bot is ready / online
client.on('ready', () => {
    console.log(`${client.user.tag} has come online!`);
});

client.on('message', message => {
    //Dont continue if the message was sent by a bot
    if (message.author.bot) return;

    //Dont continue on if the message isnt a command / starts with our prefix
    if (!message.content.startsWith(prefix)) return;

    //Gets the arguments from a message
    //ex. message.content = "!say hello world"
    //args[0] = "hello", args[1] = "world"
    let args = helper.getArgs(message, prefix); 

    //Gets the command from the args
    //ex. message.content = "!say hello world"
    //cmd == "say"
    let cmd = helper.getCommand(args);

    switch (cmd) {

        //Where our commands will go

    }
});

//Login to the bot, replace <token> with your token
//Create a bot at https://discord.com/developers/applications
client.login(<token>);
```
## playYoutube(voiceChannel, youtube_url, cb)
Plays youtube videos as their audio | [source](https://github.com/SomberTM/discordjs-helper/blob/master/src/playYoutube.ts)
```javascript
//cmd from template code above
switch(cmd) {

    case "play":
        //If we arent given a url, notify the user and return
        if (!args[0]) {
            
            message.channel.send(`Please provide a valid youtube url!`);
            return;
        }

        //If the user isnt in a voice channel, notify them and return
        if (!message.member.voice.channel) {
            message.channel.send(`Please join a voice channel first!`);
            return;
        }

        //Get the url from the message;
        let youtube_url = args[0];

        //Get the voice channel of the user sending the message
        let channel = message.member.voice.channel;

        //Play the video given
        helper.playYoutube(channel, youtube_url, info => {
            //The function called when the video is over, contains the video info as the callback
            message.channel.send(`Finished playing ${info.title} by ${info.author.name}`);
        });
        break;

    /**
    * If the playYoutube function is giving you an error its most likely because you are missing dependencies. Try installing the following packages and see if it will work
    * 
    * npm i @discordjs/opus
    * npm i ffmpeg-static
    * 
    * Links to packages are also under the Dev Dependencies tab of this packages Dependency page
    */
}
```
## pageReaction(messageEmbedToReactTo, items, itemsPerPage, startingPage?)
Reacts to a message embed with the an up and down arrow to allow multiple pages | [source](https://github.com/SomberTM/discordjs-helper/blob/master/src/pageReaction.ts)
```javascript
// CHANGES TO TEMPLATE (outside any functions)

//Add MessageEmbed import
const { Client, MessageEmbed } = require('discord.js');

//Add to the ready listener
client.on('ready', () => {
    console.log(`${client.user.tag} has come online!`);
    helper.pageReaction.init(client);
});

// NEW COMMAND (Inside message listener)

switch (cmd) {

    //test command, !pr-test
    case 'pr-test':
        //Send a new message embed back to the user and receive it in the code
        let msg = await message.channel.send(new MessageEmbed().setTitle(`Test`));

        //Some sample data to work with
        //When using this your data should be formatted in an array how you would like it before passing it into the constructor
        let sample_data = ["1: Hello", "2: World", "3: Hello", "4: World", "5: Hello", "6: World"];

        /**
         * @param { Discord.Message } message the message to react to 
         * @param { any[] } items an array of anything to be the contents of the embed / pages
         * @param { number } itemsPerPage the number of items from the array that should be displayed on one page
         * @param { number } startingPage [optional] the page to start on (number of pages = items.length / itemsPerPage)
         */
        new helper.pageReaction(msg, sample_data, 3);

        /**  Expected output
         * Test
         * 1: Hello
         * 2: World
         * 3: Hello
         */ 

        /** Down one page
         * Test
         * 4: World
         * 5: Hello
         * 6: World
         */

        break;
}
```
## roleReaction(messageToReactTo, emoji, role)
Reacts to a given message with the given emoji and when that emoji is reacted to, the user that reacted will be given the provided role | [source](https://github.com/SomberTM/discordjs-helper/blob/master/src/roleReaction.ts)
```javascript
// CHANGES TO TEMPLATE (outside any functions)

//Add to the ready listener
client.on('ready', () => {
    console.log(`${client.user.tag} has come online!`);
    helper.roleReaction.init(client);
});

//NEW COMMAND (Inside message listener)

switch (cmd) {

    //test command, !rr-test <message-id> <emoji> <@role>
    case 'rr-test':
        //if we arent given a message (args[0]) or an emoji (args[1]) or a role mention (message.mentions.members.first()), we will return
        if (!args[0] || !args[1] || !message.mentions.roles.first()) { message.channel.send(`Invalid arguments`); return; }

        //Find the message from the message id that the user provided us
        let messageToReactTo = await helper.findMessage(message.channel, args[0]); //args[0] should the id of a message i.e. 722169140445577276

        //Get the emoji for the reaction
        let emoji = args[1];

        //Get the first role mentioned in the message
        let role = message.mentions.roles.first();

        //Instantiate a new role reaction object
        new helper.roleReaction(messageToReactTo, emoji, role);
}
```
## muteUser(to_mute, time_seconds, fn?, mute_role?)
Mutes the given user for the allotted amount of seconds. Will create a 'muted' role if none is provided or found in the server | [source](https://github.com/SomberTM/discordjs-helper/blob/master/src/muteUser.ts)
```javascript
switch (cmd) {

    //Mute command, !mute <@user> <time>
    case 'mute':

        //If we arent given args[0], args[1], or a member mention notify the user
        if (!args[0] || !args[1] || !message.mentions.members.first()) { message.channel.send(`Invalid arguments`); return; }

        //Get the user to mute
        let to_mute = message.mentions.members.first();

        //Get the mute time from the message assuming they specify it in minutes
        //We multiply the minutes time by 60 because the muteUser function takes in the amount of seconds to mute for
        let mute_minutes = parseInt(args[1])
        let mute_time =  mute_minutes * 60;

        //Muting the user
        helper.muteUser(to_mute, mute_time, () => {
            //Anything in here is called when the user is unmuted
            message.channel.send(`<@!${to_mute.id}> was unmuted after ${mute_minutes} minutes!`);
        });

}
```

## commandRegistry(abosluteCommandsFolderPath, registryType) 
Creates a registry of all the commands in the given folder with the given type | [source](https://github.com/SomberTM/discordjs-helper/blob/master/src/commandRegistry.ts)
```javascript
/** IF YOU ARE USING JAVASCRIPT ONLY
 * Imagine this code being in a file under the folder commands
 * 
 * This file will highlight what the module.exports should look like 
 * for the registry to pick it up properly
 * 
 * Essentially each command file will require the name property inside of module.exports
 * as well as any functions
 * 
 */

module.exports = {
    name: 'test'
    example: function() {
        console.log(`Hello World`);
    }
}
```
Typescript users
```javascript
/** IF YOU ARE USING TYPESCRIPT
 * Imagine this code being in a file under the folder commands
 * 
 * This file will highlight what the default export should look like 
 * for the registry to pick it up properly
 * 
 * Essentially each command file will require the name property inside of export default
 * as well as any functions
 * 
 * WHEN CRETING A NEW REGISTRY REFRENCE THE FOLDER THAT CONTAINS THE COMPILED JAVASCRIPT
 */

export default {
    name: 'test',
    example: function() {
        console.log(`Hello World`);
    }
}
```
Creating a registry
```javascript
//For javascript users
const path = require('path'); //npm i path

//Create a new registry
const registry = new helper.commandRegistry(path.join(__dirname, 'commands'), '.js');

//Get the file with the name: 'test' and calls the example() function from above
registry.get('test').example();

//Grab a function from the registry by its name and call it
registry.grab('test', 'example')();
```
```javascript
//For typescript
import path from 'path'

//Remeber the path should point to the folder with the compiled javascript files
const registry = new helper.commandRegistry(path.join(__dirname, 'commands'), '.ts');

//Get the file with the name: 'test' and calls the example() function from above
registry.get('test').example();

//Grab a function from the registry by its name and call it
registry.grab('test', 'example')();
```
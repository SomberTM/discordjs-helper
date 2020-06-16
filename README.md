# About
discordjs-helper is meant to be a package that assits programmers in creating their very own discord.js bot |
discordjs-helper includes many helpful functions such as
* **[playYoutube](https://www.npmjs.com/package/@sombertm/discordjs-helper#playyoutubevoicechannel-youtube_url-cb)** -> Plays youtube music
* **[pageReaction](https://www.npmjs.com/package/@sombertm/discordjs-helper#pagereactionmessageembedtoreactto-items-itemsperpage-startinpage)** -> Up and down arrow reactions on embeds
* **[roleReaction](https://www.npmjs.com/package/@sombertm/discordjs-helper#rolereactionmessagetoreactto-emoji-role)** -> Give roles when users react
* **muteUser** / **unmuteUser** -> Mute and unmute users easily
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
Reacts to a message embed with the an up and down arrow to allow multiple pages [Source]()
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
Reacts to a given message with the given emoji and when that emoji is reacted to, the user that reacted will be given the provided role
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
        if (!args[0] || !args[1] || !message.mentions.roles.first()) { message.channel.send(``); return; }

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
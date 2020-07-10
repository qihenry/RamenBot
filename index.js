//to hide token
//require("dotenv").config()
//need discord API library
const fs = require('fs');
const Discord = require("discord.js");
const { prefix, token } = require('./config.json');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}
//****************************************************
//Variables and function to assist some event features
//****************************************************

//keep track of the ids of suggestions
var suggestionArray = [];
//keep track of the id message of messages that can be reacted to
var pinnedMsg = [];
//keep track of which room is available
var availableTickets = [];
var availableBuycraft = [];
var availableAppeal = [];
for(var i = 0; i < 100; i++){
    availableTickets.push(true);
    availableAppeal.push(true);
    availableBuycraft.push(true);
}
//finds the next available spot;
function Roomavailable(a){
    for(var i = 0; i < a.length; i++){
        if(a[i]){
            return i;
        }
    }
    return -1;
}

//******************* 
//Events
//*******************

//turn on
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
})
 
//called by !verificationOn. Turns on verifiction by fetching the verification message in the verification channel
client.on("message", msg => {
    if(msg.author.bot) return;
    if(msg.content[0] !== '!') return;
    var msgContent = msg.content.split(" ");
    if(msgContent[0] === "!verificationOn"){
        client.commands.get('verificationOn').execute(msg, msgContent);
    }
})

//Called by !ticketOn. Turns on tickets. Sends the embedded message that the users will react to
client.on("message", msg => {
    if(msg.author.bot) return;
    if(msg.content[0] !== '!') return;
    var msgContent = msg.content.split(" ");
    if(msgContent[0] === "!ticketOn"){
        client.commands.get('ticketOn').execute(msg, msgContent);      
    }
});

//actual verification part. If the user reacts with the green checkmark, then the bot will 
//it a role that will grant access to the server. It does this by checking if the emoji
//matched and then using find of the role cache to check if the role is present. If it is
//give the role to the reactor
client.on("messageReactionAdd", (reaction, user) =>{
    let message = reaction.message;
    if(user.bot) return;
    if(reaction.emoji.name === "✅") {
        console.log("that worked");
        let roleName = "Member";
        let role = message.guild.roles.cache.find(r => r.name === roleName);
        if(role == null){
            message.reply(roleName + " not found");
        }
        else{
            message.member.roles.add(role);
            reaction.message.reply(roleName + " has been added");
        }
    }
})

//This checks for reaction on the ticket embeded message. If reacted, it will find the 
//next available room and create a channel. Needs to do part where a channel is deleted
client.on("messageReactionAdd", (reaction, user) =>{
    let message = reaction.message
    if(user.bot) return;
    let emoji = reaction.emoji;
    //If reacted with a 🔍, it will create a general support room. 
    if(emoji.name == '🔍' && pinnedMsg.includes(message.id)){
        var channelType = {reason: 'Needed a cool new channel'};
        //Category channel name
        let categoryName = 'General Support';
        //gives the actual id of the category channel
        let categoryId = message.guild.channels.cache.find(c => c.name === categoryName && c.type === "category");
        if(categoryId == null){
            message.reply("Couldn't find category");
            return;
        }
        else{
            channelType.parent = categoryId.id;
        }
        //looks for the next available rooms and save the number
        let roomNumber = Roomavailable(availableTickets);
        //make it not available;
        availableTickets[roomNumber] = false;
        //creates the room and mention the role that will help the ticket
        message.guild.channels.create("TICKET" + roomNumber, channelType).then(channel => {
            var role = message.guild.roles.cache.find(r => r.name === '➥ Staff');
            
            if(role == null){
                channel.send("Role not found");
                return;
            }
            else{
                var roleID = role.id;
                channel.send('➥ ' + message.author.username + ' has opened a General Support ticket!' 
                             + "<@&" + roleID + ">" + 'will get to you as soon as possible.');
            }
        });
    }
    //If reacted with a 🛒, it will create a Buycraft room
    if(emoji.name == '🛒' && pinnedMsg.includes(message.id)){
        let channelType ={reason: 'Needed a cool new channel'};
        let categoryName = 'Buycraft';
        //gives the actual id of the category channel
        var categoryId = message.guild.channels.cache.find(c => c.name === categoryName && c.type === "category");
        if(categoryId == null){
            message.reply("Couldn't find category");
            return;
        }
        else{
            channelType.parent = categoryId.id;
        }
        //looks for the next available rooms and save the number
        let roomNumber = Roomavailable(availableBuycraft);
        //make it not available;
        availableBuycraft[roomNumber] = false;
        //creates the room and mention the role that will help the ticket
        message.guild.channels.create("BUYCRAFT" + roomNumber, channelType).then(channel => {
            var role = message.guild.roles.cache.find(r => r.name === '➥ Owner');
            var role1 = message.guild.roles.cache.find(r => r.name === 'Administrator');
            var role2 = message.guild.roles.cache.find(r => r.name === '*');
            var role3 = message.guild.roles.cache.find(r => r.name === 'Manager');
            if(role == null || role1 == null || role2 == null || role3 == null){
                channel.send("Role not found");
                return;
            }
            else{
                var roleID = role.id;
                var role1ID = role1.id;
                var role2ID = role2.id;
                var role3ID = role3.id;
                channel.send('➥ ' + message.author.username + 
                             ' has opened a Buycraft ticket!' +
                             "<@&" + roleID + ">" + " " + "<@&" + role1ID + ">" + " " +
                             "<@&" + role2ID + ">" + " " + "<@&" + role3ID + ">" + 
                             'will get to you as soon as possible.');
            }
        });
    }

    //If reacted with a ✉️, it will create an Appeals room
    if(emoji.name == '✉️' && pinnedMsg.includes(message.id)){
        let channelType ={reason: 'Needed a cool new channel'};
        let categoryName = 'Appeals';
        //gives the actual id of the category channel
        var categoryId = message.guild.channels.cache.find(c => c.name === categoryName && c.type === "category");
        if(categoryId == null){
            message.reply("Couldn't find category");
            return;
        }
        else{
            channelType.parent = categoryId.id;
        }
        //looks for the next available rooms and save the number
        let roomNumber = Roomavailable(availableAppeal);
        //make it not available;
        availableAppeal[roomNumber] = false;
        //creates the room and mention the role that will help the ticket
        message.guild.channels.create("Appeal" + roomNumber, channelType).then(channel => {
            var role = message.guild.roles.cache.find(r => r.name === 'Appeals');
            
            if(role == null){
                channel.send("Role not found");
                return;
            }
            else{
                var roleID = role.id;
                channel.send('➥ ' + message.author.username + ' has opened a Appeal ticket!' 
                             + "<@&" + roleID + ">" + 'will get to you as soon as possible.');
            }
        });
    }
});

//This is called by !delete. By default, it will delete the channel the message was sent on.
//THING TOO ADD:
//ROLE NEEDED TO DELETE
//ARGUMENT TO DELETE SPECIFIC CHANNEL
//Make the room available again
client.on("message", msg => {
    //prevents reading bot messages.
    if(msg.author.bot) return;
    // Prevents reading non keywords
    if(msg.content[0] !== '!') return;
    var msgContent = msg.content.split(" ");
    if(msgContent[0] === "!delete"){
        client.commands.get('delete').execute(msg,msgContent);
    }
}); 

//This is called by !suggestion. It's format is !suggestion <suggestion> because <reason>.
//The suggestion is posted on the suggestion channel where it can be approved or denied 
//by the mods.
client.on("message", msg => {
    // Prevents reading bot messages.
    if(msg.author.bot) return;
    // Prevents reading non keywords
    if(msg.content[0] !== '!') return;
    //An array of each word of the message
    var msgContent = msg.content.split(" ");

    if (msgContent[0] === "!suggestion") {
        client.commands.get('suggestion').execute(msg,msgContent,suggestionArray);
    }
});

//called by !approve. The format is !approve <suggestion id> <reason>. It will create an
//approve embedded message to the approve channel
client.on("message", msg => {
    
    // It's good practice to ignore other bots. This also makes your bot ignore itself
    // and not get into a spam loop (we call that "botception").
    if(msg.author.bot) return;
  
    // Also good practice to ignore any message that does not start with our prefix, 
    // which is set in the configuration file.
    if(msg.content[0] !== '!') return;
    
    var msgContent = msg.content.split(" ");
    
    if(msgContent[0] === "!approve") {
        client.commands.get('approve').execute(msg,msgContent,suggestionArray);
    }
});

//called by !deny. The format is !deny <suggestion ID> <reason>. It will create a denied
//post on the denied channel
client.on("message", msg => {
    
    // It's good practice to ignore other bots. This also makes your bot ignore itself
    // and not get into a spam loop (we call that "botception").
    if(msg.author.bot) return;
  
    // Also good practice to ignore any message that does not start with our prefix, 
    // which is set in the configuration file.
    if(msg.content[0] !== '!') return;
    
    var msgContent = msg.content.split(" ");
    
    if(msgContent[0] === "!deny") {
        client.commands.get('deny').execute(msg,msgContent,suggestionArray);        
    }
});

//fetch channel to the cache. Not sure if its needed.
client.on("message", msg =>{
    if(msg.author.bot) return;
    // Also good practice to ignore any message that does not start with our prefix, 
    // which is set in the configuration file.
    if(msg.content[0] !== '!') return;
    var msgContent = msg.content.split(" ");

    if(msgContent[0] === "!fetchChannel" ){
        if(msgContent.length === 1){
            msg.reply("not enough arguments");
            return;
        }
        let id = msgContent[1];
        msg.client.channels.fetch(id)
            .then(channel => console.log(channel.name))
            .catch(console.error);
        msg.reply("done");
    }
});

//create channel by calling !create <name> followed by channel attributes such as <topic> and <category>
client.on("message", msg =>{
    if(msg.author.bot) return;
    // Also good practice to ignore any message that does not start with our prefix, 
    // which is set in the configuration file.
    if(msg.content[0] !== '!') return;
    var msgContent = msg.content.split(" ");
    if(msgContent[0] === "!create"){
        client.commands.get('create').execute(msg,msgContent);
    }
});

//add roles by calling !addRole <Role Name>. 
client.on('message', msg =>{
    if(msg.author.bot) return;
    if(msg.content[0] !== '!') return;
    var msgContent = msg.content.split(" ");
    if(msgContent[0] === "!addRole"){
        client.commands.get('addRole').execute(msg,msgContent);
    }
})

//welcome when a member joins. Sends an embedded message. Maybe have to change it so that it sends the welcome after the members verify themselves
client.on('guildMemberAdd',member => {
  
    
    // Send the message to a designated channel on a server:
    const channel = member.guild.channels.cache.find(ch => ch.name === 'welcome');
    // Do nothing if the channel wasn't found on this server
    if (!channel) return;
    // Send the message, mentioning the member  
    //this makes the actual embedded message with the fancy design
    const exampleEmbed = new Discord.MessageEmbed()
	    .setColor('#000000')
	    .setTitle('Welcome to EclipticMC!')
	    .setThumbnail(member.user.avatarURL())
        .setDescription('Hello' + ' ' + member.user.toString() + ', ' + 'you have been chosen to be a warrior of ***EclipticMC!*** ' +
                        ' The Throne still remains vacant but only one can acquire the seat on the throne.' +
                        ' To find out about the story behind this game, continue to the next channel.')

    channel.send(exampleEmbed)
  });
client.login(token)
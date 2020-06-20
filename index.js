//to hide token
require("dotenv").config()
//need discord API library
const Discord = require("discord.js")
const client = new Discord.Client()
//turn on
var suggestionArray = [];


client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  // Send the message to a designated channel on a server:

})

function arrayToString(a,b,c){
    var arrayString = '';
    //need this for the suggestions when intializing a word
    /*if(a.length === 2){
        return ' ';
    }*/
    for(; b < c;b++){
        if(arrayString === ''){
            arrayString = a[b];
        }
        else{
            arrayString = arrayString + " " + a[b];
        }   
    }
    return arrayString;
}

//starts at 2 because the first 2 words must be used
function containWord(array, word){
    for(i = 0; i < array.length; i++){
        if(word === array[i]){
            return i;
        }
    }
    return -1;
} 
//turn on verifiction
client.on("message", msg => {
    if(msg.author.bot) return;
    if(msg.content[0] !== '!') return;
    var msgContent = msg.content.split(" ");
    if(msgContent[0] === "!verificationOn"){
        let Vchannel = msg.member.guild.channels.cache.find(ch => ch.name === 'verification');
        if(!Vchannel) return;
        Vchannel.messages.fetch({ limit: 1 })
        /*let Vmessage = Vchannel.messages.cache.first();
        if(Vmessage != null){
            Vmessage.react("✅");
        }*/
    }
})
//actual verification part
client.on("messageReactionAdd", (reaction, user) =>{
    if(reaction.emoji.name === "✅") {
        console.log("that worked");
        let roleName = "Member";
        let role = reaction.message.guild.roles.cache.find(r => r.name === roleName);
        if(role == null){
            reaction.message.reply(roleName + " not found");
        }
        else{
            reaction.message.member.roles.add(role);
            //reaction.message.reply(roleName + " has been added");
        }
    }
})
//!suggestion event
client.on("message", msg => {
    // It's good practice to ignore other bots. This also makes your bot ignore itself
    // and not get into a spam loop (we call that "botception").
    if(msg.author.bot) return;
  
    // Also good practice to ignore any message that does not start with our prefix, 
    // which is set in the configuration file.
    if(msg.content[0] !== '!') return;

    var msgContent = msg.content.split(" ");

    if (msgContent[0] === "!suggestion") {
        if(msgContent.length < 2){
            msg.reply('you need a suggestion');
            return;
        }
        // Send the message to a designated channel on a server:
        const channel = msg.guild.channels.cache.find(ch => ch.name === 'suggestions');
        // Do nothing if the channel wasn't found on this server
        if (!channel) return;
        var whyIndex = msg.content.search('because');
        var sugg = msg.content.substring(12);
        var why = "Not provided";
        var suggestionId = suggestionArray.length;
        if(whyIndex > 0){
            sugg = msg.content.substring(11,whyIndex)
            why = msg.content.substring(whyIndex + 7) 
        }
        msg.delete()
        const suggestionEmbed = new Discord.MessageEmbed()
            .setColor('#000000')
            .setTitle('───────────────:sparkles:SUGGESTION:sparkles:───────────────')
            .setDescription( '***Suggestion:***' + '```'+ sugg + '```' + "\n" + 
                             '***Reasoning:***' + '```'+ why +  '```' +'\n' + 
                             '**`created by:`** ' + msg.author.toString() + '\n' +
                             '***:sparkles:─────────────────────────────────────────────:sparkles:***')
            .setFooter(suggestionId)
        channel.send(suggestionEmbed).then(embedMessage => {
            embedMessage.react("👍");
            embedMessage.react("👎");
        });
        suggestionArray.push(suggestionEmbed);
    }
    

});

//approval
client.on("message", msg => {
    
    // It's good practice to ignore other bots. This also makes your bot ignore itself
    // and not get into a spam loop (we call that "botception").
    if(msg.author.bot) return;
  
    // Also good practice to ignore any message that does not start with our prefix, 
    // which is set in the configuration file.
    if(msg.content[0] !== '!') return;
    
    var msgContent = msg.content.split(" ");
    
    if(msgContent[0] === "!approve") {
        
        // Send the message to a designated channel on a server:
        const channel = msg.guild.channels.cache.find(ch => ch.name === 'accepted');
        // Do nothing if the channel wasn't found on this server
        if (!channel) return;
        //msg.delete();
        var id = msgContent[1];
        var reason = arrayToString(msgContent,2,msgContent.length);
        const receivedEmbed = suggestionArray[id];
        const exampleEmbed = new Discord.MessageEmbed(receivedEmbed)
            .setTitle('───────────:sparkles:SUGGESTION APPROVED:sparkles:───────────')
            .addFields(
                { name: '**Reason for approval**', value: " " + reason }
            )
        channel.send(exampleEmbed);
        msg.delete();
    }
});

//deny
client.on("message", msg => {
    
    // It's good practice to ignore other bots. This also makes your bot ignore itself
    // and not get into a spam loop (we call that "botception").
    if(msg.author.bot) return;
  
    // Also good practice to ignore any message that does not start with our prefix, 
    // which is set in the configuration file.
    if(msg.content[0] !== '!') return;
    
    var msgContent = msg.content.split(" ");
    
    if(msgContent[0] === "!deny") {
        if(msgContent.length < 3){
            msg.reply('Remainder: you need a id and reason');
            msg.delete();
            return;
        }
        // Send the message to a designated channel on a server:
        const channel = msg.guild.channels.cache.find(ch => ch.name === 'denied');
        // Do nothing if the channel wasn't found on this server
        if (!channel) return;
        //msg.delete();
        var id = msgContent[1];
        var reason = arrayToString(msgContent,2,msgContent.length);
        const receivedEmbed = suggestionArray[id];
        const exampleEmbed = new Discord.MessageEmbed(receivedEmbed)
            .setTitle('───────────:sparkles:SUGGESTION DENIED:sparkles:───────────')
            .addFields(
                { name: '**Reason for denial**', value: " " + reason }
            )
        channel.send(exampleEmbed);
        msg.delete();
    }
});

//create channel
client.on("message", msg =>{
    if(msg.author.bot) return;
    // Also good practice to ignore any message that does not start with our prefix, 
    // which is set in the configuration file.
    if(msg.content[0] !== '!') return;
    var msgContent = msg.content.split(" ");
    if(msgContent[0] === "!create"){
        var channelType = {reason: 'Needed a cool new channel'};
        //topic keyword channel
        if(containWord(msgContent, "topic") > 0){
            var phrase = '';
            for(i = containWord(msgContent, "topic") + 1; msgContent[i] !== ',' && i < msgContent.length; i++){
                phrase = phrase +  " " + msgContent[i];
            }
            channelType.topic = phrase;
            msg.reply(phrase);
        }
        if(containWord(msgContent, "category") > 0){

        }
        msg.reply("made new channel");
        msg.guild.channels.create(msgContent[1], channelType);
    }
});

//add roles
client.on('message', msg =>{
    if(msg.author.bot) return;
    if(msg.content[0] !== '!') return;
    var msgContent = msg.content.split(" ");
    if(msgContent[0] === "!addRole"){
        var roleName = arrayToString(msgContent, 1, msgContent.length);
        var role = msg.guild.roles.cache.find(r => r.name === roleName);
        if(role == null){
            msg.reply(roleName + " not found");
        }
        else{
            msg.member.roles.add(role);
            msg.reply(roleName + " has been added");
        }
    }
})
//welcome for when a member joins
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
client.login(process.env.BOT_TOKEN)
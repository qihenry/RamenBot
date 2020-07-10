const Discord = require("discord.js");
module.exports = {
	name: 'suggestion',
	description: 'Make a suggestion in a server',
	execute(msg, msgContent, suggestionArray) {
        //needs to be longer than two otherwise there's no suggestion
        if(msgContent.length < 2){
            msg.reply('you need a suggestion');
            return;
        }
        // Send the message to a designated channel on a server:
        const channel = msg.guild.channels.cache.find(ch => ch.name === 'suggestions');
        // Do nothing if the channel wasn't found on this server
        if (!channel) return;
        //Find where the reason is and store it to the variable why
        var whyIndex = msg.content.search('because');
        var sugg = msg.content.substring(12);
        var why = "Not provided";
        var suggestionId = suggestionArray.length;
        if(whyIndex > 0){
            sugg = msg.content.substring(11,whyIndex)
            why = msg.content.substring(whyIndex + 7) 
        }
        msg.delete()
        //The embedded message that will have the suggestion content in a prettier display
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
    },
};
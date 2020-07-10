function arrayToString(a,b,c){
    var arrayString = '';
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
const Discord = require("discord.js");
module.exports = {
	name: 'approve',
	description: 'approve a suggestion',
	execute(msg, msgContent, suggestionArray) {
        // Send the message to a designated channel on a server:
        const channel = msg.guild.channels.cache.find(ch => ch.name === 'accepted');
        // Do nothing if the channel wasn't found on this server
        if (!channel) return;
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
    },
};
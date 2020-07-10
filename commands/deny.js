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
	name: 'deny',
	description: 'reject an suggestion',
	execute(msg, msgContent, suggestionArray) {
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
    },
};
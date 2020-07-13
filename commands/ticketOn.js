const Discord = require("discord.js");

module.exports = {
	name: 'ticketOn',
	description: 'Sends an embedded message that will allow users to react in order to create tickets',
	execute(msg, msgContent, pinnedMsg) {
        //The embedded message
        const suggestionEmbed = new Discord.MessageEmbed()
        .setColor('#000000')
        .setTitle('CREATE A TICKET')
        .setDescription("React with one of the emoji's below to create a ticket" + '\n' + 
                        ':mag: ➥ General Support' + '\n' +   
                        ':shopping_cart: ➥ Buycraft' + '\n' + 
                        ':envelope: ➥ Appeals' )
        //sending the message and using callback functions to put the emotes
        msg.channel.send(suggestionEmbed).then(embedMessage => {
            embedMessage.react("🔍");
            embedMessage.react("🛒");
            embedMessage.react("✉️");
            pinnedMsg.push(embedMessage.id);
        })
        msg.delete();  
    },
};
/*module.exports = {
	name: 'ping',
	description: 'Ping!',
	execute(msg, msgContent) {
    
    },
};*/
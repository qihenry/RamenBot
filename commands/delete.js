module.exports = {
	name: 'delete',
	description: 'deletes the channel',
	execute(msg, msgContent) {
        let theChannel = msg.channel;
        if(theChannel.parent.name === "Support"){
            let roomNumber = theChannel.name.substring(7);
            availableTickets[roomNumber] = true; 
        }
        //the other types
        msg.channel.delete();
    },
};
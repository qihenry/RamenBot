module.exports = {
	name: 'create',
	description: 'creates a channel',
	execute(msg, msgContent) {
        var channelType = {reason: 'Needed a cool new channel'};
        //topic keyword channel
        if(msgContent.indexOf("topic") > 0){
            var phrase = '';
            for(i = msgContent.indexOf("topic") + 1; msgContent[i] !== ',' && i < msgContent.length; i++){
                phrase = phrase +  " " + msgContent[i];
            }
            channelType.topic = phrase;
        }
        if(msgContent.indexOf("category") > 0){
            let categoryName = '';
            for(i = msgContent.indexOf("category") + 1, j = 0; msgContent[i] !== ',' && i < msgContent.length; i++){
                if(j === 0){
                    categoryName = msgContent[i];
                    j++;
                }
                else{
                    categoryName = categoryName + " " + msgContent[i];
                }
            }
            msg.reply("category name is" + categoryName + 'h');
            var categoryId = msg.guild.channels.cache.find(c => c.name === categoryName && c.type === "category");
            if(categoryId == null){
                msg.reply("Couldn't find category");
            }
            else{
                channelType.parent = categoryId.id;
            }
        }
        msg.reply("made new channel");
        msg.guild.channels.create(msgContent[1], channelType);
    },
};
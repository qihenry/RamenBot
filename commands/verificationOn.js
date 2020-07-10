module.exports = {
	name: 'verificationOn',
	description: 'Turns on the verification',
	execute(msg, msgContent) {
        msg.channel.send('Pong.');
        let Vchannel = msg.member.guild.channels.cache.find(ch => ch.name === 'verification');
        if(!Vchannel) return;
        Vchannel.messages.fetch({ limit: 1 })
        let Vmessage = Vchannel.messages.cache.first();
        if(Vmessage != null){
            Vmessage.react("✅");
        }
	},
};
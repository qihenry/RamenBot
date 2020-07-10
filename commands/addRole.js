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
module.exports = {
	name: 'addRole',
	description: 'add role',
	execute(msg, msgContent) {
        var roleName = arrayToString(msgContent, 1, msgContent.length);
        var role = msg.guild.roles.cache.find(r => r.name === roleName);
        if(role == null){
            msg.reply(roleName + " not found");
        }
        else{
            msg.member.roles.add(role);
            msg.reply(roleName + " has been added");
        }
    },
};
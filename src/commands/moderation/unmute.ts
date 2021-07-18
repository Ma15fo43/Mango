import * as Discord from "discord.js";
import * as LogChecker from "../../utils/LogChecker";

// Moderation command

/**
 * Mutes a user
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
export async function run(Client: Discord.Client, message: Discord.Message, args: string[], ops: any) {
    const userUnmute: Discord.User = message.mentions.users.first();
    const memberUnmute: Promise<Discord.GuildMember> = message.guild.members.fetch(userUnmute);

    if ((await memberUnmute).permissions.has(["ADMINISTRATOR", "MANAGE_MESSAGES"])) {
        return message.reply("Sorry, but I can't unmute the user you specified, because he has one of the following perms: `ADMINISTATOR` or `MANAGE_MESSAGES`.");
    }

    let muteRole: Discord.Role = message.guild.roles.cache.find(role => role.name === "muted");

    if (!muteRole && !(await memberUnmute).roles.cache.has("muteRole" as unknown as `${bigint}`)) {
        return message.reply(`It looks like that **${(await memberUnmute).user.tag}** isn't muted :eyes:`);
    }

    if (!message.member.permissions.has(["ADMINISTRATOR"])) {
        return message.reply("You don't have the permission to unmute this person.");
    }

    try {
        (await memberUnmute).roles.remove(muteRole);
        message.reply(`**${(await memberUnmute).user.tag}** has been successfully unmuted. <:yes:835565213498736650>`);
        LogChecker.insertLog(Client, message.guild.id, message.member.user, `**${(await memberUnmute).user.tag}** has been __unmuted__ by ${message.member.user.tag}.`);
    } catch (error) {
        message.reply("Sorry, but I got an unexcepted error while unmuting this user. " + + `\`\`\`${error.message}\`\`\``);
    }
}

const info = {
    name: "unmute",
    description: "Unmute a member",
    category: "moderation",
    args: "[@user]"
}

export { info };
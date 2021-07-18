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
    const userMute: Discord.User = message.mentions.users.first();
    const memberMute: Promise<Discord.GuildMember> = message.guild.members.fetch(userMute);

    if ((await memberMute).permissions.has(["ADMINISTRATOR"])) {
        return message.reply("Sorry, but I can't mute the user you specified, because he has one of the following perms: `ADMINISTRATOR`");
    }

    if (!message.member.permissions.has(["MANAGE_MESSAGES"])) {
        return message.reply("Sorry, but you don't have the permission to mute this user.");
    }

    let muteRole: Discord.Role = message.guild.roles.cache.find(role => role.name === "muted");

    if (!muteRole) {
        try {
            muteRole = await message.guild.roles.create({
                name: "muted",
                mentionable: false,
                permissions: [],
                color: "#524F4F"
            });

        } catch (error) {
            message.reply("Sorry, but I got an unexcepted error while creating the role. " + + `\`\`\`${error.message}\`\`\``);
        }
    }

    message.guild.channels.cache.forEach(async (channel, id) => {
        await channel.updateOverwrite(muteRole, {
            SEND_MESSAGES: false,
            ADD_REACTIONS: false
        });
    });

    (await memberMute).roles.add(muteRole);

    let reason = args[1] == undefined ? "no reason specified." : message.content.split(args[0])[1].trim();

    message.reply(`**${(await memberMute).user.tag}** has been muted for: *${reason}*. <:yes:835565213498736650>`);

    LogChecker.insertLog(Client, message.guild.id, message.member.user, `**${(await memberMute).user.tag}** has been __muted__ by ${message.member.user.tag} for: *${reason}* \nDuration of the punishment: infinite`);
}

const info = {
    name: "mute",
    description: "Mute a member",
    category: "moderation",
    args: "[@user] (reason)"
}

export { info };

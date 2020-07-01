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
export async function run(Client: Discord.Client, message: Discord.Message, args: string[]) {
    const userMute: Discord.User = message.mentions.users.first();
    const memberMute: Discord.GuildMember = message.guild.member(userMute);

    if (memberMute.hasPermission(["ADMINISTRATOR"])) {
        return message.reply("Sorry, but I can't mute the user you specified, because he has one of the following perms: `ADMINISTRATOR`");
    }

    if (!message.member.hasPermission(["ADMINISTRATOR"])) {
        return message.reply("Sorry, but you don't have the permission to mute this user.");
    }

    let muteRole: Discord.Role = message.guild.roles.cache.find(role => role.name === "muted");

    if (!muteRole) {
        try {
            muteRole = await message.guild.roles.create({
                data: {
                    name: "muted",
                    mentionable: false,
                    permissions: [],
                    color: "#524F4F"
                }
            });

        } catch (error) {
            message.reply("Sorry, but I got an unexcepted error while creating the role. " + + `\`\`\`${error.message}\`\`\``);
        }
    }

    message.guild.channels.cache.forEach(async (channel, id) => {
        await channel.overwritePermissions([{
            id: muteRole.id,
            deny: ["SEND_MESSAGES", "ADD_REACTIONS"],
        }])
    });

    memberMute.roles.add(muteRole);

    let reason = args[1] == undefined ? "no reason specified." : message.content.split(args[0])[1].trim();

    message.reply(`**${memberMute.user.tag}** has been muted for: *${reason}*. <a:check:690888185084903475>`);

    LogChecker.insertLog(Client, message.guild.id, message.author, `**${memberMute.user.tag}** has been __muted__ by ${message.author.tag} for: *${reason}* \nDuration of the punishment: infinite`);
}
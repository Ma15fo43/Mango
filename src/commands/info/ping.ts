import * as Discord from "discord.js";

// Test command

/**
 * Tests the bot ping.
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
export async function run(client: Discord.Client, message: Discord.Message, args: string[], ops: any) {
	const ping: Discord.Message = await message.reply("Ping?") as Discord.Message;

	const pong: Discord.MessageEmbed = new Discord.MessageEmbed()
		.setTitle(`Latency information for ${message.member.user.tag}`)
		.setAuthor(message.member.user.username, message.member.user.avatarURL())
		.setColor("RANDOM")
		.setDescription("Latency information")
		.addField("Host latency", `**${Math.floor(ping.createdTimestamp - message.createdTimestamp)}** ms.`)
		.addField("API latency", `**${Math.round(client.ws.ping)}** ms.`, true)
		.setFooter(client.user.username, client.user.avatarURL())
		.setTimestamp();

	ping.edit({ embeds: [pong] });
}

const info = {
    name: "ping",
    description: "Get info on Mango's latency",
    category: "info",
    args: "none"
}

export { info };

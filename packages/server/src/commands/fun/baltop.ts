import Discord from "discord.js";

import type { MoneyAccs, PrismaClient } from "@prisma/client";

// Fun command

/**
 * Shows the richest Mango users
 * @param {Discord.Client} Client the client
 * @param {Discord.CommandInteraction & Discord.Message} Interaction the slash command that contains the interaction name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
	name: "baltop",
	description: "Shows the richest Mango users",
	category: "fun",
	botPermissions: ["ADD_REACTIONS"],

	async execute(Client: Discord.Client, interaction: Discord.CommandInteraction & Discord.Message, _args: string[], prisma: PrismaClient) {
		let marketUsers: MoneyAccs[];

		let page = 0;

		await assignData();

		if (!marketUsers) {
			return interaction.editReply("It seems like nobody has a Mango bank account.");
		}

		getPageContent(page);

		async function assignData() {
			return (marketUsers = await prisma.moneyAccs.findMany({ orderBy: [{ money: "desc" }] }));
		}

		console.log(marketUsers);

		async function getPageContent(page: number, arg?: Discord.MessageComponentInteraction) {
			const itemsContent = marketUsers.slice(page * 10, page * 10 + 10);
			const pageContent: string[] = [];

			for (let index = 0; index < itemsContent.length; index++) {
				const wealth = itemsContent[index]["money"];
				const userId = itemsContent[index]["idOfUser"];
				const user = await Client.users.fetch(userId);

				pageContent.push(`${index + (page * 10 + 1)}. ${user} - \`${wealth}$\``);
			}

			const usersEmbed = new Discord.MessageEmbed().setDescription(pageContent.join("\n")).setColor("#33beff").setTitle("🛒 Market").setTimestamp().setFooter(Client.user.username, Client.user.displayAvatarURL());

			const button = new Discord.MessageActionRow().addComponents(
				new Discord.MessageButton()
					.setCustomId("back")
					.setLabel("◀")
					.setStyle("PRIMARY")
					.setDisabled(page === 0 ? true : false),

				new Discord.MessageButton().setCustomId("next").setLabel("▶").setStyle("PRIMARY").setDisabled(buttonChecker()),
			);

			if (!arg) {
				interaction.editReply({ embeds: [usersEmbed], components: [button] }).then(async () => {
					fetchInteraction();
				});
			} else {
				arg.update({ embeds: [usersEmbed], components: [button] }).then(async () => {
					fetchInteraction();
				});
			}
		}

		function buttonChecker() {
			const index = page + 1;

			if (marketUsers.slice(index * 10, index * 10 + 10).length === 0) {
				return true;
			} else {
				return false;
			}
		}

		function fetchInteraction() {
			interaction.fetchReply().then((msg: Discord.Message) => {
				createReactionCollector(msg);
			});
		}

		function createReactionCollector(m: Discord.Message) {
			const collector = m.createMessageComponentCollector({ componentType: "BUTTON", max: 1 });

			collector.on("collect", async (i) => {
				if (i.user.id !== interaction.member.user.id) return;

				if (i.customId === "back") {
					page--;
				} else if (i.customId === "next") {
					page++;
				}

				await assignData();

				getPageContent(page, i);
			});

			collector.on("end", () => {
				return;
			});
		}
	},
};

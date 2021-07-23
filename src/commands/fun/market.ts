import * as Discord from "discord.js";
import * as Sequelize from "sequelize";

// Fun command

/**
 * Shows the black market (lmfao)
 * @param {Discord.Client} Client the client
 * @param {Discord.Message} Message the message that contains the command name
 * @param {string[]} args the command args
 * @param {any} options some options
 */
module.exports = {
    name: "market",
    description: "Replies with the current Mango's marketplace",
    category: "fun",

    async execute(Client: Discord.Client, message: Discord.Message & Discord.CommandInteraction, args, ops) {
        const inventorymodel: Sequelize.ModelCtor<Sequelize.Model<any, any>> = ops.sequelize.model("marketItems");
        const marketItems = await inventorymodel.findAll();

        if (!marketItems[0]) {
            return message.reply("It seems like the market is empty! Start by `ma!sell`ing an object :wink:");
        }

        let splittedItems: string[] = [];

        marketItems.forEach((item, index) => {
            let object = { name: item.getDataValue("name"), price: item.getDataValue("price"), seller: item.getDataValue("seller"), id: item.getDataValue("id") };
            splittedItems.push(`${index + 1}. **${object.name}** - *${object.price}$* | Sold by ${object.seller} » \`${object.id}\``);
        });

        const filter = (reaction: any, user: { id: string; }) => {
            return user.id == message.member.user.id;
        };

        let page: number = 1;
        let trimLimit: number = (splittedItems.length > 10) ? page * 10 : splittedItems.length + 1;
        let firstPageContent: string = splittedItems.join("\n").split(trimLimit.toString() + ".")[0];

        const inventoryEmbed = new Discord.MessageEmbed()
            .setDescription(firstPageContent)
            .setColor("#33beff")
            .setTitle(`🛒 Market`)
            .setTimestamp()
            .setFooter(Client.user.username, Client.user.displayAvatarURL())

        message.reply({ embeds: [inventoryEmbed] }).then(async m => {
            (message.type === "APPLICATION_COMMAND") ? fetchInteraction() : addReactions(m);
        });

        function fetchInteraction() {
            message.fetchReply().then((msg: Discord.Message) => {
                addReactions(msg);
            });
        }

        async function addReactions(msg) {
            await msg.react("◀️");
            await msg.react("▶️");

            createReactionCollector(msg);
        }

        function createReactionCollector(m: Discord.Message) {
            m.awaitReactions({ filter, max: 1 })
                .then(collected => {
                    if (collected.first().emoji.name == "▶️") {
                        page++;
                        sendMessage(page);
                    } else {
                        page--;
                        sendMessage(page);
                    }

                    createReactionCollector(m);
                });
        }

        function sendMessage(page: number) {
            let whatToSend: string;

            try {
                whatToSend = page != 1 ? `${(page - 1) * 10}. ${splittedItems.join("\n").split(`${((page - 1) * 10).toString()}.`)[1].split(`${(page * 10).toString()}.`)[0]}` : firstPageContent;
            } catch (e) {
                return;
            }

            const inventoryEmbed = new Discord.MessageEmbed()
                .setDescription(whatToSend)
                .setColor("#33beff")
                .setTitle(`🛒 Market`)
                .setTimestamp()
                .setFooter(Client.user.username, Client.user.displayAvatarURL())

            message.reply({ embeds: [inventoryEmbed] }).then(async m => {
                await m.react("◀️");
                await m.react("▶️");

                createReactionCollector(m);
            });
        }
    }
}

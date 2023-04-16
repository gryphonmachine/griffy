import {
  CommandInteraction,
  Client,
  ApplicationCommandType,
  TextChannel,
  ApplicationCommandOptionType,
  GuildMember,
} from "discord.js";
import { Command } from "../../lib/Comamnd";

export const Purge: Command = {
  name: "purge",
  description: "Purge a number of messages (1-100)",
  options: [
    {
      name: "number",
      description: "Amount of messages to delete",
      type: ApplicationCommandOptionType.Number,
      required: true,
    },
  ],
  type: ApplicationCommandType.ChatInput,
  run: async (client: Client, interaction: CommandInteraction) => {
    const numMessages = interaction.options.get("number")?.value as number;
    const { channel, member } = interaction;

    if (member instanceof GuildMember) {
      if (!member.roles.cache.some((role) => role.name.includes("Captain"))) {
        return await interaction.reply(
          "You aren't a captain! You can't run that command."
        );
      }
    }

    if (channel instanceof TextChannel) {
      if (numMessages > 100) {
        return await interaction.reply({
          content: "You cannot delete more than 100 messages at once!",
          ephemeral: true,
        });
      } else {
        await channel?.bulkDelete(numMessages);
        await interaction.reply({
          content: `Successfully deleted ${numMessages} messages!`,
          ephemeral: true,
        });
      }
    }
  },
};

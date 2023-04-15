import {
  CommandInteraction,
  Client,
  ApplicationCommandType,
} from "discord.js";
import { Command } from "../lib/Comamnd";

export const Ping: Command = {
  name: "ping",
  description: "Status of the Bot + Discord API",
  type: ApplicationCommandType.ChatInput,
  run: async (client: Client, interaction: CommandInteraction) => {
    return await interaction.reply({
      content: `Latency is ${
        Date.now() - interaction.createdTimestamp
      }ms. API Latency is ${Math.round(client.ws.ping)}ms.`,
    });
  },
};

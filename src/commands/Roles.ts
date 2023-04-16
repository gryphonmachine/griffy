import {
  CommandInteraction,
  Client,
  ApplicationCommandType,
  ApplicationCommandOptionType,
  GuildMember,
  EmbedBuilder,
} from "discord.js";
import { Command } from "../lib/Comamnd";
import { roleChoices } from "../lib/choices/roles";

const embed = new EmbedBuilder().setColor("#fbbb04").setTimestamp();
;

export const Roles: Command = {
  name: "roles",
  description: "Select the department that you're on",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "role",
      description: "Choose your department",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: roleChoices,
    },
    {
      name: "type",
      description: "Add or remove the role",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        {
          name: "Add",
          value: "add",
        },
        {
          name: "Remove",
          value: "remove",
        },
      ],
    },
  ],
  run: async (client: Client, interaction: CommandInteraction) => {
    const role = interaction.options.get("role");
    const type = interaction.options.get("type")?.value;
    const { member } = interaction;

    if (member instanceof GuildMember) {
      const roleId = role?.value as string;
      const roleName = member.guild.roles.cache.get(roleId)?.name;

      switch (type) {
        case "add":
          if (member.roles.cache.has(roleId)) {
            return await interaction.reply({
              embeds: [
                embed
                  .setTitle("ERROR")
                  .setDescription(
                    `Uh oh! Looks like you already have that role, **${interaction.user.username}**!`
                  ),
              ],
            });
          } else {
            member.roles.add(roleId);

            await interaction.reply({
              embeds: [
                embed
                  .setTitle("SUCCESS")
                  .setDescription(
                    `Welcome to the **${roleName} Department**, ${interaction.user.username}!`
                  ),
              ],
            });
          }

          break;

        case "remove":
          if (!member.roles.cache.has(roleId)) {
            return await interaction.reply({
              embeds: [
                embed
                  .setTitle("ERROR")
                  .setDescription(
                    `Uh oh! Looks like you don't have that role, **${interaction.user.username}**!`
                  ),
              ],
            });
          } else {
            member.roles.remove(roleId);
            await interaction.reply({
              embeds: [
                embed
                  .setTitle("SUCCESS")
                  .setDescription(
                    `Removed you from the **${roleName} Department**, ${interaction.user.username}.`
                  ),
              ],
            });
          }

          break;
      }
    }
  },
};

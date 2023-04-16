import {
  CommandInteraction,
  Client,
  ApplicationCommandType,
  ApplicationCommandOptionType,
  EmbedBuilder,
  codeBlock,
} from "discord.js";
import { Command } from "../lib/Comamnd";
import fetch from "node-fetch";
import { eventChoices, yearChoices } from "../lib/choices/events";

export const Event: Command = {
  name: "comp",
  description: "Find details about our competitions",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "name",
      description: "The event name (ex. mcmaster)",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: eventChoices,
    },
    {
      name: "year",
      description: "The year of the event (ex. 2018)",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: yearChoices,
    },
  ],
  run: async (client: Client, interaction: CommandInteraction) => {
    const event = interaction.options.get("name")?.value;
    const year = interaction.options.get("year")?.value;

    const nonDistrictEvents = ["worlds", "provincials"];

    await fetch(`https://frc6070.ca/api/${year}/${event}`)
      .then(async (res) => {
        const data = await res.json();

        const embed = new EmbedBuilder()
          .setColor("#fbbb04")
          .setTitle(
            `${year} ${
              String(event).charAt(0).toUpperCase() + String(event).slice(1)
            } ${
              nonDistrictEvents.some((v) => String(event).includes(v))
                ? "Event"
                : "District Event"
            }`
          )
          .setTimestamp();

        data.forEach((match: any) => {
          const team6070 = match.teams.filter(
            (team: any) => team.teamNumber == "6070"
          );
          const alliance = team6070[0].station.replace(/[0-9]/g, "");

          const didWeWin = () => {
            if (
              match.scoreRedFinal > match.scoreBlueFinal &&
              alliance === "Red"
            ) {
              return true;
            } else if (
              match.scoreBlueFinal > match.scoreRedFinal &&
              alliance === "Blue"
            ) {
              return true;
            } else {
              return false;
            }
          };

          const firstAllianceFilter = match.teams.filter((team: any) => {
            return team.station.includes(
              team6070[0].station.replace(/[0-9]/g, "")
            );
          });

          const secondAllianceFilter = firstAllianceFilter.map((team: any) => {
            return team.teamNumber;
          });

          embed.addFields({
            name: `${didWeWin() ? "🏆" : ""} ${match.description}`,
            value: `[${alliance}] **Alliance:** ${secondAllianceFilter
              .toString()
              .replace(/,/g, ", ")}`,
            inline: true,
          });
        });

        return await interaction.reply({
          embeds: [embed],
        });
      })
      .catch(async (error) => {
        return await interaction.reply(codeBlock("ts", error));
      });
  },
};

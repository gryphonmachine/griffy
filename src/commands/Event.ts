import {
  CommandInteraction,
  Client,
  ApplicationCommandType,
  ApplicationCommandOptionType,
  EmbedBuilder,
} from "discord.js";
import { Command } from "../lib/Comamnd";
import fetch from "node-fetch";
import { eventChoices, yearChoices } from "../lib/choices/events";
import { isEqual } from "lodash";

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
    let invalidEvent = false;
    const qualMatches = await fetch(
      `https://frc6070.ca/api/${year}/${event}`
    ).then(async (res) => {
      if (res.status === 200) {
        invalidEvent = false;
        return res.json();
      } else {
        return (invalidEvent = true);
      }
    });

    const playoffMatches = await fetch(
      `https://frc6070.ca/api/${year}/${event}?type=Playoff`
    ).then((res) => {
      if (res.status === 200) {
        invalidEvent = false;
        return res.json();
      } else {
        return (invalidEvent = true);
      }
    });

    if (invalidEvent) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#fbbb04")
            .setTitle("ERROR")
            .setDescription("Uh oh! Looks like that event **doesn't exist.**")
            .setTimestamp(),
        ],
      });
    }

    const didWeWin = (match: any, alliance: any) => {
      if (match.scoreRedFinal > match.scoreBlueFinal && alliance === "Red") {
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

    const qualEmbed = new EmbedBuilder()
      .setColor("#fbbb04")
      .setTitle(
        `${year} ${
          String(event).charAt(0).toUpperCase() + String(event).slice(1)
        } ${
          nonDistrictEvents.some((v) => String(event).includes(v))
            ? "Event"
            : "District Event"
        } (Qualifications)`
      )
      .setTimestamp();

    const playoffEmbed = new EmbedBuilder()
      .setColor("#fbbb04")
      .setTitle(
        `${year} ${
          String(event).charAt(0).toUpperCase() + String(event).slice(1)
        } ${
          nonDistrictEvents.some((v) => String(event).includes(v))
            ? "Event"
            : "District Event"
        } (Playoffs)`
      )
      .setTimestamp();

    if (isEqual(qualMatches, playoffMatches)) {
      qualMatches.forEach(async (match: any) => {
        const team6070 = match.teams.filter(
          (team: any) => team.teamNumber == "6070"
        );
        const alliance = team6070[0].station.replace(/[0-9]/g, "");

        const firstAllianceFilter = match.teams.filter((team: any) => {
          return team.station.includes(
            team6070[0].station.replace(/[0-9]/g, "")
          );
        });

        const secondAllianceFilter = firstAllianceFilter.map((team: any) => {
          return team.teamNumber;
        });

        qualEmbed.addFields({
          name: `${didWeWin(match, alliance) ? "🏆" : ""} ${match.description}`,
          value: `[${alliance}] **Alliance:** ${secondAllianceFilter
            .toString()
            .replace(/,/g, ", ")}`,
          inline: true,
        });
      });

      return interaction.reply({ embeds: [qualEmbed] });
    } else {
      qualMatches.forEach(async (match: any) => {
        const team6070 = match.teams.filter(
          (team: any) => team.teamNumber == "6070"
        );
        const alliance = team6070[0].station.replace(/[0-9]/g, "");

        const firstAllianceFilter = match.teams.filter((team: any) => {
          return team.station.includes(
            team6070[0].station.replace(/[0-9]/g, "")
          );
        });

        const secondAllianceFilter = firstAllianceFilter.map((team: any) => {
          return team.teamNumber;
        });

        qualEmbed.addFields({
          name: `${didWeWin(match, alliance) ? "🏆" : ""} ${match.description}`,
          value: `[${alliance}] **Alliance:** ${secondAllianceFilter
            .toString()
            .replace(/,/g, ", ")}`,
          inline: true,
        });
      });

      playoffMatches.forEach(async (match: any) => {
        const team6070 = match.teams.filter(
          (team: any) => team.teamNumber == "6070"
        );
        const alliance = team6070[0].station.replace(/[0-9]/g, "");

        const firstAllianceFilter = match.teams.filter((team: any) => {
          return team.station.includes(
            team6070[0].station.replace(/[0-9]/g, "")
          );
        });

        const secondAllianceFilter = firstAllianceFilter.map((team: any) => {
          return team.teamNumber;
        });

        playoffEmbed.addFields({
          name: `${didWeWin(match, alliance) ? "🏆" : ""} ${match.description}`,
          value: `[${alliance}] **Alliance:** ${secondAllianceFilter
            .toString()
            .replace(/,/g, ", ")}`,
          inline: true,
        });
      });

      return await interaction.reply({ embeds: [qualEmbed, playoffEmbed] });
    }
  },
};

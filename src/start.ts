import { Client, ActivityType } from "discord.js";
import interactionCreate from "./lib/interactionCreate";
import { Commands } from "./commands";
require("dotenv").config();

console.log("Bot is starting...");

const client = new Client({
  intents: [],
});

client.on("ready", async () => {
  await client.application?.commands.set(Commands);
  console.log(`Logged in as ${client.user?.tag}!`);

  client.user?.setPresence({
    activities: [{ name: `frc6070.ca`, type: ActivityType.Watching }],
    status: "online",
  });
});

interactionCreate(client);
client.login(String(process.env.CLIENT_TOKEN));

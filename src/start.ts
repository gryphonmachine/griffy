import {
  Client,
  ActivityType,
  GatewayIntentBits,
} from "discord.js";
import interactionCreate from "./lib/interactionCreate";
import { Commands } from "./commands";
require("dotenv").config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.on("ready", async () => {
  await client.application?.commands.set(Commands);
  console.log(`SUCCESS: Logged in as ${client.user?.tag}!`);

  client.user?.setPresence({
    activities: [{ name: `frc6070.ca`, type: ActivityType.Watching }],
    status: "online",
  });
});

client.on("guildMemberAdd", (member) => {
  member.roles.add("1096897903764705475");
});

interactionCreate(client);
client.login(String(process.env.CLIENT_TOKEN));

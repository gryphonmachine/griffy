import { Command } from "../lib/Comamnd";
import { Ping } from "./Ping";
import { Event } from "./Event";
import { Roles } from "./Roles";
import { Purge } from "./admin/Purge";

export const Commands: Command[] = [Ping, Event, Roles, Purge];

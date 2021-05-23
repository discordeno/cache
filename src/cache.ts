export const cache = {
  channels: new Map<bigint, Channel>(),
  guilds: new Map<bigint, Guild & { shardId: number }>(),
  members: new Map<bigint, (GuildMemberWithUser & { guildId: string })[]>(),
  messages: new Map<bigint, Message>(),
  unavailableGuilds: new Map<bigint, number>(),
};

export type CacheTableNames = "channels" | "guilds" | "members" | "messages" | "unavailableGuilds";
import { cache, CacheTableNames } from "./cache.ts";

export default function set(table: CacheTableNames, key: string, payload: unknown) {
  return cache[table].set(BigInt(key), payload);
}

import { cache, CacheTableNames } from "./cache.ts";

export default function forEach(
  table: CacheTableNames,
  // deno-lint-ignore no-explicit-any
  callback: (value: any, key: bigint, map: Map<bigint, any>) => unknown
) {
  return cache[table].forEach(callback);
}

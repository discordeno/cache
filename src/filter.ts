import { cache, CacheTableNames } from "./cache.ts";

export default function forEach(
  table: CacheTableNames,
  // deno-lint-ignore no-explicit-any
  callback: (value: any, key: bigint) => boolean
) {
  const relevant = new Map();

  cache[table].forEach((value, key) => {
    if (callback(value, key)) relevant.set(key, value);
  });

  return relevant;
}

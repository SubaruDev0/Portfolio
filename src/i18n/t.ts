import { Dictionary } from './dictionaries';

function hasOwn(obj: object, key: string) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

type StringLeafKeyPath<T> = {
  [K in Extract<keyof T, string>]: T[K] extends string
    ? K
    : T[K] extends Record<string, unknown>
      ? `${K}.${StringLeafKeyPath<T[K]>}`
      : never;
}[Extract<keyof T, string>];

export function t(dictionary: Dictionary, path: StringLeafKeyPath<Dictionary>, fallback = ''): string {
  const segments = path.split('.').filter(Boolean);
  let current: unknown = dictionary;

  for (const segment of segments) {
    if (typeof current === 'object' && current !== null && hasOwn(current, segment)) {
      current = (current as Record<string, unknown>)[segment];
      continue;
    }
    return fallback;
  }

  return typeof current === 'string' ? current : fallback;
}

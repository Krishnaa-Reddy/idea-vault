// validators.utils.ts
export const FULL_URL_REGEX = /^https?:\/\/[^\s]+$/i;     // must be ONLY a URL
export const URL_FRAGMENT_REGEX = /(https?:\/\/[^\s]+)/i; // detect URL substring

export function isFullUrl(value: string): boolean {
  return FULL_URL_REGEX.test(value.trim());
}

export function containsUrl(value: string): boolean {
  return URL_FRAGMENT_REGEX.test(value.trim());
}
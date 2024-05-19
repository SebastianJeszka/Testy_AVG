export function normalizeString(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // replacing "ąęóćśźżń" with "aeocszzn"
    .replace(/\u0142/g, 'l') // replacing "ł" with "l"
    .replace(/[^a-z0-9]/g, ' ')
    .trim()
    .replace(/\s+/g, '_')
    .substring(0, 100);
}

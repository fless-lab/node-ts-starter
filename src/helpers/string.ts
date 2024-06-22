export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

export const escapeRegex = (text: string): string => {
  return text.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
};

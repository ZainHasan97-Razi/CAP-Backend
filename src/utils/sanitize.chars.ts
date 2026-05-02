const CHAR_MAP: Record<string, string> = {
  '\u2018': "'", // left single quotation mark
  '\u2019': "'", // right single quotation mark
  '\u201A': "'", // single low-9 quotation mark
  '\u201B': "'", // single high-reversed-9 quotation mark
  '\u201C': '"', // left double quotation mark
  '\u201D': '"', // right double quotation mark
  '\u201E': '"', // double low-9 quotation mark
  '\u201F': '"', // double high-reversed-9 quotation mark
  '\u2013': '-', // en dash
  '\u2014': '-', // em dash
  '\u2026': '...', // horizontal ellipsis
  '\u00A0': ' ', // non-breaking space
  '\uFFFD': "'", // replacement character (corrupted encoding, most likely was a quote)
};

const CHAR_REGEX = new RegExp(Object.keys(CHAR_MAP).join('|'), 'g');

export const sanitizeSpecialChars = (value: string): string => {
  if (!value) return value;
  return value.replace(CHAR_REGEX, (char) => CHAR_MAP[char] ?? char);
};

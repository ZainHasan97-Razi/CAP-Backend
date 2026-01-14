export const parseControlId = (id: string) => {
  const match = id.match(/^([A-Z]+)-?(\d+)\.(\d+)$/);
  if (!match) return { prefix: id, major: 0, minor: 0 };
  return { prefix: match[1], major: parseInt(match[2]), minor: parseInt(match[3]) };
};

export const sortControlsByControlId = <T extends { controlId: string }>(controls: T[]): T[] => {
  return controls.sort((a, b) => {
    const aParts = parseControlId(a.controlId);
    const bParts = parseControlId(b.controlId);
    
    if (aParts.prefix !== bParts.prefix) return aParts.prefix.localeCompare(bParts.prefix);
    if (aParts.major !== bParts.major) return aParts.major - bParts.major;
    return aParts.minor - bParts.minor;
  });
};

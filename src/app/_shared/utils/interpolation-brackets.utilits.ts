const BOUND_FIELD_REGEX = /\{{[^\{^\}]+\}}/g;

export function trimBoundFieldTemplates(title: string) {
  const matchedTechNames = title.match(BOUND_FIELD_REGEX);
  if (matchedTechNames) {
    return matchedTechNames.reduce((trimmedTitle: string, currentMatch: string) => {
      return trimmedTitle.replace(currentMatch, '');
    }, title);
  }
  return title;
}

export function ifStringWithInterpolationBrackets(value: string) {
  return value?.match(BOUND_FIELD_REGEX);
}

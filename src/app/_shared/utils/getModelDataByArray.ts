export function getModelDataByArray(path: string[], obj: object) {
  // given: path: array with path to expected key, obj: object with expected key
  return path.length - 1 == 0 ? { model: obj, key: path[0] } : getModelDataByArray(path.slice(1), obj[path[0]]);
}

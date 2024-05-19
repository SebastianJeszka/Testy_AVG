const uuidV4Length = 36;
export function checkIfIdIsUuidV4(id: any): boolean {
  if (!id) return;
  return typeof id === 'string' && id.length === uuidV4Length;
}

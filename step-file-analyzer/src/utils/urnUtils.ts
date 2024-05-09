export function createUrn(bucketKey: string, objectName: string) {
  const objectId = `urn:adsk.objects:os.object:${bucketKey}/${objectName}`;
  const base64Urn = btoa(objectId).replace(/=/g, ""); // Encode and remove '='
  return base64Urn;
}

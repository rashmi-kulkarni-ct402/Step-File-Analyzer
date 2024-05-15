/*
 * Uitlity Function
 * Creates a Base64-encoded URN (Uniform Resource Name) from a bucket key and object name.
 */

export function createUrn(bucketKey: string, objectName: string) {
  // Concatenate the bucket key and object name to form the full object ID in the expected format
  const objectId = `urn:adsk.objects:os.object:${bucketKey}/${objectName}`;
  // Encode the object ID into Base64 format and remove '='
  const base64Urn = btoa(objectId).replace(/=/g, "");
  return base64Urn;
}

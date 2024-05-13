export const getMetadata = async (token: string, urn: string) => {
  const url = `https://developer.api.autodesk.com/modelderivative/v2/designdata/${urn}/metadata`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return null;
  }
};

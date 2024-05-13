export const getProperties = async (
  token: string,
  urn: string,
  modelGuid: string
) => {
  const url = `https://developer.api.autodesk.com/modelderivative/v2/designdata/${urn}/metadata/${modelGuid}/properties`;

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
    console.log("extract metadata properties ", data);
    return data;
  } catch (error) {
    console.error("extract Error fetching metadata:", error);
    return null;
  }
};

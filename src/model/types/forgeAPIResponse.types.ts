export type PropertiesDataCollection = {
  objectid: number;
  name: string;
  externalID: string;
  properties: any;
};

export type PropertiesData = {
  type: string;
  collection: PropertiesDataCollection[];
};

export type ModelPropertiesResponse = {
  data: PropertiesData;
};

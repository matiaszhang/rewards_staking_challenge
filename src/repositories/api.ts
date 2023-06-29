import { get as httpGet, post as httpPost } from "./driver/http";

const serverBaseUrl = process.env.REACT_APP_SERVER_BASE_URL;

export const saveCSV = async (csv: string) => {
  return await httpPost(`${serverBaseUrl}/save`, { data: csv });
};

export const getStatus = async (id: string) => {
  return await httpGet(`${serverBaseUrl}/get-status?id=${id}`);
};

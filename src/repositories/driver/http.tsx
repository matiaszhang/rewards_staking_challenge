import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export const get = async (url: string, config?: AxiosRequestConfig<any>): Promise<AxiosResponse<any, any>> => {
  try {
    const response = await axios.get(url, config);
    return response;
  } catch (err: any) {
    return err;
  }
};

export const post = async (url: string, body: any, config?: AxiosRequestConfig<any>) => {
  try {
    const response = await axios.post(url, body, config);
    return response;
  } catch (err: any) {
    return err;
  }
};

export const remove = async (url: string, config?: AxiosRequestConfig<any>) => {
  try {
    const response = await axios.delete(url, config);
    return response;
  } catch (err: any) {
    return err;
  }
};
``;

export const put = async (url: string, body: any, config?: AxiosRequestConfig<any>) => {
  try {
    const response = await axios.put(url, body, config);
    return response;
  } catch (err: any) {
    return err;
  }
};

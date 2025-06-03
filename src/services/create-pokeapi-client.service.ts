import axios, { AxiosInstance } from "axios";

export function createPokeApiClient(): AxiosInstance {
  const instance = axios.create();

  instance.interceptors.request.use(
    async (config) => {
      // add common interceptor logic here.

      return config;
    },
    (error) => {
      // Log error responses
      console.log(error);
    }
  );

  instance.interceptors.response.use(
    async (response) => {
      // add common interceptor logic here.
      return response;
    },
    (error) => {
      // Log error responses
      console.log(error);
    }
  );

  return instance;
}

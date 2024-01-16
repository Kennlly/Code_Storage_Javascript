import Axios from "axios";
import Https from "node:https";
import LOGGER from "./winstonConfig.js";

const buildAxiosInstance = () => {
   const funcName = "[buildAxiosInstance Func]";
   try {
      const instance = Axios.create({
         timeout: 10000,
         httpsAgent: new Https.Agent({ rejectUnauthorized: false }),
      });

      // intercepting to capture errors
      instance.interceptors.response.use(
         (response) => {
            const {
               status,
               statusText,
               config: { method },
               data,
            } = response;

            switch (method) {
               case "get":
               case "post":
                  return data;
               case "delete":
                  if (status < 200 || status >= 300) {
                     LOGGER.warn(
                        `${funcName} - Unexpected Response: Response Code = ${status}; Status Text = ${statusText}; Method = ${method}`,
                     );
                  }

                  return true;
               default:
                  LOGGER.warn(`${funcName} - Unknown REST Method: ${method} ERROR!`);
                  return true;
            }
         },
         (error) => {
            const errResponse = error["response"];

            if (!errResponse) return Promise.reject(error.toString());

            const {
               data: { message },
               status,
               statusText,
            } = error["response"];

            return Promise.reject({ responseCode: status, statusText, description: message });
         },
      );

      return instance;
   } catch (err) {
      throw new Error(`${funcName} Catching ERROR - ${err.toString()}`);
   }
};

const AxiosConfig = buildAxiosInstance();
export default AxiosConfig;

import Axios from "axios";
import Https from "node:https";
import Logger from "./winstonConfig.js";

const buildAxiosInstance = () => {
   try {
      const instance = Axios.create({
         timeout: 3000,
         httpsAgent: new Https.Agent({ rejectUnauthorized: false }),
      });

      // intercepting to capture errors
      instance.interceptors.response.use(
         (response) => response["data"],
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
      Logger.error(`[buildAxiosInstance Func] Catching ERROR - ${err}`);
      return false;
   }
};

const AxiosConfig = buildAxiosInstance();
export default AxiosConfig;

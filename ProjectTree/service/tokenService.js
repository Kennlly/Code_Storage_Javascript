import Axios from "axios";
import { GENESYS_CLIENT_ID, GENESYS_CLIENT_SECRET } from "../utils/constants.js";
import { setTimeout } from "timers/promises";
import LOGGER from "../config/winstonConfig.js";

export default async function fetchToken() {
   const funcName = "[tokenService Func]";

   const apiEndpoint = "https://login.cac1.pure.cloud/oauth/token";

   let retryCounter = 1;

   while (retryCounter <= 3) {
      try {
         const response = await Axios({
            method: "POST",
            url: apiEndpoint,
            params: {
               grant_type: "client_credentials",
            },
            headers: {
               "Content-Type": "application/x-www-form-urlencoded",
               Authorization: `Basic ${Buffer.from(GENESYS_CLIENT_ID + ":" + GENESYS_CLIENT_SECRET).toString("base64")}`,
            },
         });

         const { data, status, statusText } = response;

         if (status === 200) return data;

         if (status === 429) {
            // Known issue - Calling API too frequently
            await setTimeout(60000);
         } else {
            LOGGER.error(
               `${funcName} - Response code = ${status}; Error Msg = ${statusText}. Retrying on ${retryCounter} / 3.`,
            );

            if (retryCounter === 3) break;

            await setTimeout(10000 * retryCounter);
            retryCounter++;
         }
      } catch (err) {
         const errResponse = err["response"];

         if (!errResponse) {
            LOGGER.error(`${funcName} - ${err.toString()}`);
         } else {
            const {
               data: { message },
               status,
               statusText,
            } = err["response"];
            LOGGER.error(`${funcName} - Response Code = ${status}. Status Text = ${statusText}. Description: ${message}`);
         }

         if (retryCounter === 3) break;

         await setTimeout(10000 * retryCounter);
         retryCounter++;
      }
   }

   LOGGER.error(`${funcName} - ERROR after 3 times retries!`);
   return false;
}

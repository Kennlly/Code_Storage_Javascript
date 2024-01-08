import Axios from "axios";
import { GENESYS_CLIENT_ID, GENESYS_CLIENT_SECRET } from "../utils/constants.js";
import { setTimeout } from "timers/promises";
import { Logger } from "../config/winstonConfig.js";

export default async function fetchToken() {
   const funcName = "[fetchToken Func]";

   // const apiEndpoint = "https://login.usw2.pure.cloud/oauth/token";
   // OR
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
               // Authorization: `Basic ${basicToken}`,
               // OR
               Authorization: `Basic ${Buffer.from(GENESYS_CLIENT_ID + ":" + GENESYS_CLIENT_SECRET).toString("base64")}`,
            },
         });

         const { data, status, statusText } = response;

         if (status === 200) return data;

         if (status === 429) {
            // Known issue - Calling API too frequently
            await setTimeout(60000);
         } else {
            Logger.error(
               `${funcName} - Response code = ${status}; Error Msg = ${statusText}. Retrying on ${retryCounter} / 3.`,
            );

            if (retryCounter === 3) break;

            await setTimeout(10000 * retryCounter);
            retryCounter++;
         }
      } catch (err) {
         const errResponse = err["response"];

         if (!errResponse) {
            Logger.error(`${funcName} - ${err.toString()}`);
         } else {
            const {
               data: { message },
               status,
               statusText,
            } = err["response"];
            Logger.error(`${funcName} - Response Code = ${status}. Status Text = ${statusText}. Description: ${message}`);
         }

         if (retryCounter === 3) break;

         await setTimeout(10000 * retryCounter);
         retryCounter++;
      }
   }

   Logger.error(`${funcName} - ERROR after 3 times retries!`);
   return false;
}

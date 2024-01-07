import fetch from "node-fetch";
import { generalLogger } from "../ProjectTree/config/winstonConfig.js";
import { setTimeout } from "timers/promises";
import { GENESYS_CLIENT_ID, GENESYS_CLIENT_SECRET } from "../ProjectTree/utils/constants.js";

export default async function fetchToken() {
   const params = new URLSearchParams();
   params.append("grant_type", "client_credentials");
   // const apiEndpoint = "https://login.usw2.pure.cloud/oauth/token";
   // OR
   const apiEndpoint = "https://login.cac1.pure.cloud/oauth/token";

   let retryCounter = 1;
   while (retryCounter <= 3) {
      try {
         const response = await fetch(apiEndpoint, {
            method: "POST",
            body: params,
            headers: {
               "Content-Type": "application/x-www-form-urlencoded",
               // Authorization: `Basic ${basicToken}`,
               // OR
               Authorization: `Basic ${Buffer.from(GENESYS_CLIENT_ID + ":" + GENESYS_CLIENT_SECRET).toString("base64")}`,
            },
         });

         const isSucceed = response.ok;
         const jsonResponse = await response.json();

         if (isSucceed) return jsonResponse;

         const responseCode = response["status"];
         const errorMsg = jsonResponse["description"];

         if (responseCode === 429) {
            // Known issue - Calling apis too frequently
            await setTimeout(60000);
         } else {
            generalLogger.error(
               `fetchToken Func - Response code = ${responseCode}; Error Msg = ${errorMsg}. Retrying on ${retryCounter}.`,
            );
            if (retryCounter === 3) break;

            await setTimeout(10000 * retryCounter);
            retryCounter++;
         }
      } catch (err) {
         generalLogger.error(`fetchToken Func ${err}. Retrying on ${retryCounter}.`);
         if (retryCounter === 3) break;

         await setTimeout(10000 * retryCounter);
         retryCounter++;
      }
   }

   generalLogger.error(`fetchToken Func ERROR after ${retryCounter} times retries!`);
   return false;
}

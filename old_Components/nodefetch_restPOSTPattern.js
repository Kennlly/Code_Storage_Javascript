//npm node-fetch
import fetch from "node-fetch";
import { LOGGER } from "../ProjectTree/config/winstonConfig.js";
import { setTimeout } from "timers/promises";
import getToken from "../ProjectTree/controllers/getToken.js";

export default async function restPOSTPattern(apiEndpoint, apiQueryBody) {
   const funcNote = `apiEndpoint = ${apiEndpoint}, apiQueryBody = ${JSON.stringify(apiQueryBody)}`;

   let retryCounter = 1;
   while (true) {
      try {
         // Ensure token is valid
         const genesysToken = await getToken();
         if (genesysToken === false) {
            Logger.error("restPOSTPattern Func - Genesys token validation ERROR!");
            return false;
         }

         const response = await fetch(apiEndpoint, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${genesysToken}`,
            },
            body: JSON.stringify(apiQueryBody),
         });

         const isSucceed = response.ok;
         const jsonResponse = await response.json();

         if (isSucceed) return jsonResponse;

         const responseCode = response["status"];
         const errorMsg = jsonResponse["message"];
         if (responseCode === 429) {
            // Known issue - Calling apis too frequently
            await setTimeout(60000);
         } else {
            Logger.error(
               `restPOSTPattern Func - Response code = ${responseCode}; Error Msg = ${errorMsg}. Retrying on ${retryCounter}.`,
            );
            if (retryCounter === 3) break;

            await setTimeout(10000 * retryCounter);
            retryCounter++;
         }
      } catch (err) {
         Logger.error(`restPOSTPattern Func ${err}. Retrying on ${retryCounter}.`);
         if (retryCounter === 3) break;

         await setTimeout(10000 * retryCounter);
         retryCounter++;
      }
   }

   Logger.error(`restPOSTPattern Func ERROR after ${retryCounter} times retries! ${funcNote}`);
   return false;
}

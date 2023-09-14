import fetch from "node-fetch";
import { setTimeout } from "timers/promises";
import { generalLogger } from "../../utils/loggerConfig.js";
import getValidToken from "../../controllers/getValidToken.js";

export default async function restGETPattern(apiEndpoint) {
   const funcNote = `ApiEndpoint = ${apiEndpoint}`;

   let retryCounter = 1;
   while (true) {
      try {
         // Ensure token is valid
         const genesysToken = await getValidToken();
         if (genesysToken === false) {
            generalLogger.error(`restGETPattern Func - Genesys token validation ERROR!`);
            return false;
         }

         const response = await fetch(apiEndpoint, {
            method: "GET",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${genesysToken}`,
            },
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
            generalLogger.error(
               `restGETPattern Func - Response code = ${responseCode}; Error Msg = ${errorMsg}. Retrying on ${retryCounter}.`
            );
            if (retryCounter === 3) break;

            await setTimeout(10000 * retryCounter);
            retryCounter++;
         }
      } catch (err) {
         generalLogger.error(`restGETPattern Func ${err}. Retrying on ${retryCounter}.`);
         if (retryCounter === 3) break;

         await setTimeout(10000 * retryCounter);
         retryCounter++;
      }
   }

   generalLogger.error(`restGETPattern Func ERROR after ${retryCounter} times retries! ${funcNote}`);
   return false;
}

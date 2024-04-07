import { GENESYS_CLIENT_ID, GENESYS_CLIENT_SECRET, INFO_FOLDER } from "./contants.js";
import { setTimeout } from "timers/promises";
import axios from "axios";
import LOGGER from "../config/winstonConfig.js";
import { readFile, writeFile } from "./fileManagement.js";

const fetchToken = async () => {
   const funcName = "[fetchToken Func]";

   const apiEndpoint = "https://login.cac1.pure.cloud/oauth/token";

   let retryCounter = 1;

   while (retryCounter <= 3) {
      try {
         const response = await axios({
            method: "POST",
            url: apiEndpoint,
            params: {
               grant_type: "client_credentials"
            },
            headers: {
               "Content-Type": "application/x-www-form-urlencoded",
               Authorization: `Basic ${Buffer.from(GENESYS_CLIENT_ID + ":" + GENESYS_CLIENT_SECRET).toString("base64")}`
            }
         });

         return response["data"];
      } catch (err) {
         const errResponse = err["response"];

         if (!errResponse) {
            LOGGER.error(`${funcName} - ${err.toString()}`);
         } else {
            const {
               data: { message },
               status,
               statusText
            } = errResponse;
            LOGGER.error(`${funcName} - Response Code = ${status}. Status Text = ${statusText}. Description: ${message}`);
         }

         if (retryCounter === 3) throw new Error(`${funcName} - ERROR after 3 times retries!`);

         await setTimeout(10000 * retryCounter);
         retryCounter++;
      }
   }
};

export default async function getValidToken() {
   const funcName = "[getValidToken Func]";
   const filePath = `${INFO_FOLDER}genesysToken`;

   try {
      // Get token from local file
      let localTokenInfo = await readFile(filePath, "json");

      if (JSON.stringify(localTokenInfo) === "{}") localTokenInfo = await fetchToken();

      await writeFile(filePath, "json", localTokenInfo);

      return localTokenInfo["access_token"];
   } catch (err) {
      throw new Error(`${funcName} Catching ERROR - ${err}.`);
   }
}

// const result = await getValidToken();
// console.log("result - ", result);

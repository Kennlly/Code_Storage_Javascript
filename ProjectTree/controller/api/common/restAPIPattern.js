import { GENESYS_ENDPOINT_URL, INFO_FOLDER } from "../../../utils/constants.js";
import getValidToken from "./getValidToken.js";
import { setTimeout } from "timers/promises";
import LOGGER from "../../../config/winstonConfig.js";
import AxiosConfig from "../../../config/axiosConfig.js";
import { deleteFile } from "../../../utils/fileManagement.js";

export default async function restAPIPattern(requestMethod, endpoint, params, queryBody) {
   const funcName = "[restAPIPattern Func]";
   const funcArgus = `[Rest Method = ${requestMethod}; API Endpoint = ${endpoint}; Params = ${JSON.stringify(
      params,
   )}; Query body = ${JSON.stringify(queryBody)}]`;

   const request = {
      method: requestMethod,
      baseURL: GENESYS_ENDPOINT_URL,
      headers: { "Content-Type": "application/json" },
      url: endpoint,
   };

   if (requestMethod === "GET" && params) request.params = params;

   if (requestMethod === "POST") request.data = queryBody;

   let retryCounter = 1;

   while (true) {
      try {
         // Ensure Genesys Token is valid
         const genesysToken = await getValidToken();

         request.headers.Authorization = `Bearer ${genesysToken}`;

         return await AxiosConfig(request);
      } catch (err) {
         const { responseCode, statusText, description } = err;

         if (!responseCode) {
            LOGGER.error(`${funcName} ${funcArgus} - ${err}`);
            return false;
         }

         if (responseCode === 429) {
            // Known issue - Calling apis too frequently
            await setTimeout(60000);
         } else {
            let fullErrMsg = `Response Code = ${responseCode}; Status Text = ${statusText}`;
            if (description) fullErrMsg += `; Description = ${description}`;

            LOGGER.error(`${funcName} - ${fullErrMsg}. Retrying on ${retryCounter} / 3.`);

            switch (responseCode) {
               case 400:
                  // No need to retry
                  return false;
               case 401:
                  await deleteFile(`${INFO_FOLDER}genesysToken.json`);
                  break;
               default:
                  break;
            }

            if (retryCounter === 3) break;

            await setTimeout(10000 * retryCounter);
            retryCounter++;
         }
      }
   }

   LOGGER.error(`${funcName} ${funcArgus} - ERROR After 3 Times Retries!`);
   return false;
}

// const get = await restAPIPattern("GET", "/api/v2/users", { pageSize: 500, pageNumber: 2 }, null);
// console.log("getResult", get);
//
// const post = await restAPIPattern("POST", "/api/v2/analytics/conversations/details/query", null, {
//    interval: "2023-03-06T05:00Z/2023-03-08T05:00Z"
// });
// console.log("postResult", post);

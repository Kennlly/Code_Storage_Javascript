import { GENESYS_ENDPOINT_URL } from "../../utils/constants.js";
import getToken from "../../controllers/getToken.js";
import { setTimeout } from "timers/promises";
import { Logger } from "../../config/winstonConfig.js";
import AxiosConfig from "../../config/axiosConfig.js";

export default async function restAPIService(requestMethod, endpoint, params, queryBody) {
   const funcName = "[restAPIService Func]";
   const funcArgus = `[Rest Method = ${requestMethod}; API Endpoint = ${endpoint}; Params = ${JSON.stringify(
      params,
   )}; Query body = ${queryBody}]`;

   if (AxiosConfig === false) {
      Logger.error(`${funcName} - Axios Configuration ERROR!`);
      return false;
   }

   const request = {
      method: requestMethod,
      baseURL: GENESYS_ENDPOINT_URL,
      headers: { "Content-Type": "application/json" },
      url: endpoint,
   };

   // Ensure Genesys Token is valid
   const genesysToken = await getToken();
   if (genesysToken === false) {
      Logger.error(`${funcName} ${funcArgus} - Get Genesys Token ERROR!`);
      return false;
   }
   request.headers.Authorization = `Bearer ${genesysToken}`;

   switch (requestMethod) {
      case "GET":
         if (params) request.params = params;
         break;
      case "POST":
         request.data = queryBody;
         break;
      default:
         Logger.error(`${funcName} ${funcArgus} - Unknown "Request Method"`);
         return false;
   }

   let retryCounter = 1;

   while (true) {
      try {
         return await AxiosConfig(request);
      } catch (err) {
         if (typeof err === "string") {
            Logger.error(`${funcName} ${funcArgus} - ${err}`);
            return false;
         }

         const { responseCode, statusText, description } = err;

         if (responseCode === 429) {
            // Known issue - Calling apis too frequently
            await setTimeout(60000);
         } else {
            let fullErrMsg = `Response Code = ${responseCode}; Status Text = ${statusText}`;
            if (description) fullErrMsg += `; Description = ${description}`;

            Logger.error(`${funcName} - ${fullErrMsg}. Retrying on ${retryCounter} / 3.`);

            if (retryCounter === 3) break;

            await setTimeout(10000 * retryCounter);
            retryCounter++;
         }
      }
   }

   Logger.error(`${funcName} ${funcArgus} - ERROR After 3 Times Retries!`);
   return false;
}

// const get = await restAPIService("GET", "/api/v2/users", { pageSize: 500, pageNumber: 2 }, null);
// console.log("getResult", get);

// const post = await restAPIService("POST", "/api/v2/analytics/conversations/details/query", null, {
//    interval: "2023-03-06T05:00Z/2023-03-08T05:00Z",
// });
// console.log("postResult", post);

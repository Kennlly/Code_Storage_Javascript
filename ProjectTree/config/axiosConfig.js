import Axios from "axios";
import Https from "node:https";
import { setTimeout } from "timers/promises";
import { GENESYS_ENDPOINT_URL, CALABRIO_RTA_ENDPOINT_URL } from "../utils/constants.js";
import { generalLogger } from "../utils/loggerConfig.js";
import getValidToken from "../controllers/getValidToken.js";

Axios.defaults.timeout = 3000;
Axios.defaults.httpsAgent = new Https.Agent({ rejectUnauthorized: false });

// intercepting to capture errors
Axios.interceptors.response.use(
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

export const restAPIService = async (requestMethod, endpoint, params, queryBody) => {
   const funcName = "[restAPIService Func]";
   const funcArgus = `[Rest Method = ${requestMethod}; API Endpoint = ${endpoint}; Params = ${JSON.stringify(
      params,
   )}; Query body = ${queryBody}]`;

   const requestConfig = {
      method: requestMethod,
      baseURL: GENESYS_ENDPOINT_URL,
      headers: { "Content-Type": "application/json" },
      url: endpoint,
   };

   // Ensure Genesys Token is valid
   const genesysToken = await getValidToken();
   if (genesysToken) {
      requestConfig.headers.Authorization = `Bearer ${genesysToken}`;
   }

   switch (requestMethod) {
      case "GET":
         requestConfig.params = params;
         break;
      case "POST":
         requestConfig.data = queryBody;
         break;
      default:
         generalLogger.error(`${funcName} ${funcArgus} - Unknown "Request Method"`);
         return false;
   }

   let retryCounter = 1;

   while (true) {
      try {
         return await Axios(requestConfig);
      } catch (err) {
         if (typeof err === "string") {
            generalLogger.error(`${funcName} ${funcArgus} - ${err}`);
            return false;
         }

         const { responseCode, statusText, description } = err;

         if (responseCode === 429) {
            // Known issue - Calling apis too frequently
            await setTimeout(60000);
         } else {
            let fullErrMsg = `Response Code = ${responseCode}; Status Text = ${statusText}`;
            if (description) fullErrMsg += `; Description = ${description}`;

            generalLogger.error(`${funcName} - ${fullErrMsg}. Retrying on ${retryCounter} / 3.`);

            if (retryCounter === 3) break;

            await setTimeout(10000 * retryCounter);
            retryCounter++;
         }
      }
   }

   generalLogger.error(`${funcName} ${funcArgus} - ERROR After 3 Times Retries!`);
   return false;
};

export const soapAPIService = async (requestMethod, endpoint, soapAction, queryBody) => {
   const funcName = "[soapAPIService Func]";
   const funcArgus = `[Rest Method = ${requestMethod}; API Endpoint = ${endpoint}; Soap Action = ${soapAction}; Query body = ${queryBody}]`;

   let retryCounter = 1;

   const requestConfig = {
      method: requestMethod,
      baseURL: CALABRIO_RTA_ENDPOINT_URL,
      url: endpoint,
      headers: {
         "Content-Type": "text/xml;charset=UTF-8",
         SOAPAction: soapAction,
      },
   };

   switch (requestMethod) {
      case "POST":
         requestConfig.data = queryBody;
         break;
      default:
         generalLogger.error(`${funcName} ${funcArgus} - Unknown "Request Method"`);
         return false;
   }

   while (true) {
      try {
         return await Axios(requestConfig);
      } catch (err) {
         if (typeof err === "string") {
            generalLogger.error(`${funcName} ${funcArgus} - ${err}`);
            return false;
         }

         const { responseCode, statusText, description } = err;

         let fullErrMsg = `Response Code = ${responseCode}; Status Text = ${statusText}`;
         if (description) fullErrMsg += `; Description = ${description}`;

         generalLogger.error(`${funcName} - ${fullErrMsg}. Retrying on ${retryCounter} / 3.`);

         if (retryCounter === 3) break;

         await setTimeout(10000 * retryCounter);
         retryCounter++;
      }
   }

   generalLogger.error(`${funcName} ${funcArgus} - ERROR After 3 Times Retries!`);
   return false;
};

// const get = await restAPIService("GET", "/api/v2/users", { pageSize: 500, pageNumber: 2 }, null);
// console.log("getResult", get);

// const post = await restAPIService("POST", "/api/v2/analytics/conversations/details/query", null, {
//    interval: "2023-03-06T05:00Z/2023-03-08T05:00Z",
// });
// console.log("postResult", post);

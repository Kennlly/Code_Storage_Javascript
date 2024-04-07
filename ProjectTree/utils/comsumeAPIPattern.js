import { setTimeout } from "timers/promises";
import { GENESYS_ENDPOINT_URL, INFO_FOLDER } from "./constants.js";
import axiosConfig from "../config/axiosConfig.js";
import LOGGER from "../config/winstonConfig.js";
import { deleteFile } from "./fileManagement.js";
import getValidToken from "./getValidToken.js";

export default async function consumeAPIPattern(method, url, headers, params, data) {
   const funcName = "[consumeAPIPattern Func]";
   const funcArgus = `[Method = ${method}; URL = ${url}; Headers = ${JSON.stringify(headers)}; Params = ${JSON.stringify(
      params
   )}; Query body = ${JSON.stringify(data)}]`;

   const request = {
      method,
      baseURL: GENESYS_ENDPOINT_URL,
      headers,
      url
   };

   if (method === "GET" && params) request.params = params;

   if (method === "POST") request.data = data;

   let retryCounter = 1;

   while (true) {
      try {
         const token = await getValidToken();
         request.headers.Authorization = `bearer ${token}`;
         
         return await axiosConfig(request);
      } catch (err) {
         const { responseCode, statusText, description } = err;

         // The error is string
         if (!responseCode) throw new Error(`${funcName} ${funcArgus} - ${err}`);

         // The error is customized object
         let fullErrMsg = `Response Code = ${responseCode}; Status Text = ${statusText}`;
         if (description) fullErrMsg += `; Description = ${description}`;

         if (responseCode === 429) {
            // Known issue - Calling apis too frequently
            await setTimeout(60000);
         } else {
            let fullErrMsg = `Response Code = ${responseCode}; Status Text = ${statusText}`;
            if (description) fullErrMsg += `; Description = ${description}`;

            switch (responseCode) {
               case 400:
                  // No need to retry
                  throw new Error(`${funcName} - ${fullErrMsg}.`);
               case 401:
                  await deleteFile(`${INFO_FOLDER}genesysToken.json`);
                  break;
               default:
                  break;
            }

            LOGGER.error(`${funcName} - ${fullErrMsg}. Retrying on ${retryCounter} / 3.`);

            if (retryCounter === 3) throw new Error(`${funcName} ${funcArgus} - ERROR After 3 Times Retries!`);

            await setTimeout(10000 * retryCounter);
            retryCounter++;
         }
      }
   }
}

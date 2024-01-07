import { CALABRIO_RTA_ENDPOINT_URL } from "../../utils/constants.js";
import { setTimeout } from "timers/promises";
import { generalLogger } from "../../config/winstonConfig.js";
import AxiosConfig from "../../config/axiosConfig.js";

export default async function soapAPIService(requestMethod, endpoint, soapAction, queryBody) {
   const funcName = "[soapAPIService Func]";
   const funcArgus = `[Rest Method = ${requestMethod}; API Endpoint = ${endpoint}; Soap Action = ${soapAction}; Query body = ${queryBody}]`;

   if (AxiosConfig === false) {
      generalLogger.error(`${funcName} - Axios Configuration ERROR!`);
      return false;
   }

   let retryCounter = 1;

   const request = {
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
         request.data = queryBody;
         break;
      default:
         generalLogger.error(`${funcName} ${funcArgus} - Unknown "Request Method"`);
         return false;
   }

   while (true) {
      try {
         return await AxiosConfig(request);
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
}

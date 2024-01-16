import { CALABRIO_RTA_ENDPOINT_URL, INFO_FOLDER } from "../../utils/constants.js";
import { setTimeout } from "timers/promises";
import LOGGER from "../../config/winstonConfig.js";
import AxiosConfig from "../../config/axiosConfig.js";

export default async function soapAPIService(requestMethod, endpoint, soapAction, queryBody) {
   const funcName = "[soapAPIService Func]";
   const funcArgus = `[Rest Method = ${requestMethod}; API Endpoint = ${endpoint}; Soap Action = ${soapAction}; Query body = ${queryBody}]`;

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
         LOGGER.error(`${funcName} ${funcArgus} - Unknown "Request Method"`);
         return false;
   }

   while (true) {
      try {
         return await AxiosConfig(request);
      } catch (err) {
         const { responseCode, statusText, description } = err;

         if (!responseCode) {
            LOGGER.error(`${funcName} ${funcArgus} - ${err}`);
            return false;
         }

         let fullErrMsg = `Response Code = ${responseCode}; Status Text = ${statusText}`;
         if (description) fullErrMsg += `; Description = ${description}`;

         LOGGER.error(`${funcName} - ${fullErrMsg}. Retrying on ${retryCounter} / 3.`);

         switch (responseCode) {
            case 400:
               // No need to retry
               return false;
            default:
               break;
         }

         if (retryCounter === 3) break;

         await setTimeout(10000 * retryCounter);
         retryCounter++;
      }
   }

   LOGGER.error(`${funcName} ${funcArgus} - ERROR After 3 Times Retries!`);
   return false;
}

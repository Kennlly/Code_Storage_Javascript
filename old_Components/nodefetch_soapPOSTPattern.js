import fetch from "node-fetch";
import { setTimeout } from "timers/promises";
import { LOGGER } from "../ProjectTree/config/winstonConfig.js";

export default async function soapPOSTPattern(apiEndpoint, soapAction, xmlPayload) {
   const funcNote = `apiEndpoint = ${apiEndpoint}; soapAction = ${soapAction}; XML Payload = \n${xmlPayload}`;

   let retryCounter = 1;
   while (retryCounter <= 3) {
      try {
         const response = await fetch(apiEndpoint, {
            method: "POST",
            headers: {
               "Content-Type": "text/xml;charset=UTF-8",
               SOAPAction: soapAction,
               Connection: "keep-alive",
            },
            body: xmlPayload,
         });

         if (response.ok) return true;

         const responseCode = response["status"];
         const errorMsg = response["statusText"];
         Logger.error(
            `soapPOSTPattern Func - Response code = ${responseCode}; Error Msg = ${errorMsg}. Retrying on ${retryCounter} / 3.`,
         );
      } catch (err) {
         Logger.error(`soapPOSTPattern Func ${err}. Retrying on ${retryCounter} / 3.`);
      }

      await setTimeout(10000 * retryCounter);
      retryCounter++;
   }

   Logger.error(`soapPOSTPattern Func ERROR after 3 times retries! ${funcNote}`);
   return false;
}

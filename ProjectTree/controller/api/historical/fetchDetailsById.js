import restAPIPattern from "../common/restAPIPattern.js";
import LOGGER from "../../../config/winstonConfig.js";

export default async function fetchDetailsById(conversationId, isIVRDataNeeded) {
   const funcName = "[fetchDetailsById Func]";
   const funcArgus = `[Conversation Id = ${conversationId}; Is IVR Data Needed = ${isIVRDataNeeded}]`;

   const url = isIVRDataNeeded
      ? `/api/v2/conversations/${conversationId}`
      : `/api/v2/analytics/conversations/${conversationId}/details`;

   try {
      const data = await restAPIPattern("GET", url, null, null);
      if (data === false) {
         LOGGER.error(`${funcName} - Getting API response ERROR! ${funcArgus}`);
         return false;
      }

      return data;
   } catch (err) {
      LOGGER.error(`${funcName} Catching ERROR - ${err}. ${funcArgus}`);
      return false;
   }
}

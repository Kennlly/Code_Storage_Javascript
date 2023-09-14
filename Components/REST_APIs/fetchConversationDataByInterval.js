import { GENESYS_ENDPOINT_URL } from "../../utils/constants.js";
import { conversationLogger } from "../../utils/loggerConfig.js";
import basicPOSTModel from "../basicPOSTModel.js";

export default async function fetchConversationDataByInterval(initialInterval) {
   const apiEndpoint = `${GENESYS_ENDPOINT_URL}/api/v2/analytics/conversations/details/query`;
   let funcNote = "";
   let pageNum = 1;
   let genesysPayload = [];
   try {
      while (true) {
         let apiQuery = {
            order: "asc",
            orderBy: "conversationStart",
            paging: {
               pageSize: "100",
               pageNumber: pageNum,
            },
            interval: initialInterval,
         };
         funcNote = `ApiQuery = ${JSON.stringify(apiQuery)}`;

         const tempPayload = await basicPOSTModel(apiEndpoint, apiQuery);
         if (tempPayload === false) return false;
         if (!tempPayload["conversations"]) break;

         genesysPayload.push(...tempPayload["conversations"]);
         pageNum++;
      }

      return genesysPayload;
   } catch (err) {
      conversationLogger.error(`fetchConversationDataByInterval Func ${err} ${funcNote}`);
      return false;
   }
}

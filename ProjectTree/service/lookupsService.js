import LOGGER from "../config/winstonConfig.js";
import restAPIService from "./common/restAPIService.js";

const fetchLookupPattern = async (apiEndpoint) => {
   const funcName = "[fetchLookupPattern Func]";

   let currentUri = apiEndpoint;
   let results = [];

   while (true) {
      let funcArgus = `[API Endpoint = ${currentUri}]`;

      try {
         const data = await restAPIService("GET", currentUri, null, null);
         if (data === false) {
            LOGGER.error(`${funcName} ${funcArgus} - Getting data from Genesys ERROR!`);
            return false;
         }

         const partial = data["entities"];
         if (JSON.stringify(data) === "{}" || !partial || partial.length === 0) {
            LOGGER.error(`${funcName} ${funcArgus} - Unexpected EMPTY payload!`);
            return false;
         }

         results.push(...partial);

         const nextUri = data["nextUri"];

         if (!nextUri) return results;

         currentUri = nextUri;
      } catch (err) {
         LOGGER.error(`${funcName} ${funcArgus} Catching ERROR - ${err}.`);
         return false;
      }
   }
};

export const fetchGroup = async () => {
   try {
      return await fetchLookupPattern("/api/v2/groups?pageSize=500");
   } catch (err) {
      LOGGER.error(`[fetchGroup Func] Catching ERROR - ${err}.`);
      return false;
   }
};

export const fetchFlow = async () => {
   try {
      return await fetchLookupPattern("/api/v2/flows?pageSize=500");
   } catch (err) {
      LOGGER.error(`[fetchFlow Func] Catching ERROR - ${err}.`);
      return false;
   }
};

// const results = await fetchFlow();
// console.log("flowResults: ", results);

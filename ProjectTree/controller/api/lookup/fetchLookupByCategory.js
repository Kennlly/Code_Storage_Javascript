import LOGGER from "../../../config/winstonConfig.js";
import fetchLookupPattern from "./fetchLookupPattern.js";

export default async function fetchLookupByCategory(category) {
   const funcNote = `[fetchLookupByCategory Func] [Category = ${category}]`;

   let url;
   switch (category) {
      case "queues":
         url = "/api/v2/routing/queues?pageSize=500";
         break;
      case "groups":
         url = "/api/v2/groups?pageSize=500";
         break;
      default:
         LOGGER.error(`${funcNote} - Unknown Category ERROR!`);
         return false;
   }

   try {
      return await fetchLookupPattern(url);
   } catch (err) {
      LOGGER.error(`${funcNote} Catching ERROR - ${err}.`);
      return false;
   }
}

// const results = await fetchLookupByCategory("hi");
// console.log("fetchQueue: ", results);

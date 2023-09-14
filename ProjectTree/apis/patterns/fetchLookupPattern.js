import restGETPattern from "./restGETPattern.js";
import { generalLogger } from "../../utils/loggerConfig.js";
import { GENESYS_ENDPOINT_URL } from "../../utils/constants.js";

export default async function fetchLookupPattern(apiEndpoint) {
   const funcNote = `Initial api endpoint = ${apiEndpoint}`;

   let currentEndpoint = apiEndpoint;
   let result = [];

   while (true) {
      try {
         const fullURL = `${GENESYS_ENDPOINT_URL}${currentEndpoint}`;
         const data = await restGETPattern(fullURL);
         if (data === false) {
            generalLogger.error(`fetchLookupPattern Func - Getting data from Genesys ERROR! URL = ${fullURL}`);
            return false;
         }

         const temp = data["entities"];
         if (JSON.stringify(data) === "{}" || !temp || temp.length === 0) {
            generalLogger.error(`fetchLookupPattern Func - Unexpected EMPTY payload! URL = ${fullURL}`);
            return false;
         }

         result.push(...temp);

         const nextUri = data["nextUri"];

         if (!nextUri) return result;

         currentEndpoint = nextUri;
      } catch (err) {
         generalLogger.error(`fetchLookupPattern Func ${err} ${funcNote}`);
         return false;
      }
   }
}

// const userList = await fetchLookupPattern("/api/v2/users?pageSize=500");
// console.log("fetchLookupPattern Func Working - userList: ", userList);

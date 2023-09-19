import { generalLogger } from "../utils/loggerConfig.js";
import { fetchLookupPattern } from "../apis/patterns/index.js";
import buildInstance from "./buildInstance.js";
import extractAndInsertGroup from "./group.js";

export default async function processGroupFlow() {
   try {
      // Step 1: Get data from Genesys
      const data = await fetchLookupPattern("/api/v2/groups?pageSize=500");
      if (data === false) return false;

      // Step 2: Building MsSQL instance, it should be done before this subtask
      const sequelize = await buildInstance();
      if (sequelize === false) return false;

      // Step 3: Extract and insert/update group
      const result = await extractAndInsertGroup(data, sequelize);
      if (result) {
         generalLogger.info(`processGroupFlow Func COMPLETED!`);
         return true;
      }

      generalLogger.error("processGroupFlow Func ERROR!");
      return false;
   } catch (err) {
      generalLogger.error(`processGroupFlow Func Catching ERROR - ${err}`);
      return false;
   }
}

// const result = await processGroupFlow();
// console.log("processGroupFlow Func - result: ", result);

import { generalLogger } from "../utils/loggerConfig.js";
import { setTimeout } from "timers/promises";
import { buildConnection, closeConnection } from "./index.js";

// export default async function basicQueryPattern(databasePoolInfo, databaseQuery) {
//    const funcNote = `Database Pool Info = ${databasePoolInfo}; Database Query = \n${JSON.stringify(databaseQuery)}`;
//    if (!databasePoolInfo) {
//       generalLogger.error(`dbQueryPattern Func - No database connection! ${funcNote}`);
//       return false;
//    }
//
//    try {
//       return await databasePoolInfo.query(databaseQuery);
//    } catch (err) {
//       generalLogger.error(`dbQueryPattern Func ${err} ${funcNote}`);
//       return false;
//    }
// }

// Testing
// export default async function dbQueryPattern(lob, databasePoolInfo, databaseQuery) {
//    let retryCounter = 0;
//    while (retryCounter <= 1) {
//       try {
//          const result = await databasePoolInfo.query(databaseQuery);
//
//          if (result) return await closePool(lob, "tempDBConnection");
//       } catch (err) {
//          generalLogger.error(`dbQueryPattern Func ${err}`);
//
//          const errStr = err.toString();
//          if (!(errStr.startsWith("Connection lost") && lob === "NTT")) return false;
//
//          const reconnectResult = await buildPool("NTT", NTT_SQL_DATABASE, "tempDBConnection");
//          if (reconnectResult) databasePoolInfo = reconnectResult;
//       }
//
//       await forceThreadSleep(10000);
//       retryCounter++;
//    }
//
//    generalLogger.error(`dbQueryPattern Func ERROR after one time connection retry! LOB = ${lob}.`);
//    return false;
// }

// Advance version
export default async function basicQueryPattern(context, databasePoolInfo, databaseQuery) {
   const funcNote = `Database Query = ${databaseQuery}.`;

   if (!databasePoolInfo) {
      const reconnectResult = await buildConnection(context, "tempDBConnection");
      if (reconnectResult === false) {
         context.error(`basicQueryPattern Func - Tried to build temp DB connection ERROR!`);
         return false;
      }

      databasePoolInfo = reconnectResult["poolInfo"];
   }

   let retryCounter = 0;
   while (retryCounter <= 1) {
      try {
         const result = await databasePoolInfo.query(databaseQuery);

         await closeConnection(context, "tempDBConnection");

         return result;
      } catch (err) {
         context.error(`basicQueryPattern Func ${err} ${funcNote}`);

         const errStr = err.toString();
         if (!errStr.startsWith("Connection lost")) return false;

         const reconnectResult = await buildConnection(context, "tempDBConnection");
         if (reconnectResult) databasePoolInfo = reconnectResult["poolInfo"];
      }

      await setTimeout(10000);
      retryCounter++;
   }

   context.error(`basicQueryPattern Func ERROR after one time connection retry! ${funcNote}`);
   return false;
}

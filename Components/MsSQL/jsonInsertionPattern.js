import { generalLogger } from "../utils/loggerConfig.js";
import { basicQueryPattern, buildConnection, closeConnection } from "./index.js";

// export default async function jsonInsertionPattern(databasePoolInfo, procedureName, queryValue) {
//    const funcNote = `Procedure name = ${procedureName}.`;
//
//    const databaseQuery = `EXEC ${procedureName} @genesysPayload = N'${JSON.stringify(queryValue)}'`;
//
//    try {
//       const result = await basicQueryPattern(databasePoolInfo, databaseQuery);
//       if (result === false) return false;
//
//       await closeConnection("tempDBConnection");
//
//       if (result["recordset"][0].hasOwnProperty("Succeed")) return true;
//
//       const msg = result["recordset"][0]["ErrorMsg"];
//       generalLogger.error(`jsonInsertionPattern Func - Error msg from MsSQL: ${msg}`);
//
//       return false;
//    } catch (err) {
//       generalLogger.error(`jsonInsertionPattern Func ${err} ${funcNote}`);
//       return false;
//    }
// }

// Prepared Statement
import { buildConnection, closeConnection } from "./index.js";
import sql from "mssql";
import { setTimeout } from "timers/promises";

export default async function jsonInsertionPattern(context, databasePoolInfo, procedureName, queryValue) {
   const funcNote = `Procedure name = ${procedureName}.`;

   if (!databasePoolInfo) {
      const reconnectResult = await buildConnection(context, "tempDBConnection");
      if (reconnectResult === false) {
         context.error(`jsonInsertionPattern Func - Tried to build temp DB connection ERROR!`);
         return false;
      }

      databasePoolInfo = reconnectResult["poolInfo"];
   }

   let retryCounter = 0;
   while (retryCounter <= 1) {
      try {
         const ps = new sql.PreparedStatement(databasePoolInfo);

         ps.input("procedureName", sql.TYPES.NVarChar(100));
         ps.input("queryValue", sql.TYPES.NVarChar(sql.MAX));
         const jsonStrValue = JSON.stringify(queryValue);
         const preparedQuery = "EXEC @procedureName @genesysPayload = @queryValue";

         await ps.prepare(preparedQuery);

         const dbResult = await ps.execute({ procedureName: procedureName, queryValue: jsonStrValue });

         await ps.unprepare();

         await closeConnection(context, "tempDBConnection");

         if (dbResult["recordset"][0].hasOwnProperty("Succeed")) return true;

         const msg = dbResult["recordset"][0]["ErrorMsg"];
         context.error(`jsonInsertionPattern Func - Error msg from database: ${msg}`);
         return false;
      } catch (err) {
         context.error(`jsonInsertionPattern Func ${err} ${funcNote}`);

         const errStr = err.toString();
         if (!errStr.startsWith("Connection lost")) return false;

         const reconnectResult = await buildConnection(context, "tempDBConnection");
         if (reconnectResult) databasePoolInfo = reconnectResult["poolInfo"];
      }

      await setTimeout(10000);
      retryCounter++;
   }

   context.error(`jsonInsertionPattern Func ERROR after one time connection retry! ${funcNote}`);
   return false;
}

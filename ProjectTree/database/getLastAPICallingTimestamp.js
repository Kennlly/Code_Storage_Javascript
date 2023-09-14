import { buildConnection, closeConnection } from "./index.js";
import Sql from "mssql";
import { setTimeout } from "timers/promises";

export default async function getLastAPICallingTimestamp(context, category, databasePoolInfo) {
   const funcNote = `Category = ${category}`;

   if (!databasePoolInfo) {
      const reconnectResult = await buildConnection(context, "tempDBConnection");
      if (reconnectResult === false) {
         context.error(`getLastAPICallingTimestamp Func - Tried to build temp DB connection ERROR!`);
         return false;
      }

      databasePoolInfo = reconnectResult["poolInfo"];
   }

   let retryCounter = 0;
   while (retryCounter <= 1) {
      try {
         const ps = new Sql.PreparedStatement(databasePoolInfo);

         ps.input("category", Sql.TYPES.NVarChar(100));
         const preparedQuery = "SELECT [Timestamp] FROM [Gen_CategoryLastCallingTimeInUTC] WHERE [CategoryName] = @category";

         await ps.prepare(preparedQuery);

         const dbResult = await ps.execute({ category: category });

         await ps.unprepare();

         await closeConnection(context, "tempDBConnection");

         return dbResult["recordset"].length === 0 ? "" : dbResult["recordset"][0]["Timestamp"];
      } catch (err) {
         context.error(`getLastAPICallingTimestamp Func ${err} ${funcNote}`);

         const errStr = err.toString();
         if (!errStr.startsWith("Connection lost")) return false;

         const reconnectResult = await buildConnection(context, "tempDBConnection");
         if (reconnectResult) databasePoolInfo = reconnectResult["poolInfo"];
      }

      await setTimeout(10000);
      retryCounter++;
   }

   context.error(`getLastAPICallingTimestamp Func ERROR after one time connection retry! ${funcNote}`);
   return false;
}

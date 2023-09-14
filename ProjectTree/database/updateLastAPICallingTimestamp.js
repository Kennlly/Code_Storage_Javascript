import sql from "mssql";
import { setTimeout } from "timers/promises";
import { buildConnection, closeConnection } from "./buildAndCloseConnection.js";

export default async function updateLastAPICallingTimestamp(
   context,
   category,
   isTimestampExist,
   updatingTimestamp,
   databasePoolInfo
) {
   const funcNote = `Category = ${category}; Is timestamp exist = ${isTimestampExist}; Updating timestamp = ${updatingTimestamp}`;

   if (!databasePoolInfo) {
      const reconnectResult = await buildConnection(context, "tempDBConnection");
      if (reconnectResult === false) {
         context.error(`updateLastAPICallingTimestamp Func - Tried to build temp DB connection ERROR!`);
         return false;
      }

      databasePoolInfo = reconnectResult["poolInfo"];
   }

   let retryCounter = 0;
   while (retryCounter <= 1) {
      try {
         const ps = new sql.PreparedStatement(databasePoolInfo);

         ps.input("category", sql.TYPES.NVarChar(100));
         // This library convert the parameter to UTC automatically as DateTime type
         ps.input("updatingTimestamp", sql.TYPES.DateTime);
         const preparedQuery = isTimestampExist
            ? "UPDATE [dbo].[Gen_CategoryLastCallingTimeInUTC] SET [Timestamp] = @updatingTimestamp WHERE [CategoryName] = @category"
            : "INSERT INTO [dbo].[Gen_CategoryLastCallingTimeInUTC] VALUES(@category,@updatingTimestamp)";

         await ps.prepare(preparedQuery);

         await ps.execute({ category: category, updatingTimestamp: updatingTimestamp });

         await ps.unprepare();

         await closeConnection(context, "tempDBConnection");

         return true;
      } catch (err) {
         context.error(`updateLastAPICallingTimestamp Func ${err} ${funcNote}`);

         const errStr = err.toString();
         if (!errStr.startsWith("Connection lost")) return false;

         const reconnectResult = await buildConnection(context, "tempDBConnection");
         if (reconnectResult) databasePoolInfo = reconnectResult["poolInfo"];
      }

      await setTimeout(10000);
      retryCounter++;
   }

   context.error(`updateLastAPICallingTimestamp Func ERROR after one time connection retry! ${funcNote}`);
   return false;
}

import Sql from "mssql";
import { LOGGER } from "../../config/winstonConfig.js";
import { setTimeout } from "timers/promises";
import buildMsSQLInstance from "../../config/mssqlConfig.js";

const poolName2Pool = new Map();

export const buildConnection = async (poolName) => {
   const funcNote = `[buildConnection Func] [DatabasePoolName = ${poolName}]`;

   const mssqlConfig = buildMsSQLInstance(poolName);
   if (mssqlConfig === false) {
      Logger.error(`${funcNote} - MsSQL Configuration ERROR!`);
      return false;
   }

   let retryCounter = 1;
   while (retryCounter <= 3) {
      try {
         if (!poolName2Pool.has(poolName)) {
            const pool = new Sql.ConnectionPool(mssqlConfig);
            poolName2Pool.set(poolName, pool.connect());
         }

         return poolName2Pool.get(poolName);
      } catch (err) {
         Logger.error(`${funcNote} - ${err}. Retrying on ${retryCounter} / 3.`);
         await setTimeout(10000);
         retryCounter++;
      }
   }

   Logger.error(`${funcNote} - Connection ERROR after 3 times retries!`);
   return false;
};
export const closeConnection = async (poolName) => {
   const funcNote = `[closeConnection Func] [DatabasePoolName = ${poolName}]`;

   try {
      if (!poolName2Pool.has(poolName)) return;

      const pool = await poolName2Pool.get(poolName);

      const result = await pool.close();

      if (result._connecting === false) {
         poolName2Pool.delete(poolName);

         return;
      }

      Logger.error(`${funcNote} - Closure ERROR!`);
   } catch (err) {
      Logger.error(`${funcNote} - ${err}.`);
   }
};

// const build = await buildConnection("test");
// console.log("build", build);

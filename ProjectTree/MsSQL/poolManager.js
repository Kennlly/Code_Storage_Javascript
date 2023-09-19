import SQL from "mssql";
import { generalLogger } from "../utils/loggerConfig.js";
import { SQL_SERVER, SQL_DATABASE, SQL_USER, SQL_PASSWORD } from "../utils/constants.js";
import { setTimeout } from "timers/promises";

const poolName2Pool = new Map();

const buildConnection = async (poolName) => {
   const funcNote = `DatabasePoolName = ${poolName}.`;

   const config = {
      server: SQL_SERVER,
      user: SQL_USER,
      password: SQL_PASSWORD,
      database: SQL_DATABASE,
      options: {
         trustServerCertificate: true,
         encrypt: true,
      },
      connectionTimeout: 300000,
      requestTimeout: 300000,
      pool: {
         max: 20,
         min: 0,
         idleTimeoutMillis: 300000,
      },
   };

   try {
      let retryCounter = 1;
      while (retryCounter <= 3) {
         try {
            if (!poolName2Pool.has(poolName)) {
               const pool = new SQL.ConnectionPool(config);
               poolName2Pool.set(poolName, pool.connect());
            }

            return poolName2Pool.get(poolName);
         } catch (err) {
            generalLogger.error(`buildConnection Func ${err}. Retrying on ${retryCounter} / 3.`);
            await setTimeout(10000 * retryCounter);
            retryCounter++;
         }
      }

      generalLogger.error(`buildConnection Func - Connection ERROR after 3 times retries! ${funcNote}`);
      return false;
   } catch (err) {
      generalLogger.error(`buildConnection Func ${err}. ${funcNote}`);
      return false;
   }
};

const closeConnection = async (poolName) => {
   const funcNote = `DatabasePoolName = ${poolName}.`;

   try {
      if (!poolName2Pool.has(poolName)) return true;

      const result = await poolName2Pool.get(poolName).close();
      if (result._connecting === false) {
         poolName2Pool.delete(poolName);

         return true;
      }

      generalLogger.error(`closeConnection Func - Closure ERROR! ${funcNote}`);
      return false;
   } catch (err) {
      generalLogger.error(`closeConnection Func ${err}. ${funcNote}`);
      return false;
   }
};

export { buildConnection, closeConnection };

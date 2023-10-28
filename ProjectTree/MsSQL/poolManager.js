import Sql from "mssql";
import LOGGER from "../util/loggerConfig.js";
import {
   PCB_SQL_SERVER,
   PCB_SQL_DATABASE,
   PCB_SQL_USER,
   PCB_SQL_PW,
   PCO_SQL_SERVER,
   PCO_SQL_DATABASE,
   PCO_SQL_USER,
   PCO_SQL_PW,
   STORE_SQL_SERVER,
   STORE_SQL_DATABASE,
   STORE_SQL_USER,
   STORE_SQL_PW,
} from "../util/constants.js";
import { setTimeout } from "timers/promises";

const poolName2Pool = new Map();

const buildConnection = async (poolName) => {
   const funcNote = `[Note: [buildConnection Func] DatabasePoolName = ${poolName}]`;

   let SQL_SERVER, SQL_USER, SQL_PW, SQL_DATABASE;

   switch (poolName) {
      case "Store":
         SQL_SERVER = STORE_SQL_SERVER;
         SQL_USER = STORE_SQL_USER;
         SQL_DATABASE = STORE_SQL_DATABASE;
         SQL_PW = STORE_SQL_PW;
         break;
      case "PCO":
         SQL_SERVER = PCO_SQL_SERVER;
         SQL_USER = PCO_SQL_USER;
         SQL_DATABASE = PCO_SQL_DATABASE;
         SQL_PW = PCO_SQL_PW;
         break;
      case "PCB":
         SQL_SERVER = PCB_SQL_SERVER;
         SQL_USER = PCB_SQL_USER;
         SQL_DATABASE = PCB_SQL_DATABASE;
         SQL_PW = PCB_SQL_PW;
         break;
      default:
         LOGGER.error(`${funcNote} - Unknown poolName ERROR!`);
         return false;
   }

   const config = {
      server: SQL_SERVER,
      user: SQL_USER,
      password: SQL_PW,
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

   let retryCounter = 1;
   while (retryCounter <= 3) {
      try {
         if (!poolName2Pool.has(poolName)) {
            const pool = new Sql.ConnectionPool(config);
            poolName2Pool.set(poolName, pool.connect());
         }

         return poolName2Pool.get(poolName);
      } catch (err) {
         LOGGER.error(`${funcNote} - ${err}. Retrying on ${retryCounter} / 3.`);
         await setTimeout(10000);
         retryCounter++;
      }
   }

   LOGGER.error(`${funcNote} - Connection ERROR after 3 times retries!`);
   return false;
};
const closeConnection = async (poolName) => {
   const funcNote = `[Note: [closeConnection Func] DatabasePoolName = ${poolName}]`;

   try {
      if (!poolName2Pool.has(poolName)) return;

      const pool = await poolName2Pool.get(poolName);

      const result = await pool.close();

      if (result._connecting === false) {
         poolName2Pool.delete(poolName);

         return;
      }

      LOGGER.error(`${funcNote} - Closure ERROR!`);
   } catch (err) {
      LOGGER.error(`${funcNote} - ${err}.`);
   }
};

export { buildConnection, closeConnection };

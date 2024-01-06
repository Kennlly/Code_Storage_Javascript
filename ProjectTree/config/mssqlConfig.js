import { generalLogger } from "./winstonConfig.js";
import { SQL_DATABASE, SQL_SERVER, SQL_USER, SQL_PW } from "../utils/constants.js";

export default function buildMsSQLInstance(poolName) {
   const funcNote = `[buildMsSQLInstance Func] [DatabasePoolName = ${poolName}]`;
   try {
      // let SQL_SERVER, SQL_USER, SQL_PW, SQL_DATABASE;
      //
      // switch (poolName) {
      //    case "Store":
      //       SQL_SERVER = STORE_SQL_SERVER;
      //       SQL_USER = STORE_SQL_USER;
      //       SQL_DATABASE = STORE_SQL_DATABASE;
      //       SQL_PW = STORE_SQL_PW;
      //       break;
      //    case "PCO":
      //       SQL_SERVER = PCO_SQL_SERVER;
      //       SQL_USER = PCO_SQL_USER;
      //       SQL_DATABASE = PCO_SQL_DATABASE;
      //       SQL_PW = PCO_SQL_PW;
      //       break;
      //    case "PCB":
      //       SQL_SERVER = PCB_SQL_SERVER;
      //       SQL_USER = PCB_SQL_USER;
      //       SQL_DATABASE = PCB_SQL_DATABASE;
      //       SQL_PW = PCB_SQL_PW;
      //       break;
      //    default:
      //       generalLogger.error(`${funcNote} - Unknown poolName ERROR!`);
      //       return false;
      // }

      return {
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
   } catch (err) {
      generalLogger.error(`${funcNote} - ${err}.`);
      return false;
   }
}

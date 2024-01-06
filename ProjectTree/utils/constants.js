// npm install ip
import Ip from "ip";
// npm i dotenv
import * as Dotenv from "dotenv";
import * as Path from "path";
import Crypto from "crypto";

const detectEnv = () => {
   const ipAddress = Ip.address();
   switch (ipAddress) {
      case "10.77.25.50":
         return "DEV";
      case "10.77.155.5":
         return "UAT1";
      case "10.248.155.5":
         return "UAT2";
      case "10.77.156.152":
         return "PROD1";
      case "10.248.156.152":
         return "PROD2";
      case "1.2.3.4":
         return "Office";
      default:
         return "Local";
   }
};

const APP_RUNNING_ENV = detectEnv();

const defineProjectFolder = () => {
   if (APP_RUNNING_ENV === "Local") return "/Volumes/JSAndTS/Javascript/Code_Storage_Javascript/ProjectTree/";
   if (APP_RUNNING_ENV === "Office") return "C:/???";
   return "D:\\GenesysBatch\\Node.js\\???";
};
const PROJECT_FOLDER = defineProjectFolder();

export const LOG_FOLDER = `${PROJECT_FOLDER}log${Path["sep"]}`;
const DATASTORAGE_FOLDER = `${PROJECT_FOLDER}dataStorage${Path["sep"]}`;
export const INFO_FOLDER = `${PROJECT_FOLDER}info${Path["sep"]}`;

Dotenv.config({ path: `${PROJECT_FOLDER}.env` });
export const GENESYS_ENDPOINT_URL = process["env"]["GENESYS_ENDPOINT_URL"];
export const CALABRIO_RTA_ENDPOINT_URL = process["env"]["CALABRIO_RTA_ENDPOINT_URL"];
const ENCRYPT_KEY = process["env"]["ENCRYPT_KEY"];
const SQL_DATABASE = process["env"]["SQL_DATABASE"];
const SQL_SERVER = process["env"]["SQL_SERVER"];
const SQL_USER = process["env"]["SQL_USER"];

// Decrypt fields
const decrypt = (iv, content) => {
   const decipher = Crypto.createDecipheriv("aes-256-ctr", ENCRYPT_KEY, Buffer.from(iv, "hex"));
   const decrypted = Buffer.concat([decipher.update(Buffer.from(content, "hex")), decipher.final()]);
   return decrypted.toString();
};

const GENESYS_CLIENT_ID_IV = process["env"]["GENESYS_CLIENT_ID_IV"];
const GENESYS_CLIENT_ID_CONTENT = process["env"]["GENESYS_CLIENT_ID_CONTENT"];
const GENESYS_CLIENT_ID = decrypt(GENESYS_CLIENT_ID_IV, GENESYS_CLIENT_ID_CONTENT);
const GENESYS_CLIENT_SECRET_IV = process["env"]["GENESYS_CLIENT_SECRET_IV"];
const GENESYS_CLIENT_SECRET_CONTENT = process["env"]["GENESYS_CLIENT_SECRET_CONTENT"];
const GENESYS_CLIENT_SECRET = decrypt(GENESYS_CLIENT_SECRET_IV, GENESYS_CLIENT_SECRET_CONTENT);
const SQL_PASSWORD_IV = process["env"]["SQL_PASSWORD_IV"];
const SQL_PASSWORD_CONTENT = process["env"]["SQL_PASSWORD_CONTENT"];
const SQL_PASSWORD = decrypt(SQL_PASSWORD_IV, SQL_PASSWORD_CONTENT);

export {
   // General fields
   APP_RUNNING_ENV,
   PROJECT_FOLDER,
   SQL_DATABASE,
   SQL_SERVER,
   SQL_USER,
   // Decrypted fields
   GENESYS_CLIENT_ID,
   GENESYS_CLIENT_SECRET,
   SQL_PASSWORD,
};

import * as dotenv from "dotenv";
import * as path from "path";
import appRoot from "app-root-path";
import crypto from "crypto";
import ip from "ip";

const detectEnv = () => {
   const ipAddress = ip.address();

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
      case "192.168.2.32":
         return "Office";
      default:
         return "Local";
   }
};

const APP_RUNNING_ENV = detectEnv();

const ROOT = `${appRoot["path"]}${path["sep"]}`;

dotenv.config({ path: `${ROOT}src/.env` });

export const LOG_FOLDER = `${ROOT}log${path["sep"]}`;

export const INFO_FOLDER = `${ROOT}src${path["sep"]}info${path["sep"]}`;

export const GENESYS_ENDPOINT_URL = process["env"]["GENESYS_ENDPOINT_URL"];

const ENCRYPT_KEY = process["env"]["ENCRYPT_KEY"];

// Decrypt fields
const decrypt = (iv, content) => {
   const decipher = crypto.createDecipheriv("aes-256-ctr", ENCRYPT_KEY, Buffer.from(iv, "hex"));
   const decrypted = Buffer.concat([decipher.update(Buffer.from(content, "hex")), decipher.final()]);
   return decrypted.toString();
};

const GENESYS_CLIENT_ID_IV = process["env"]["GENESYS_CLIENT_ID_IV"];
const GENESYS_CLIENT_ID_CONTENT = process["env"]["GENESYS_CLIENT_ID_CONTENT"];
export const GENESYS_CLIENT_ID = decrypt(GENESYS_CLIENT_ID_IV, GENESYS_CLIENT_ID_CONTENT);

const GENESYS_CLIENT_SECRET_IV = process["env"]["GENESYS_CLIENT_SECRET_IV"];
const GENESYS_CLIENT_SECRET_CONTENT = process["env"]["GENESYS_CLIENT_SECRET_CONTENT"];
export const GENESYS_CLIENT_SECRET = decrypt(GENESYS_CLIENT_SECRET_IV, GENESYS_CLIENT_SECRET_CONTENT);

// SQL Database Config
export const SQL_DATABASE = process["env"]["SQL_DATABASE"];
export const SQL_SERVER = process["env"]["SQL_SERVER"];
export const SQL_PORT = process["env"]["SQL_PORT"];
export const SQL_USER = process["env"]["SQL_USER"];

const SQL_PW_IV = process["env"]["SQL_PW_IV"];
const SQL_PW_CONTENT = process["env"]["SQL_PW_CONTENT"];
export const SQL_PW = decrypt(SQL_PW_IV, SQL_PW_CONTENT);

// Node Mailer Config
export const EMAIL_HOST = process["env"]["EMAIL_HOST"];
export const EMAIL_PORT = process["env"]["EMAIL_PORT"];
export const EMAIL_USER = process["env"]["EMAIL_USER"];
export const EMAIL_RECIPIENTS = process["env"]["EMAIL_RECIPIENTS"];
export const EMAIL_CC_RECIPIENTS = process["env"]["EMAIL_CC_RECIPIENTS"];

const EMAIL_PW_IV = process["env"]["EMAIL_PW_IV"];
const EMAIL_PW_CONTENT = process["env"]["EMAIL_PW_CONTENT"];
export const EMAIL_PW = decrypt(EMAIL_PW_IV, EMAIL_PW_CONTENT);

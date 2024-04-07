import moment from "moment";
import LOGGER from "../config/winstonConfig.js";

/*
   IMPORTANT:
   1. Don't use it in Primary Key Field(s)
   2. With assumption that Genesys returns all timestamp fields in UTC and formally formatted
   3. This function helps save normalization codes in mappers
   4. Don't throw error to allow function execution
*/
export default function defineEntitySetterValue(value, datatype, strLength = 255) {
   if (value === null || value === undefined || value === "" || value === " ") return null;
   const funcNote = `[defineSetterValue Func] [Value = ${JSON.stringify(
      value,
      null,
      3
   )}; Datatype = ${datatype}; Expected String Length = ${strLength}]`;

   switch (datatype) {
      case "number":
      case "boolean":
      case "text":
         return value;
      case "string":
         const str = value.trim();
         if (str === "" || str === " ") return null;

         return str.substring(0, strLength);
      case "datetime":
         const utc = moment.utc(value);
         const isValid = utc.isValid();
         if (!isValid) {
            LOGGER.error(`${funcNote} - Unexpected Datetime Format ERROR!`);
            return null;
         }

         return moment.utc(utc).utcOffset(moment().utcOffset()).format("YYYY-MM-DD HH:mm:ss Z");
      default:
         LOGGER.error(`${funcNote} - Unknown Datatype ERROR!`);
         return null;
   }
}

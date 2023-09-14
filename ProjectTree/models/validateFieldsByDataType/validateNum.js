import { modelLogger } from "../../utils/loggerConfig.js";

export default function validateNum(sourceData, fieldName, isRequiredMatchMsSQLInt, note) {
   const funcNote = `SourceData = ${sourceData}; FieldName = ${fieldName}; IsRequiredMatchMsSQLInt = ${isRequiredMatchMsSQLInt}; Note = ${note}.`;
   try {
      if (sourceData === null || sourceData === undefined || sourceData.length === 0) return null;

      const isNumber = isNaN(sourceData) === false;
      if (!isNumber) {
         modelLogger.error(`validateNum Func - Error data: NOT a Number! ${funcNote}`);
         return null;
      }

      if (!isRequiredMatchMsSQLInt) return sourceData;

      if (sourceData >= 0 && sourceData <= 2147483647) return sourceData;

      modelLogger.error(`validateNum Func - Error data: NOT a MsSQL Integer! ${funcNote}`);
      return null;
   } catch (err) {
      modelLogger.error(`validateNum Func ${err}. ${funcNote}`);
      return null;
   }
}

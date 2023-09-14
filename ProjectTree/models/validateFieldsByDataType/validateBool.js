import { modelLogger } from "../../utils/loggerConfig.js";

export default function validateBool(sourceData, fieldName, note) {
   const funcNote = `SourceData = ${sourceData}; FieldName = ${fieldName}; Note = ${note}.`;

   try {
      if (sourceData === null || sourceData === undefined || sourceData.length === 0) return null;

      if (typeof sourceData === "boolean") return sourceData;

      modelLogger.error(`validateBool Func - Error data: NOT a Boolean. ${funcNote}`);
      return null;
   } catch (err) {
      modelLogger.error(`validateBool Func ${err}. ${funcNote}`);
      return null;
   }
}

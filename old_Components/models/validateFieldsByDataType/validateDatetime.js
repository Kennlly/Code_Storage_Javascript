import moment from "moment";
import { modelLogger } from "../../utils/loggerConfig.js";

export default function validateDatetime(sourceData, fieldName, note) {
   const funcNote = `SourceData = ${sourceData}; FieldName = ${fieldName}; Note = ${note}.`;
   try {
      if (!sourceData) return null;

      // Cannot use "strict" mode because Genesys has a different datetime format with different payload
      const isValid = moment.utc(sourceData, "YYYY-MM-DDTHH:mm:ss.SSS[Z]").isValid();
      if (isValid) return sourceData;
      // if (isValid) return parseMomentDateStr.format("YYYY-MM-DD HH:mm:ss.SSS Z");

      modelLogger.error(`validateDatetime Func - Error data: NOT a Datetime! ${funcNote}`);
      return null;
   } catch (err) {
      modelLogger.error(`validateDatetime Func ${err}. ${funcNote}`);
      return null;
   }
}

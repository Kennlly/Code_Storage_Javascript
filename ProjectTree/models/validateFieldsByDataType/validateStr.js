import { modelLogger } from "../../utils/loggerConfig.js";

export default function validateStr(sourceData, expectLength, fieldName, note) {
   const funcNote = `SourceData = ${sourceData}; ExpectLength = ${expectLength}; FieldName = ${fieldName}; Note = ${note}.`;
   try {
      if (!sourceData) return null;

      const refactoredStr = sourceData.replace(/'/g, "''").replace(/\n/g, " ");
      if (refactoredStr.length <= expectLength) return refactoredStr;

      modelLogger.error(`Error data! ${funcNote}`);
      return refactoredStr.substring(0, expectLength);
   } catch (err) {
      modelLogger.error(`validateStr Func ${err}. ${funcNote}`);
      return null;
   }
}

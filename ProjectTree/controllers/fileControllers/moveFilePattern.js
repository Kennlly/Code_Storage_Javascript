import { promises as fs } from "fs";
import { generalLogger } from "../../utils/loggerConfig.js";

export default async function moveFilePattern(sourceFilePath, destinationFilePath) {
   const funcNote = `Source file path = ${sourceFilePath}; Destination file path = ${destinationFilePath}`;
   try {
      await fs.rename(sourceFilePath, destinationFilePath);
      return true;
   } catch (err) {
      generalLogger.error(`moveFilePattern Func ${err} ${funcNote}`);
      return false;
   }
}

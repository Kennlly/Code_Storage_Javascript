import { promises as fs } from "fs";
import { generalLogger } from "../../utils/loggerConfig.js";

export default async function copyFilePattern(sourceFilePath, destinationFilePath) {
   const funcNote = `Source file path = ${sourceFilePath}; Destination file path = ${destinationFilePath}`;

   try {
      await fs.copyFile(sourceFilePath, destinationFilePath);
      return true;
   } catch (err) {
      generalLogger.error(`copyFilePattern Func ${err}. ${funcNote}`);
      return false;
   }
}

import { promises as fs } from "fs";
import { generalLogger } from "../../config/winstonConfig.js";

export default async function removeFilePattern(filePath) {
   try {
      await fs.unlink(filePath);
      return true;
   } catch (err) {
      generalLogger.error(`removeFilePattern Func ${err} Filepath = ${filePath}`);
      return false;
   }
}

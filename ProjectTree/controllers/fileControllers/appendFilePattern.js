import { promises as fs } from "fs";
import { generalLogger } from "../../utils/loggerConfig.js";

export default async function appendFilePattern(filePath, content) {
   try {
      const fullPath = `${filePath}.txt`;
      await fs.appendFile(fullPath, content);
      return true;
   } catch (err) {
      generalLogger.error(`appendFilePattern Func ${err} Content = ${content}`);
      return false;
   }
}

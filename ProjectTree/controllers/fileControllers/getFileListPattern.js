import { promises as fs } from "fs";
import { generalLogger } from "../../config/winstonConfig.js";

export default async function getFileListPattern(folderPath) {
   try {
      return await fs.readdir(folderPath);
   } catch (err) {
      generalLogger.error(`getFileListPattern Func ${err} FolderPath = ${folderPath}`);
      return false;
   }
}

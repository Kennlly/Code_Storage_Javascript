import AdmZip from "adm-zip";
import Moment from "moment";
import * as path from "path";
import { promises as fs } from "fs";
import { generalLogger } from "../../utils/loggerConfig.js";
import { LOGS_FOLDER } from "../../utils/constants.js";

export default async function zipLogFiles(logCategory) {
   const zip = new AdmZip("", undefined);
   const folderPath = `${LOGS_FOLDER}${logCategory}${path.sep}`;

   try {
      // Get the list of original files
      const fullFileList = await fs.readdir(folderPath);
      if (fullFileList.length === 0) {
         generalLogger.info(`zipLogFiles Func - There is NO files in the ${folderPath}.`);
         return true;
      }

      // Filter the files for last month
      const backwardOneMonthDateStr = Moment().subtract(1, "month").format("YYYY-MM");
      const filteredFileList = fullFileList.filter((fileName) => {
         // Because logConfig file generates the name of log file, it is a guaranteed string pattern
         const fileDateStr = fileName.substring(0, 7);
         return fileDateStr === backwardOneMonthDateStr;
      });
      if (filteredFileList.length === 0) {
         generalLogger.info(`zipLogFiles Func - There are NO files for ${backwardOneMonthDateStr} need to be zipped.`);
         return true;
      }

      //Generate zip folder
      filteredFileList.forEach((file) => zip.addLocalFile(`${folderPath}${file}`, null, null, null));
      zip.writeZip(`${folderPath}${backwardOneMonthDateStr}.zip`, null);

      //Remove the files
      for (const file of filteredFileList) await fs.unlink(`${folderPath}${file}`);

      generalLogger.info(`zipLogFiles Func - Zip and Remove files for ${folderPath} for ${backwardOneMonthDateStr} COMPLETED!`);
      return true;
   } catch (err) {
      generalLogger.error(`zipLogFiles Func ${err}. Folder path = ${folderPath}`);
      return false;
   }
}

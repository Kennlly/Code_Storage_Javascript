import AdmZip from "adm-zip";
import Moment from "moment";
import { promises as Fs } from "fs";
import LOGGER from "./loggerConfig.js";

export default async function zipFolder(folderPath, fileExtension) {
   const zip = new AdmZip("", undefined);
   const funcNote = `[zipFolder Func] [Folder path = ${folderPath}; File extension = ${fileExtension}]`;

   try {
      // Get an original full file list
      const fullFileList = await Fs.readdir(folderPath);
      if (fullFileList.length === 0) {
         LOGGER.info(`${funcNote} - There is NO files in the folder.`);
         return true;
      }

      // Filter the files for last month
      const backwardOneMonthDateStr = Moment().subtract(1, "month").format("YYYY-MM");
      const filteredFileList = fullFileList.filter((fileName) => {
         // Because logConfig file generates the name of log file, it is a guaranteed string pattern
         const fileDateStr = fileName.substring(0, 7);
         const fileDotIdx = fileName.indexOf(".");
         const extension = fileDotIdx !== -1 ? fileName.substring(fileDotIdx + 1) : null;

         return fileDateStr === backwardOneMonthDateStr && extension === fileExtension;
      });
      if (filteredFileList.length === 0) {
         LOGGER.info(`${funcNote} - There are NO files for ${backwardOneMonthDateStr} need to be zipped.`);
         return true;
      }

      //Generate zip folder
      filteredFileList.forEach((file) => zip.addLocalFile(`${folderPath}${file}`, null, null, null));
      zip.writeZip(`${folderPath}${backwardOneMonthDateStr}.zip`, null);

      //Remove the files
      for (const file of filteredFileList) {
         await Fs.unlink(`${folderPath}${file}`);
      }

      LOGGER.info(`${funcNote} - Zip and Remove files for ${backwardOneMonthDateStr} COMPLETED!`);
      return true;
   } catch (err) {
      LOGGER.error(`${funcNote} - ${err}.`);
      return false;
   }
}

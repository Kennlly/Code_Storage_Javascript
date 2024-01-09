// npm i adm-zip
import AdmZip from "adm-zip";
import moment from "moment";
import path from "path";
import { promises as fs } from "fs";

const zipDataStorageFiles = async (category) => {
   const zip = new AdmZip();
   try {
      const folderPath = `${DATASTORAGE_FILEPATH}${category}${path.sep}`;
      const fileListArr = await getFileList(folderPath);
      if (typeof fileListArr === "boolean") return fileListArr;

      const backwardSevenDaysTimestamp = moment().subtract(7, "day").format("YYYY-MM-DD");
      const filteredResult = fileListArr.filter((fileName) => {
         const index = fileName.indexOf("T");
         const fileDate = fileName.substring(0, index);
         const isValidFileDate = moment(fileDate, "YYYY-MM-DD", true).isValid();
         if (isValidFileDate) return fileDate === backwardSevenDaysTimestamp;
      });

      if (filteredResult.length === 0) {
         LOGGER.info(`There is no data storage - ${category} files for ${backwardSevenDaysTimestamp} to be zipped.`);
         return true;
      }

      //Generate zip folder
      filteredResult.forEach((file) => zip.addLocalFile(`${folderPath}${file}`));
      zip.writeZip(`${folderPath}${backwardSevenDaysTimestamp}.zip`);

      //Remove the files
      filteredResult.forEach(async (file) => {
         const result = await removeFile(`${folderPath}${file}`);
         if (!result) throw new Error(`Remove file ${folderPath}${file} occurs error!`);
      });
      return true;
   } catch (err) {
      LOGGER.error(`zipDataStorageFiles Func ${err}. Category = ${category}`);
      return false;
   }
};

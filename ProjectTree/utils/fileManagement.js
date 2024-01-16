import AdmZip from "adm-zip";
import Moment from "moment";
import { promises as FS } from "fs";
import LOGGER from "../config/winstonConfig.js";

export const writeFile = async (filePath, category, content) => {
   const funcName = "[writeFile Func]";
   const funcArgus = `[File Path = ${filePath}; Category = ${category}; Content = ${JSON.stringify(content, null, 3)}]`;

   const fullFilePath = `${filePath}.${category}`;

   //handle writing txt or json file
   if (category !== "json" && category !== "txt") {
      throw new Error(`${funcName} - File Category ERROR! Category = ${category}`);
   }

   try {
      const fileContent = category === "json" ? JSON.stringify(content, null, 3) : content;

      await FS.writeFile(fullFilePath, fileContent);

      LOGGER.info(`${funcName} - Writing "${fullFilePath}" Succeed!`);
      return true;
   } catch (err) {
      throw new Error(`${funcName} Catching ERROR - ${err}\n${funcArgus}`);
   }
};

export const isFileExist = async (filePath) => {
   try {
      await FS.access(filePath);
      return true;
   } catch {
      LOGGER.debug(`[isFileExist Func] - "${filePath}" is NOT Exist.`);
      return false;
   }
};

export const readFile = async (filePath, category) => {
   const funcName = "[readFile Func]";
   const funcArgus = `[File Path = ${filePath}; Category = ${category}]`;

   //handle reading txt or json file
   if (category !== "json" && category !== "txt") {
      throw new Error(`${funcName} - File Category ERROR! Category = ${category}`);
   }

   const fullFilePath = `${filePath}.${category}`;

   try {
      const isTargetFileExist = await isFileExist(fullFilePath);

      // File does NOT Exist
      if (!isTargetFileExist) {
         if (category === "json") {
            await writeFile(filePath, "json", {});
            return {};
         }

         await writeFile(filePath, "txt", "");
         return "";
      }

      // File Exists
      const data = await FS.readFile(fullFilePath, "utf-8");

      return category === "txt" ? data : JSON.parse(data);
   } catch (err) {
      throw new Error(`${funcName} Catching ERROR - ${err}. ${funcArgus}`);
   }
};

export const appendFile = async (filePath, content) => {
   const funcName = "[appendFile Func]";
   const funcArgus = `[File Path = ${filePath}; Content = ${JSON.stringify(content, null, 3)}]`;

   try {
      const fullPath = `${filePath}.txt`;

      await FS.appendFile(fullPath, content);
   } catch (err) {
      throw new Error(`${funcName} Catching ERROR - ${err}\n${funcArgus}`);
   }
};

export const moveFile = async (sourceFilePath, destinationFilePath) => {
   const funcName = "[moveFile Func]";
   const funcArgus = `[Source File Path = ${sourceFilePath}; Destination File Path = ${destinationFilePath}]`;

   try {
      await FS.rename(sourceFilePath, destinationFilePath);

      LOGGER.info(`${funcName} ${funcArgus} Succeed!`);
   } catch (err) {
      throw new Error(`${funcName} ${funcArgus} Catching ERROR - ${err}`);
   }
};

export const copyFile = async (sourceFilePath, destinationFilePath) => {
   const funcName = "[copyFile Func]";
   const funcArgus = `[Source File Path = ${sourceFilePath}; Destination File Path = ${destinationFilePath}]`;

   try {
      await FS.copyFile(sourceFilePath, destinationFilePath);

      LOGGER.info(`${funcName} ${funcArgus} Succeed!`);
   } catch (err) {
      throw new Error(`${funcName} ${funcArgus} Catching ERROR - ${err}`);
   }
};

export const deleteFile = async (filePath) => {
   const funcName = "[deleteFile Func]";
   const funcArgus = `[File Path = ${filePath}]`;

   try {
      await FS.unlink(filePath);

      LOGGER.info(`${funcName} ${funcArgus} Succeed!`);
   } catch (err) {
      throw new Error(`${funcName} ${funcArgus} Catching ERROR - ${err}`);
   }
};

export const getFileList = async (folderPath) => {
   const funcName = "[getFileList Func]";
   const funcArgus = `[Folder Path = ${folderPath}]`;

   try {
      return await FS.readdir(folderPath);
   } catch (err) {
      throw new Error(`${funcName} ${funcArgus} Catching ERROR - ${err}`);
   }
};

export const zipFolder = async (folderPath, fileExtension) => {
   // The function handles fileName pattern = "YYYY-MM-DD.???"
   const funcName = "[zipFolder Func]";
   const funcArgus = `[Folder Path = ${folderPath}; File Extension = ${fileExtension}]`;
   const Zip = new AdmZip("", undefined);

   try {
      // Get an original full file list
      const fullFileList = await getFileList(folderPath);
      if (fullFileList.length === 0) {
         LOGGER.info(`${funcName} ${funcArgus} - The file folder is EMPTY.`);
         return true;
      }

      // Filter the files for last month
      const backwardOneMonthDateStr = Moment().subtract(1, "month").format("YYYY-MM");
      const filteredFileList = fullFileList.filter((fileName) => {
         const fileDateStr = fileName.substring(0, 7);
         const fileDotIdx = fileName.indexOf(".");
         const extension = fileDotIdx !== -1 ? fileName.substring(fileDotIdx + 1) : null;

         return fileDateStr === backwardOneMonthDateStr && extension === fileExtension;
      });
      if (filteredFileList.length === 0) {
         LOGGER.info(`${funcName} ${funcArgus} - There are NO such files for "${backwardOneMonthDateStr}".`);
         return true;
      }

      //Generate zip folder
      filteredFileList.forEach((file) => Zip.addLocalFile(`${folderPath}${file}`, null, null, null));
      Zip.writeZip(`${folderPath}${backwardOneMonthDateStr}.zip`, null);

      //Remove the files
      for (const file of filteredFileList) {
         await deleteFile(`${folderPath}${file}`);
      }

      LOGGER.info(`${funcName} ${funcArgus} - Zip and Remove files for "${backwardOneMonthDateStr}" Succeed!`);
      return true;
   } catch (err) {
      LOGGER.error(`${funcName} ${funcArgus} Catching ERROR - ${err}.`);
      return false;
   }
};

// const write = await writeFile(`${INFO_FOLDER}test`, "json", "hello world");
// const isExist = await isFileExist(`${INFO_FOLDER}test1.json`);
// const read = await readFile(`${INFO_FOLDER}test`, "json");
// const append = await appendFile(`${INFO_FOLDER}test`, "append test");
// const move = await moveFile(
//    "/Volumes/JSAndTS/Javascript/Code_Storage_Javascript/ProjectTree/entity/test.txt",
//    "/Volumes/JSAndTS/Javascript/Code_Storage_Javascript/ProjectTree/info/test.txt",
// );
// const copy = await copyFile(
//    "/Volumes/JSAndTS/Javascript/Code_Storage_Javascript/ProjectTree/info/test.txt",
//    "/Volumes/JSAndTS/Javascript/Code_Storage_Javascript/ProjectTree/entity/test.txt",
// );
// const deleteResult = await deleteFile("/Volumes/JSAndTS/Javascript/Code_Storage_Javascript/ProjectTree/info/test.txt");
// const list = await getFileList("/Volumes/JSAndTS/Javascript/Code_Storage_Javascript/ProjectTree/log/general");
// const zip = await zipFolder("/Volumes/JSAndTS/Javascript/Code_Storage_Javascript/ProjectTree/log/general", "log");
// console.log("zip:", zip);

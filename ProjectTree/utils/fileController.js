import AdmZip from "adm-zip";
import Moment from "moment";
import { promises as FS } from "fs";
import { Logger } from "../config/winstonConfig.js";

export const writeFile = async (filePath, category, content) => {
   const funcName = "[writeFile Func]";
   const funcArgus = `[File Path = ${filePath}; Category = ${category}; Content = ${JSON.stringify(content)}]`;

   const fullFilePath = `${filePath}.${category}`;

   //handle writing txt or json file
   if (category !== "json" && category !== "txt") {
      Logger.error(`${funcName} - File category ERROR! Category = ${category}`);
      return false;
   }

   try {
      const fileContent = category === "json" ? JSON.stringify(content, null, 2) : content;

      await FS.writeFile(fullFilePath, fileContent);

      Logger.info(`${funcName} - Writing "${filePath}" Succeed!`);
      return true;
   } catch (err) {
      Logger.error(`${funcName} Catching ERROR - ${err}\n${funcArgus} `);
      return false;
   }
};

export const isFileExist = async (filePath) => {
   try {
      await FS.access(filePath);
      return true;
   } catch {
      Logger.debug(`[isFileExist Func] - "${filePath}" is NOT Exist.`);
      return false;
   }
};

export const readFile = async (filePath, category) => {
   const funcName = "[readFile Func]";
   const funcArgus = `[File Path = ${filePath}; Category = ${category}]`;

   //handle reading txt or json file
   if (category !== "json" && category !== "txt") {
      Logger.error(`${funcName} - File category ERROR! Category = ${category}`);
      return false;
   }

   const fullFilePath = `${filePath}.${category}`;

   try {
      const isTargetFileExist = await isFileExist(fullFilePath);

      // File does NOT Exist
      if (!isTargetFileExist) {
         if (category === "json") return (await writeFile(filePath, "json", {})) ? {} : false;

         return (await writeFile(filePath, "txt", "")) ? "" : false;
      }

      // File Exists
      const data = await FS.readFile(fullFilePath, "utf-8");

      if (category === "txt") return data;

      try {
         return JSON.parse(data);
      } catch (err) {
         Logger.error(`${funcName} - Parsing JSON ERROR. ${funcArgus}`);
         return {};
      }
   } catch (err) {
      Logger.error(`${funcName} Catching ERROR - ${err}. ${funcArgus}`);
      return false;
   }
};

export const appendFile = async (filePath, content) => {
   const funcName = "[appendFile Func]";
   const funcArgus = `[File Path = ${filePath}; Content = ${JSON.stringify(content)}]`;

   try {
      const fullPath = `${filePath}.txt`;

      await FS.appendFile(fullPath, content);

      return true;
   } catch (err) {
      Logger.error(`${funcName} Catching ERROR - ${err}\n${funcArgus}`);
      return false;
   }
};

export const moveFile = async (sourceFilePath, destinationFilePath) => {
   const funcName = "[moveFile Func]";
   const funcArgus = `[Source File Path = ${sourceFilePath}; Destination File Path = ${destinationFilePath}]`;

   try {
      await FS.rename(sourceFilePath, destinationFilePath);

      Logger.info(`${funcName} ${funcArgus} Succeed!`);
      return true;
   } catch (err) {
      Logger.error(`${funcName} ${funcArgus} Catching ERROR - ${err}`);
      return false;
   }
};

export const copyFile = async (sourceFilePath, destinationFilePath) => {
   const funcName = "[copyFile Func]";
   const funcArgus = `[Source File Path = ${sourceFilePath}; Destination File Path = ${destinationFilePath}]`;

   try {
      await FS.copyFile(sourceFilePath, destinationFilePath);

      Logger.info(`${funcName} ${funcArgus} Succeed!`);
      return true;
   } catch (err) {
      Logger.error(`${funcName} ${funcArgus} Catching ERROR - ${err}`);
      return false;
   }
};

export const deleteFile = async (filePath) => {
   const funcName = "[deleteFile Func]";
   const funcArgus = `[File Path = ${filePath}]`;

   try {
      await FS.unlink(filePath);

      Logger.info(`${funcName} ${funcArgus} Succeed!`);
      return true;
   } catch (err) {
      Logger.error(`${funcName} ${funcArgus} Catching ERROR - ${err}`);
      return false;
   }
};

export const getFileList = async (folderPath) => {
   const funcName = "[getFileList Func]";
   const funcArgus = `[Folder Path = ${folderPath}]`;

   try {
      return await FS.readdir(folderPath);
   } catch (err) {
      Logger.error(`${funcName} ${funcArgus} Catching ERROR - ${err}`);
      return false;
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
         Logger.info(`${funcName} ${funcArgus} - The file folder is EMPTY.`);
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
         Logger.info(`${funcName} ${funcArgus} - There are NO such files for "${backwardOneMonthDateStr}".`);
         return true;
      }

      //Generate zip folder
      filteredFileList.forEach((file) => Zip.addLocalFile(`${folderPath}${file}`, null, null, null));
      Zip.writeZip(`${folderPath}${backwardOneMonthDateStr}.zip`, null);

      //Remove the files
      for (const file of filteredFileList) {
         await deleteFile(`${folderPath}${file}`);
      }

      Logger.info(`${funcName} ${funcArgus} - Zip and Remove files for "${backwardOneMonthDateStr}" Succeed!`);
      return true;
   } catch (err) {
      Logger.error(`${funcName} ${funcArgus} Catching ERROR - ${err}.`);
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

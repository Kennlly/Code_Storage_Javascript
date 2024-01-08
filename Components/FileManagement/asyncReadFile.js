import { promises as fs } from "fs";

const readTXTFile = async (fileName) => {
   const filePath = `${TXT_FILEPATH}${fileName}.txt`;
   try {
      const isTXTFileExist = await isFileExist(filePath);
      if (!isTXTFileExist) {
         Logger.error(`File ${filePath} is NOT exist!`);
         await writeTXTFile(fileName, "");
         return "";
      }

      return await fs.readFile(filePath, "utf-8");
   } catch (err) {
      Logger.error(`readTXTFile Func reading ${filePath} ${err}`);
      return false;
   }
};

const readJSONFile = async (fileName) => {
   const filePath = `${JSON_FILEPATH}${fileName}.json`;
   try {
      const isJSONFileExist = await isFileExist(filePath);
      if (!isJSONFileExist) {
         Logger.error(`File ${filePath} is NOT exist!`);
         await writeJSONFile(fileName, {});
         return {};
      }

      const data = await fs.readFile(filePath, "utf-8");
      try {
         return JSON.parse(data);
      } catch (err) {
         Logger.error(`Converting ${fileName}.json ${err}`);
      }
   } catch (err) {
      Logger.error(`readJSONFile Func reading ${filePath} ${err}`);
      return false;
   }
};

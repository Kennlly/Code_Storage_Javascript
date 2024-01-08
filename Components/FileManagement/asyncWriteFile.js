import { promises as fs } from "fs";

const writeJSONFile = async (fileName, content) => {
   const filePath = `${JSON_FILEPATH}${fileName}.json`;
   try {
      await fs.writeFile(filePath, JSON.stringify(content, null, 2));
      Logger.info(`Writing ${fileName}.json SUCCEED!`);
      return true;
   } catch (err) {
      Logger.error(`Writing ${fileName}.json ${err}. Content = ${JSON.stringify(content)}`);
      return false;
   }
};

const writeTXTFile = async (fileName, content) => {
   const filePath = `${TXT_FILEPATH}${fileName}.txt`;
   try {
      await fs.writeFile(filePath, content);
      Logger.info(`Writing ${fileName}.txt SUCCEED!`);
      return true;
   } catch (err) {
      Logger.error(`Writing ${fileName}.txt ${err}. Content = ${content}`);
      return false;
   }
};

import { promises as FS } from "fs";
import { generalLogger } from "../config/winstonConfig.js";

export const writeFile = async (filePath, category, content) => {
   const funcName = "[writeFile Func]";
   const funcArgus = `[File Path = ${filePath}; Category = ${category}; Content = ${JSON.stringify(content)}]`;

   const fullFilePath = `${filePath}.${category}`;

   //handle writing txt or json file
   if (category !== "json" && category !== "txt") {
      generalLogger.error(`${funcName} - File category ERROR! Category = ${category}`);
      return false;
   }

   try {
      const fileContent = category === "json" ? JSON.stringify(content, null, 2) : content;

      await FS.writeFile(fullFilePath, fileContent);

      generalLogger.info(`${funcName} - Writing ${filePath} Succeed!`);
      return true;
   } catch (err) {
      generalLogger.error(`${funcName} Catching ERROR - ${err}\n${funcArgus} `);
      return false;
   }
};

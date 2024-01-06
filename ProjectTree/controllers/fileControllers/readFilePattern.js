import { promises as fs } from "fs";
import { generalLogger } from "../../config/winstonConfig.js";
import { writeFilePattern } from "./index.js";

const isFileExist = async (filePath) => {
   try {
      await fs.access(filePath);
      return true;
   } catch {
      return false;
   }
};
export default async function readFilePattern(filePath, category) {
   const fullFilePath = `${filePath}.${category}`;
   const funcNote = `Full FilePath = ${fullFilePath}`;

   //handle reading txt or json file
   if (category !== "json" && category !== "txt") {
      generalLogger.error(`readFilePattern Func - ONLY input "json" or "txt" as reading file format! ${funcNote}`);
      return false;
   }

   try {
      const isTargetFileExist = await isFileExist(fullFilePath);

      // File does NOT Exist
      if (!isTargetFileExist) {
         generalLogger.warn(`File ${fullFilePath} is NOT exist!`);

         if (category === "json") return (await writeFilePattern(filePath, "json", {})) ? {} : false;

         return (await writeFilePattern(filePath, "txt", "")) ? "" : false;
      }

      // File Exists
      const data = await fs.readFile(fullFilePath, "utf-8");

      if (category === "txt") return data;

      try {
         return JSON.parse(data);
      } catch (err) {
         generalLogger.error(`readFilePattern Func - Parsing Json ERROR. Data = ${data}`);
         return {};
      }
   } catch (err) {
      generalLogger.error(`readFilePattern Func ${err}. ${funcNote}`);
      return false;
   }
}

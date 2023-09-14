import { promises as fs } from "fs";
import { generalLogger } from "../../utils/loggerConfig.js";

export default async function writeFilePattern(filePath, category, content) {
   const fullFilePath = `${filePath}.${category}`;
   const funcNote = `File path = ${fullFilePath}; Content = ${JSON.stringify(content)}`;

   //handle writing txt or json file
   if (category !== "json" && category !== "txt") {
      generalLogger.error(`writeFilePattern Func - ONLY input "json" or "txt" as writing file format! ${funcNote}`);
      return false;
   }

   try {
      const fileContent = category === "json" ? JSON.stringify(content, null, 2) : content;

      await fs.writeFile(fullFilePath, fileContent);

      return true;
   } catch (err) {
      generalLogger.error(`writeFilePattern Func ${err} ${funcNote}`);
      return false;
   }
}

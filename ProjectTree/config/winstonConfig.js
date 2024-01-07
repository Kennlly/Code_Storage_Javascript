//npm i winston
//npm i winston-daily-rotate-file
import { format, createLogger, transports } from "winston";
import dailyRotateFile from "winston-daily-rotate-file";
import * as Path from "path";
import { LOG_FOLDER } from "../utils/constants.js";

const { timestamp, combine, printf } = format;
const logFormat = printf(({ level, message, timestamp, stack }) => {
   return `[${timestamp}][${level}]: ${stack || message}`;
});

const customizeLog = (category) => {
   const customizeDir = `${LOG_FOLDER}${category}${Path.sep}`;
   const transport = new dailyRotateFile({
      dirname: customizeDir,
      filename: "%DATE%.log",
      datePattern: "YYYY-MM-DD",
   });

   return createLogger({
      level: "debug",
      format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }), format.errors({ stack: true }), logFormat),
      transports: [
         transport,
         new transports.Console({
            format: combine(
               format.colorize(),
               timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
               format.errors({ stack: true }),
               logFormat,
            ),
         }),
      ],
   });
};

export const generalLogger = customizeLog("general");

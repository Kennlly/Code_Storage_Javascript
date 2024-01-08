import Schedule from "node-schedule";
import { APP_RUNNING_ENV } from "../utils/constants.js";
import Logger from "../config/winstonConfig.js";
import { zipFolder } from "../utils/fileController.js";
import Ip from "ip";
// import integrateMainDailyJob from "./integrateMainDailyJob.js";

Schedule.scheduleJob("0 3 10 * *", async () => {
   const zipMainPromise = zipFolder("Main");
   const zipModelPromise = zipFolder("Model");
   await Promise.all([zipMainPromise, zipModelPromise]);
});

if (APP_RUNNING_ENV === "DEV" || APP_RUNNING_ENV === "UAT1" || APP_RUNNING_ENV === "PROD1") {
   Schedule.scheduleJob("30 3 * * *", async () => {
      // await integrateMainDailyJob();
   });
} else if (
   APP_RUNNING_ENV === "Local" ||
   APP_RUNNING_ENV === "UAT2" ||
   APP_RUNNING_ENV === "PROD2" ||
   APP_RUNNING_ENV === "Office"
) {
   Schedule.scheduleJob("30 4 * * *", async () => {
      // await integrateMainDailyJob();
   });
} else {
   return new Error("Unknown running environment!");
}

Logger.info(`The ??? Service STARTS!`);

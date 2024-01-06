import Schedule from "node-schedule";
import { APP_RUNNING_ENV } from "../../utils/constants.js";
import generalLogger from "../../utils/loggerConfig.js";
import zipFolder from "../../controllers/fileControllers/zipFolder.js";
import integrateMainDailyJob from "./integrateMainDailyJob.js";

Schedule.scheduleJob("0 3 10 * *", async () => {
   const zipMainPromise = zipFolder("Main");
   const zipModelPromise = zipFolder("Model");
   await Promise.all([zipMainPromise, zipModelPromise]);
});

if (APP_RUNNING_ENV === "VM1" || APP_RUNNING_ENV === "Local") {
   Schedule.scheduleJob("30 3 * * *", async () => {
      await integrateMainDailyJob();
   });
} else if (APP_RUNNING_ENV === "VM2" || APP_RUNNING_ENV === "Office") {
   Schedule.scheduleJob("30 4 * * *", async () => {
      await integrateMainDailyJob();
   });
} else {
   return new Error("Unknown running environment!");
}

generalLogger.info(`The ??? Service STARTS!`);

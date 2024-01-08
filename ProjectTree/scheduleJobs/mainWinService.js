// npm i node-windows
import Service from "node-windows";
import { PROJECT_FOLDER } from "../utils/constants.js";

const nodeService = Service.Service;

const svc = new nodeService({
   name: "???",
   description: "???",
   script: `${PROJECT_FOLDER}scheduleJobs\\mainWinService.js`,
});

svc.on("install", () => {
   svc.start();
});

svc.install();

//Uninstall
// svc.on("uninstall", () => {
// 	console.log("Uninstall complete.");
// 	console.log("The service exists: ", svc.exists);
// });

// svc.uninstall();

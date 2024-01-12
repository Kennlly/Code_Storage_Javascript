import LOGGER from "../../config/winstonConfig.js";
import restAPIService from "./restAPIService.js";

export const createChannel = async () => {
   const funcName = "[createChannel Func]";

   const url = "/api/v2/notifications/channels";

   try {
      return await restAPIService("POST", url, null, null);
   } catch (err) {
      LOGGER.error(`${funcName} Catching ERROR - ${err}.`);
      return false;
   }
};

export const removeChannel = async (id) => {
   const funcNote = `[removeChannel Func] [Channel Id = ${id}]`;

   const url = `/api/v2/notifications/channels/${id}/subscriptions`;

   try {
      return await restAPIService("DELETE", url, null, null);
   } catch (err) {
      LOGGER.error(`${funcNote} Catching ERROR - ${err}.`);
      return false;
   }
};

export const createSubscription = async (id, queryBody) => {
   const funcName = "[createSubscription Func]";
   const funcArgus = `[Channel Id = ${id}; Query Body = ${JSON.stringify(queryBody)}]`;

   const url = `/api/v2/notifications/channels/${id}/subscriptions`;
   try {
      return await restAPIService("POST", url, null, queryBody);
   } catch (err) {
      LOGGER.error(`${funcName} Catching ERROR - ${err} ${funcArgus} `);
      return false;
   }
};

// const result = await createSubscription();
// console.log("result", JSON.stringify(result, null, 3));

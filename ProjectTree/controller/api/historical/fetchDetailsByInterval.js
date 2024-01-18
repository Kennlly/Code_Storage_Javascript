import restAPIPattern from "../common/restAPIPattern.js";
import LOGGER from "../../../config/winstonConfig.js";

export default async function fetchDetailsByInterval(interval, pageNum) {
   const funcName = "[fetchDetailsByInterval Func]";
   const funcArgus = `[Interval = ${interval}; Page Number = ${pageNum}]`;

   const url = "/api/v2/analytics/conversations/details/query";
   const queryBody = {
      order: "asc",
      orderBy: "conversationStart",
      interval: interval,
      paging: {
         pageSize: "100",
         pageNumber: pageNum
      }
   };
   try {
      const data = await restAPIPattern("POST", url, null, queryBody);
      if (data === false) {
         LOGGER.error(`${funcName} - Getting API response ERROR! ${funcArgus}`);
         return false;
      }

      return data;
   } catch (err) {
      LOGGER.error(`${funcName} Catching ERROR - ${err} ${funcArgus}`);
      return false;
   }
}

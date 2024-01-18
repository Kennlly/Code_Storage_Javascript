import restAPIPattern from "../common/restAPIPattern.js";

export default async function fetchDetailsTotalHits(momentStart, momentEnd) {
   const funcName = "[fetchDetailsTotalHits Func]";
   const funcArgus = `[Moment Start Time = ${momentStart}; Moment End Time = ${momentEnd}]`;
   const url = "/api/v2/analytics/conversations/details/query";

   const startStr = momentStart.format("YYYY-MM-DDTHH:mm[Z]");
   const endStr = momentEnd.format("YYYY-MM-DDTHH:mm[Z]");
   const apiQuery = {
      interval: `${startStr}/${endStr}`
   };

   const data = await restAPIPattern("POST", url, null, apiQuery);
   if (data === false) throw new Error(`${funcName} - Getting API Response ERROR! ${funcArgus}`);

   return JSON.stringify(data) === "{}" ? 0 : data["totalHits"];
}

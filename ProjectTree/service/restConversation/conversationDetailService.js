import LOGGER from "../../config/winstonConfig.js";
import restAPIService from "../common/restAPIService.js";

export const fetchTotalHits = async (momentStart, momentEnd) => {
   const funcName = "[fetchTotalHits Func]";
   const funcArgus = `[Moment Start Time = ${momentStart}; Moment End Time = ${momentEnd}]`;
   const url = "/api/v2/analytics/conversations/details/query";

   const startStr = momentStart.format("YYYY-MM-DDTHH:mm[Z]");
   const endStr = momentEnd.format("YYYY-MM-DDTHH:mm[Z]");
   const apiQuery = {
      interval: `${startStr}/${endStr}`
   };

   const data = await restAPIService("POST", url, null, apiQuery);
   if (data === false) throw new Error(`${funcName} - Getting API Response ERROR! ${funcArgus}`);

   return JSON.stringify(data) === "{}" ? 0 : data["totalHits"];
};

export const fetchBulkConversationDetail = async (interval, pageNum) => {
   const funcName = "[fetchBulkConversationDetail Func]";
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
      const data = await restAPIService("POST", url, null, queryBody);
      if (data === false) {
         LOGGER.error(`${funcName} - Getting API response ERROR! ${funcArgus}`);
         return false;
      }

      return data;
   } catch (err) {
      LOGGER.error(`${funcName} Catching ERROR - ${err} ${funcArgus}`);
      return false;
   }
};

export const fetchContactDetail = async (contactListId, contactIds) => {
   const funcName = "[fetchContactDetail Func]";
   const funcArgus = `[ContactList Id = ${contactListId}; Contact Ids = ${JSON.stringify(contactIds)}]`;

   const url = `/api/v2/outbound/contactlists/${contactListId}/contacts/bulk`;

   try {
      const data = await restAPIService("POST", url, null, contactIds);
      if (data === false) {
         LOGGER.error(`${funcName} - Getting API response ERROR! ${funcArgus}`);
         return false;
      }

      return data;
   } catch (err) {
      LOGGER.error(`${funcName} Catching ERROR - ${err} ${funcArgus}`);
      return false;
   }
};

// const result = await fetchContactDetail("41ac8ea3-ebae-4a75-bc5e-33ba722640da", ["181f9d44f7639dffeb1b227c2e1e0862"]);
// console.log("result: ", JSON.stringify(result, null, 3));

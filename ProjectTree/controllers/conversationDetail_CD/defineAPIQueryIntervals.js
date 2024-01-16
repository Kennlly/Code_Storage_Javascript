import Moment from "moment";
import LOGGER from "../../config/winstonConfig.js";
import { fetchTotalHits } from "../../service/restConversation/conversationDetailService.js";

export default async function defineAPIQueryIntervals(initialInterval) {
   const funcName = "[defineAPIQueryIntervals Func]";
   const funcArgus = `[Initial Interval = ${initialInterval}]`;

   if (!initialInterval) {
      LOGGER.error(`${funcName} - Missing Required Arguments ERROR! ${funcArgus} `);
      return false;
   }

   try {
      const intervals = initialInterval.split("/");
      const momentStartTimestamp = Moment.utc(intervals[0], "YYYY-MM-DDTHH:mm[Z]", true);
      const isStartValid = momentStartTimestamp.isValid();
      const momentEndTimestamp = Moment.utc(intervals[1], "YYYY-MM-DDTHH:mm[Z]", true);
      const isEndValid = momentEndTimestamp.isValid();
      if (!isStartValid || !isEndValid) {
         LOGGER.error(
            `${funcName} - Invalid startTime and/or endTime ERROR! Required "YYYY-MM-DDTHH:mm[Z]" Pattern. ${funcArgus}`,
         );
         return false;
      }
      let diff = momentEndTimestamp.diff(momentStartTimestamp);
      if (diff <= 0) {
         LOGGER.error(`${funcName} - End Time is equal or earlier than Start Time ERROR! ${funcArgus}`);
         return false;
      }

      // Two conditions:
      // 1. Not exceed 7 days
      // 2. Not exceed 100,000 records
      let totalHits;

      diff = momentEndTimestamp.diff(momentStartTimestamp, "day");
      if (diff <= 7) totalHits = await fetchTotalHits(momentStartTimestamp, momentEndTimestamp);

      LOGGER.warn(`${funcName} - ${funcArgus} Total Hits = ${totalHits}.`);

      let tempMomentStart = momentStartTimestamp.clone();
      let definedIntervals = [];

      while (tempMomentStart < momentEndTimestamp || totalHits >= 100000) {
         const greedyMomentEnd = tempMomentStart.clone().add(7, "day");
         let tempMomentEnd = greedyMomentEnd < momentEndTimestamp ? greedyMomentEnd : momentEndTimestamp;

         totalHits = await fetchTotalHits(tempMomentStart, tempMomentEnd);

         while (totalHits >= 100000) {
            diff = tempMomentEnd.diff(tempMomentStart, "minute");

            let diffFormula;
            // Because conversations may overlap multiple intervals, Closer to 100000 can save API calls later
            // If it is greater than 200000, divided the diff by 2
            while (totalHits >= 200000) {
               diffFormula = Math.round(diff / 2);
               tempMomentEnd = tempMomentStart.clone().add(diffFormula, "minute");
               totalHits = await fetchTotalHits(tempMomentStart, tempMomentEnd);
               diff = tempMomentEnd.diff(tempMomentStart, "minute");
            }

            // If it is between 100000 ~ 200000, minus the end time by 2 hours and try
            while (totalHits >= 100000) {
               diffFormula = Math.round(diff - 120);
               tempMomentEnd = tempMomentStart.clone().add(diffFormula, "minute");
               totalHits = await fetchTotalHits(tempMomentStart, tempMomentEnd);
               diff = tempMomentEnd.diff(tempMomentStart, "minute");
            }
         }

         const startStr = tempMomentStart.format("YYYY-MM-DDTHH:mm[Z]");
         const endStr = tempMomentEnd.format("YYYY-MM-DDTHH:mm[Z]");
         definedIntervals.push(`${startStr}/${endStr}`);
         LOGGER.debug(`${funcName} - Sub Interval = ${startStr}/${endStr}; Total Hits = ${totalHits}.`);

         tempMomentStart = tempMomentEnd;
      }

      return definedIntervals;
   } catch (err) {
      LOGGER.error(`${funcName} ${funcArgus} Catching ERROR - ${err}.`);
      return false;
   }
}

// const result = await defineAPIQueryIntervals("2023-08-01T04:00Z/2023-08-15T05:00Z");
// console.log("result: ", result);
// console.log("result length: ", result.length);

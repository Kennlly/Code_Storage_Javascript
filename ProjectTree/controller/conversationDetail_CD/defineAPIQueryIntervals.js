import moment from "moment";

export const subdivideQueryInterval = async (initialInterval, category) => {
   const funcName = "[subdivideQueryInterval Func]";
   const funcArgus = `[Initial Interval = ${initialInterval}; Category = ${category}]`;

   if (!initialInterval || !category) {
      throw new Error(`${funcName} ${funcArgus} - Unexpected Empty Parameters ERROR!`);
   }

   try {
      const { momentStartTime, momentEndTime } = validateStartAndEndTime(initialInterval);

      // Two conditions:
      // 1. Interval does Not exceed 7 days
      // 2. TotalHits does Not exceed 100,000
      const getTotalHits = category === "userDetail" ? fetchUserDetailTotalHits : undefined;

      let totalHits, diff;

      diff = momentEndTime.diff(momentStartTime, "day");
      if (diff <= 7) totalHits = await getTotalHits(momentStartTime, momentEndTime);

      logger.debug(`${funcName} ${funcArgus} - Total Hits = ${totalHits}.`);

      let tempMomentStart = momentStartTime.clone();
      let definedIntervals = [];

      while (tempMomentStart < momentEndTime || totalHits >= 100000) {
         let tempMomentEnd = tempMomentStart.clone().add(7, "day");
         tempMomentEnd = tempMomentEnd < momentEndTime ? tempMomentEnd : momentEndTime;

         totalHits = await getTotalHits(tempMomentStart, tempMomentEnd);

         while (totalHits >= 100000) {
            diff = tempMomentEnd.diff(tempMomentStart, "minute");

            // Because conversations may overlap multiple intervals, Closer to 100000 can save API calls later
            // If it is greater than 200000, divided the diff by 2
            // If it is between 100000 ~ 200000, minus the end time by 2 hours and try
            if (totalHits >= 200000) {
               tempMomentEnd = tempMomentStart.clone().add(Math.round(diff / 2), "minute");
            } else {
               tempMomentEnd = tempMomentStart.clone().add(Math.round(diff - 120), "minute");
            }

            totalHits = await getTotalHits(tempMomentStart, tempMomentEnd);
         }

         const startStr = tempMomentStart.format("YYYY-MM-DDTHH:mm[Z]");
         const endStr = tempMomentEnd.format("YYYY-MM-DDTHH:mm[Z]");
         definedIntervals.push(`${startStr}/${endStr}`);
         logger.debug(`${funcName} - Sub Interval = ${startStr}/${endStr}; Total Hits = ${totalHits}.`);

         tempMomentStart = tempMomentEnd;
      }

      return definedIntervals;
   } catch (err) {
      throw new Error(`${funcName} ${funcArgus} Catching ERROR - ${err}`);
   }
};

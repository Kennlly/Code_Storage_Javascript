import moment from "moment";

export const defineQueryInterval = (intervalFromDb) => {
   const funcName = "[defineQueryInterval Func]";
   const funcArgus = `[IntervalFromDB = ${intervalFromDb}]`;

   const dbEndTime = intervalFromDb?.split("/")[1];

   const momentStartTime = dbEndTime ? moment.utc(dbEndTime) : moment.utc().startOf("day");
   const queryStartTime = momentStartTime.format("YYYY-MM-DDTHH:mm[Z]");

   const queryEndTime = moment.utc().format("YYYY-MM-DDTHH:mm[Z]");

   if (queryStartTime === queryEndTime) {
      throw new Error(`${funcName} ${funcArgus} - Query StartTime: ${queryStartTime} EQUALS Query EndTime ERROR!`);
   }

   return `${queryStartTime}/${queryEndTime}`;
};

export const subdivideQueryInterval = (momentStartTime, momentEndTime, outputDatetimeStrPattern, requiredIntervalInMin) => {
   const funcName = "[subdivideQueryInterval Func]";
   const funcArgus = `[Moment Start Time = ${momentStartTime}; Moment End Time = ${momentEndTime}; Output Datetime String Pattern = ${outputDatetimeStrPattern}; Required Interval In Min =${requiredIntervalInMin}]`;

   if (!momentStartTime || !momentEndTime || !outputDatetimeStrPattern || !requiredIntervalInMin) {
      throw new Error(`${funcName} ${funcArgus} - Unexpected Empty Parameters ERROR!`);
   }

   if (!momentStartTime.isValid() || !momentEndTime.isValid()) {
      throw new Error(`${funcName} ${funcArgus} - Invalid startTime and/or endTime ERROR!`);
   }

   const diff = momentEndTime.diff(momentStartTime, "minute");
   if (diff <= 0) {
      throw new Error(`${funcName} ${funcArgus} - End time is EARLIER/EQUAL start time ERROR!`);
   }

   let leftMoment = momentStartTime.clone();
   let definedIntervals = [];
   try {
      while (leftMoment < momentEndTime) {
         const tempRightMoment = leftMoment.clone().add(requiredIntervalInMin, "minute");
         const rightMoment = tempRightMoment < momentEndTime ? tempRightMoment : momentEndTime;
         const startStr = leftMoment.format(outputDatetimeStrPattern);
         const endStr = rightMoment.format(outputDatetimeStrPattern);
         definedIntervals.push(`${startStr}/${endStr}`);

         leftMoment = rightMoment;
      }

      return definedIntervals;
   } catch (err) {
      throw new Error(`${funcName} ${funcArgus} Catching ERROR - ${err}`);
   }
};

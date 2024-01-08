import Moment from "moment";
import { Logger } from "../config/winstonConfig.js";

export default function defineIntervals(
   startTime,
   endTime,
   inputDatetimeStrPattern,
   outputDatetimeStrPattern,
   requiredIntervalInMin,
) {
   const funcName = "[defineIntervals Func]";
   const funcArgus = `[Start Time = ${startTime}; End Time = ${endTime}; Input Datetime String Pattern = ${inputDatetimeStrPattern}; Output Datetime String Pattern = ${outputDatetimeStrPattern}; Required Interval In Min =${requiredIntervalInMin}]`;

   if (!startTime || !endTime || !inputDatetimeStrPattern || !outputDatetimeStrPattern || !requiredIntervalInMin) {
      Logger.error(`${funcName} - Missing Required Arguments ERROR! ${funcArgus} `);
      return false;
   }

   try {
      const momentStartTimestamp = Moment(startTime, inputDatetimeStrPattern, true);
      const isStartValid = momentStartTimestamp.isValid();
      const momentEndTimestamp = Moment(endTime, inputDatetimeStrPattern, true);
      const isEndValid = momentEndTimestamp.isValid();
      if (!isStartValid || !isEndValid) {
         Logger.error(`${funcName} - Invalid startTime and/or endTime ERROR! ${funcArgus}`);
         return false;
      }

      const diff = momentEndTimestamp.diff(momentStartTimestamp, "minute");

      if (diff < 0) {
         Logger.error(`${funcName} - End time is EARLIER than start time! ${funcArgus}`);
         return false;
      }

      if (diff <= requiredIntervalInMin) {
         const momentEndTime = momentStartTimestamp.clone().add(requiredIntervalInMin, "minute");
         // Note: one scenario is UTC from the database, but it actually means the EST
         const startStr = momentStartTimestamp.utcOffset(Moment().utcOffset()).format(outputDatetimeStrPattern);
         const endStr = momentEndTime.utcOffset(Moment().utcOffset()).format(outputDatetimeStrPattern);

         return [`${startStr}/${endStr}`];
      }

      let leftMoment = momentStartTimestamp.clone();

      let definedIntervals = [];
      while (leftMoment < momentEndTimestamp) {
         const tempRightMoment = leftMoment.clone().add(requiredIntervalInMin, "minute");
         const rightMoment = tempRightMoment < momentEndTimestamp ? tempRightMoment : momentEndTimestamp;
         const startStr = leftMoment.utcOffset(Moment().utcOffset()).format(outputDatetimeStrPattern);
         const endStr = rightMoment.utcOffset(Moment().utcOffset()).format(outputDatetimeStrPattern);
         definedIntervals.push(`${startStr}/${endStr}`);

         leftMoment = rightMoment;
      }

      return definedIntervals;
   } catch (err) {
      Logger.error(`${funcName} ${funcArgus} Catching ERROR - ${err}.`);
      return false;
   }
}

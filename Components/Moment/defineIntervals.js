import Moment from "moment";
import LOGGER from "./loggerConfig.js";

export default function defineIntervals(startTime, endTime, requireIntervalInMin) {
   const funcNote = `[Note: [defineIntervals Func] Start timestamp = ${startTime}; End timestamp = ${endTime}; RequireIntervalInMin = ${requireIntervalInMin}] -`;

   if (!startTime || !endTime || !requireIntervalInMin) {
      LOGGER.error(
         `${funcNote} Unexpected EMPTY "start timestamp" and/or "end timestamp" and/or "require interval in minutes" parameters ERROR!`,
      );
      return false;
   }

   const momentStartTimestamp = Moment(startTime, "YYYY-MM-DD HH:mm:ss", true);
   const isStartValid = momentStartTimestamp.isValid();
   const momentEndTimestamp = Moment(endTime, "YYYY-MM-DD HH:mm:ss", true);
   const isEndValid = momentEndTimestamp.isValid();
   if (!isStartValid || !isEndValid) throw new Error(`[${funcNote}]: Invalid startTime and/or endTime ERROR!`);

   const diff = momentEndTimestamp.diff(momentStartTimestamp, "minute");
   if (diff < 0) {
      LOGGER.error(`${funcNote} End time is EARLIER than start time ERROR!`);
      return false;
   }

   try {
      if (diff <= requireIntervalInMin) {
         const momentEndTime = momentStartTimestamp.clone().add(requireIntervalInMin, "minute");
         const startStr = momentStartTimestamp.utcOffset(Moment().utcOffset()).format("YYYY-MM-DD HH:mm:ss");
         const endStr = momentEndTime.utcOffset(Moment().utcOffset()).format("YYYY-MM-DD HH:mm:ss");

         return [`${startStr}/${endStr}`];
      }

      let leftMoment = momentStartTimestamp.clone();

      let definedIntervals = [];
      while (leftMoment < momentEndTimestamp) {
         const tempRightMoment = leftMoment.clone().add(requireIntervalInMin, "minute");
         const rightMoment = tempRightMoment < momentEndTimestamp ? tempRightMoment : momentEndTimestamp;
         const startStr = leftMoment.utcOffset(Moment().utcOffset()).format("YYYY-MM-DD HH:mm:ss");
         const endStr = rightMoment.utcOffset(Moment().utcOffset()).format("YYYY-MM-DD HH:mm:ss");
         definedIntervals.push(`${startStr}/${endStr}`);

         leftMoment = rightMoment;
      }

      return definedIntervals;
   } catch (err) {
      LOGGER.error(`${funcNote} ${err}`);
      return false;
   }
}

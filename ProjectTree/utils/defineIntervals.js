import Moment from "moment";
import { generalLogger } from "./loggerConfig.js";

export default function defineIntervals(startTime, endTime, requireIntervalInMin) {
   const funcNote = `Start timestamp = ${startTime}; End timestamp = ${endTime}; RequireIntervalInMin = ${requireIntervalInMin}.`;
   if (!startTime || !endTime || !requireIntervalInMin) {
      generalLogger.error(
         `defineIntervals Func - Unexpected EMPTY "start timestamp" and/or "end timestamp" and/or "require interval in minutes" parameters ERROR!`,
      );
      return false;
   }

   try {
      const momentStartTimestamp = Moment(startTime, "YYYY-MM-DD HH:mm:ss.SSS Z", true);
      const isStartValid = momentStartTimestamp.isValid();
      const momentEndTimestamp = Moment(endTime, "YYYY-MM-DD HH:mm:ss Z", true);
      const isEndValid = momentEndTimestamp.isValid();
      if (!isStartValid || !isEndValid) {
         generalLogger.error(`defineIntervals Func - Invalid startTime and/or endTime ERROR! ${funcNote}`);
         return false;
      }

      const diff = momentEndTimestamp.diff(momentStartTimestamp, "minute");

      if (diff < 0) {
         generalLogger.error(`defineIntervals Func - End time is EARLIER than start time! ${funcNote}`);
         return false;
      }

      if (diff <= requireIntervalInMin) {
         const momentEndTime = momentStartTimestamp.clone().add(requireIntervalInMin, "minute");
         const startStr = momentStartTimestamp.utcOffset(Moment().utcOffset()).format("YYYY-MM-DD HH:mm:ss.SSS Z");
         const endStr = momentEndTime.utcOffset(Moment().utcOffset()).format("YYYY-MM-DD HH:mm:ss.SSS Z");

         return [`${startStr}/${endStr}`];
      }

      let leftMoment = momentStartTimestamp.clone();

      let definedIntervals = [];
      while (leftMoment < momentEndTimestamp) {
         const tempRightMoment = leftMoment.clone().add(requireIntervalInMin, "minute");
         const rightMoment = tempRightMoment < momentEndTimestamp ? tempRightMoment : momentEndTimestamp;
         const startStr = leftMoment.utcOffset(Moment().utcOffset()).format("YYYY-MM-DD HH:mm:ss.SSS Z");
         const endStr = rightMoment.utcOffset(Moment().utcOffset()).format("YYYY-MM-DD HH:mm:ss.SSS Z");
         definedIntervals.push(`${startStr}/${endStr}`);

         leftMoment = rightMoment;
      }

      return definedIntervals;
   } catch (err) {
      generalLogger.error(`defineIntervals Func ${err}. ${funcNote}`);
      return false;
   }
}

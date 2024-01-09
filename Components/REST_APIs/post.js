// Genesys limits a total of 100,000 records as per payload, so we need to check and adjust the query interval
const getPOSTMethodQueryTotal = async (category, queryInterval, agentID = null) => {
   const queryNote = `Category = ${category}, Query Interval = ${queryInterval}, AgentID = ${agentID}`;
   try {
      const apiEndPoint =
         category === "Conversation"
            ? `${GENESYS_ENDPOINT_URL}/api/v2/analytics/conversations/details/query`
            : `${GENESYS_ENDPOINT_URL}/api/v2/analytics/users/details/query`;
      const apiQueryBody = agentID
         ? {
              interval: queryInterval,
              userFilters: [
                 {
                    type: "and",
                    predicates: [
                       {
                          type: "dimension",
                          dimension: "userId",
                          operator: "matches",
                          value: agentID,
                       },
                    ],
                 },
              ],
           }
         : {
              interval: queryInterval,
           };

      const data = await basicPOSTMethod(apiEndPoint, apiQueryBody);
      if (!data) {
         LOGGER.error(`getPOSTMethodQueryTotal Func - Requesting API ERROR! ${queryNote}`);
         return false;
      }
      return data.totalHits;
   } catch (err) {
      LOGGER.error(`getPOSTMethodQueryTotal Func ${err}. ${queryNote}`);
      return false;
   }
};

const definePOSTMethodQueryIntervals = async (category, initialInterval, agentID = null) => {
   /*There are two rules for Genesys POST conversation/user detail interval API
	1. interval MUST be within 7 days
	2. totalHits for the interval cannot be exceed 100,000
	*/
   try {
      const initialIntervalArr = initialInterval.split("/");
      const initialStartTime = moment.utc(initialIntervalArr[0]);
      const initialEndTime = moment.utc(initialIntervalArr[1]);
      const initialTimeDiff = initialEndTime.diff(initialStartTime, "day");
      if (initialTimeDiff <= 7) {
         const initialTotalCnt = await getPOSTMethodQueryTotal(category, initialInterval, agentID);
         if (initialTotalCnt <= 100000) return [initialInterval];

         LOGGER.info(`Define POST method query intervals function triggered. Initial Interval = ${initialInterval}.`);
         let intervalResult = [];
         let forwardingStartTime = initialStartTime.clone();
         while (forwardingStartTime < initialEndTime) {
            //because within 7 days, we use timeDiff to define the forwarding endTime
            let adjustingTimeDiff = initialEndTime.diff(forwardingStartTime);
            let forwardingEndTime = forwardingStartTime.clone().add(adjustingTimeDiff);
            let forwardingStartTimeStr = forwardingStartTime.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
            let forwardingEndTimeStr = forwardingEndTime.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
            let queryInterval = `${forwardingStartTimeStr}/${forwardingEndTimeStr}`;
            let tempTotalCnt = await getPOSTMethodQueryTotal(category, queryInterval, agentID);
            if (tempTotalCnt <= 100000) {
               intervalResult.push(queryInterval);
               forwardingStartTime = forwardingEndTime.clone();
            } else {
               while (tempTotalCnt > 100000) {
                  adjustingTimeDiff = forwardingEndTime.diff(forwardingStartTime) / 2;
                  forwardingEndTime = forwardingStartTime.clone().add(adjustingTimeDiff);
                  forwardingEndTimeStr = forwardingEndTime.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
                  queryInterval = `${forwardingStartTimeStr}/${forwardingEndTimeStr}`;
                  tempTotalCnt = await getPOSTMethodQueryTotal(category, queryInterval, agentID);
               }
               intervalResult.push(queryInterval);
               forwardingStartTime = forwardingEndTime.clone();
            }
         }
         LOGGER.info(
            `Define POST method query intervals function finished. Interval result = ${JSON.stringify(intervalResult)}.`,
         );
         return intervalResult;
      }

      LOGGER.info(`Define POST method query intervals function triggered. Initial Interval = ${initialInterval}.`);
      let intervalResult = [];
      let forwardingStartTime = initialStartTime.clone();
      while (forwardingStartTime < initialEndTime) {
         //because it exceeds 7 days, we use endTime to define the timeDiff
         let forwardingEndTime =
            forwardingStartTime.clone().add(7, "day") <= initialEndTime
               ? forwardingStartTime.clone().add(7, "day")
               : initialEndTime;
         let adjustingTimeDiff = forwardingEndTime.diff(forwardingStartTime);
         let forwardingStartTimeStr = forwardingStartTime.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
         let forwardingEndTimeStr = forwardingEndTime.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
         let queryInterval = `${forwardingStartTimeStr}/${forwardingEndTimeStr}`;
         let tempTotalCnt = await getPOSTMethodQueryTotal(category, queryInterval, agentID);
         if (tempTotalCnt <= 100000) {
            intervalResult.push(queryInterval);
            forwardingStartTime = forwardingEndTime.clone();
         } else {
            while (tempTotalCnt > 100000) {
               adjustingTimeDiff = forwardingEndTime.diff(forwardingStartTime) / 2;
               forwardingEndTime = forwardingStartTime.clone().add(adjustingTimeDiff);
               forwardingEndTimeStr = forwardingEndTime.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
               queryInterval = `${forwardingStartTimeStr}/${forwardingEndTimeStr}`;
               tempTotalCnt = await getPOSTMethodQueryTotal(category, queryInterval, agentID);
            }
            intervalResult.push(queryInterval);
            forwardingStartTime = forwardingEndTime.clone();
         }
      }
      LOGGER.info(`Define POST method query intervals function finished. Interval result = ${JSON.stringify(intervalResult)}.`);
      return intervalResult;
   } catch (err) {
      LOGGER.error(
         `definePOSTMethodQueryIntervals Func ${err}. Category = ${category}, Initial interval = ${initialInterval}, AgentID = ${agentID}.`,
      );
      return false;
   }
};

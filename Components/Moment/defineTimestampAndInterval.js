import Moment from "moment";

const defineDBQueryInterval = async (category, initialInterval, QUARTERLY_JOB_DB_INFO) => {
   let funcNote = `Category = ${category}. Initial interval = ${initialInterval}.`;
   try {
      if (initialInterval) {
         const intervalArr = initialInterval.split("/");
         const definedStartTime = intervalArr[0];
         const definedEndTime = intervalArr[1];
         return { definedStartTime, definedEndTime };
      }

      let storeTableName = -1;
      let sourceTableName = -1;
      switch (category) {
         case "AS":
            storeTableName = "AgentStat";
            sourceTableName = "[dbo].[Stat_AgentActivity_I]";
            break;
         case "QS":
            storeTableName = "QueueStat";
            sourceTableName = "[dbo].[Stat_QueueActivity_I]";
            break;
         case "AQS":
            storeTableName = "AgentQueueStat";
            sourceTableName = "[dbo].[Stat_AgentActivityByQueue_I]";
            break;
         default:
            throw new Error(`Unknown category input: ${category}`);
      }

      const timestampFromStoreTableQuery = `SELECT Timestamp AS TimestampFromStore FROM CTT_Calabrio_API_LastTimestampStore WHERE TableName = '${storeTableName}'`;
      const timestampFromStorePromise = basicDBQuery(QUARTERLY_JOB_DB_INFO, timestampFromStoreTableQuery);
      const timestampFromSourceTableQuery = `SELECT MAX(StartDateTime) AS TimestampFromSource FROM ${sourceTableName}`;
      const timestampFromSourcePromise = basicDBQuery(QUARTERLY_JOB_DB_INFO, timestampFromSourceTableQuery);
      const [timestampFromStore, timestampFromSource] = await Promise.all([
         timestampFromStorePromise,
         timestampFromSourcePromise,
      ]);
      if (!timestampFromStore || !timestampFromSource)
         throw new Error("Get timestamps from storage table / source table ERROR!");

      if (timestampFromSource.recordset.length === 0) throw new Error(`No data in source table ${storeTableName}!`);

      const momentTimestampFromSource = moment.utc(
         timestampFromSource.recordset[0].TimestampFromSource,
         "YYYY-MM-DD HH:mm:ss.SSS",
         true,
      );

      const timestampFromSourceStr = momentTimestampFromSource.format("YYYY-MM-DD HH:mm");

      //Store table does not have timestamp for the table: Insert the "timestampFromSource" to [CTT_Calabrio_API_LastTimestampStore]
      if (timestampFromStore.recordset.length === 0 || !timestampFromStore.recordset[0].TimestampFromStore) {
         const insertStoreQuery = `INSERT INTO CTT_Calabrio_API_LastTimestampStore VALUES ('${storeTableName}','${timestampFromSourceStr}')`;
         const insertionResult = await basicDBQuery(QUARTERLY_JOB_DB_INFO, insertStoreQuery);
         if (insertionResult.rowsAffected[0] === 1) {
            Logger.info(`First time insert ${storeTableName} SUCCEED!`);
            return true;
         }
         throw new Error(`${storeTableName} store table has no data, but occurs insertion ERROR!`);
      }

      //Store table does have timestamp for the table:
      const momentTimestampFromStore = moment.utc(timestampFromStore.recordset[0].TimestampFromStore);
      const timeDiff = momentTimestampFromSource.diff(momentTimestampFromStore);
      const definedStartTime = momentTimestampFromStore.format("YYYY-MM-DD HH:mm");
      const definedEndTime = timestampFromSourceStr;

      if (timeDiff < 0)
         throw new Error(
            `${storeTableName} has "Source" less than "Store" result! Source timestamp = ${definedEndTime}, store timestamp = ${definedStartTime}.`,
         );

      if (timeDiff === 0) {
         Logger.info(`${sourceTableName} does NOT update after ${definedEndTime}`);
         return true;
      }

      return { definedStartTime, definedEndTime };
   } catch (err) {
      Logger.error(`defineDBQueryInterval Func ${err} ${funcNote}`);
      return false;
   }
};

const defineStartEndTime = async (interval, timestampRecordFileName) => {
   const funcNote = `Initial interval = ${interval}, timestampRecordFileName = ${timestampRecordFileName}.`;
   try {
      if (interval && timestampRecordFileName) {
         Logger.error(
            `defineStartEndTime Func - Interval and Timestamp record file name should NOT be provided at the same time! ${funcNote}`,
         );
         return false;
      }

      if (!interval) {
         let tempStartTimeStr = await asyncReadingFile("txt", timestampRecordFileName);
         const tempEndTime = moment.utc().format("YYYY-MM-DDTHH:mm[Z]");
         const adjustedEndTimeStr = backwardTimestamp(tempEndTime);
         const momentAdjustedEndTime = moment.utc(adjustedEndTimeStr, "YYYY-MM-DDTHH:mm[Z]", true);
         if (!tempStartTimeStr) {
            tempStartTimeStr = momentAdjustedEndTime.clone().subtract(1, "hour").format("YYYY-MM-DDTHH:mm[Z]");
         }
         await asyncWritingFile("txt", timestampRecordFileName, adjustedEndTimeStr);
         return defineStartEndTime(`${tempStartTimeStr}/${adjustedEndTimeStr}`);
      }

      const initialTimeArr = interval.split("/");
      const momentInitialStartTime = moment.utc(initialTimeArr[0], "YYYY-MM-DDTHH:mm[Z]", true);
      const momentInitialEndTime = moment.utc(initialTimeArr[1], "YYYY-MM-DDTHH:mm[Z]", true);
      const initialTimeDiff = momentInitialEndTime.diff(momentInitialStartTime, "minute");
      const adjustedStartTime = backwardTimestamp(initialTimeArr[0]);
      const adjustedEndTime =
         initialTimeDiff >= 30 ? backwardTimestamp(initialTimeArr[1]) : forwardTimestamp(initialTimeArr[1]);

      return { adjustedStartTime, adjustedEndTime };
   } catch (err) {
      Logger.error(`defineStartEndTime Func ${err}. ${funcNote}`);
      return false;
   }
};

const backwardTimestamp = (context, momentTimestamp) => {
   try {
      if (!momentTimestamp) {
         context.error(`backwardTimestamp Func - Parameter "timeStamp" is Required!`);
         return false;
      }

      const dateStr = momentTimestamp.format("YYYY-MM-DD");
      const hourStr = momentTimestamp.format("HH");
      const tempMinStr = momentTimestamp.format("mm");
      const minuteStr = Number(tempMinStr) >= 30 ? "30" : "00";

      return moment.utc(`${dateStr} ${hourStr}:${minuteStr}`, "YYYY-MM-DD HH:mm", true);
   } catch (err) {
      context.error(`backwardTimestamp Func ${err}. Timestamp = ${momentTimestamp}.`);
      return false;
   }
};

const forwardTimestamp = (timestamp) => {
   try {
      if (!timestamp) {
         Logger.error(`forwardTimestamp Func - Parameter "timeStamp" is Required! Timestamp = ${timestamp}.`);
         return false;
      }
      const forwardHalfHourStr = moment
         .utc(timestamp, "YYYY-MM-DDTHH:mm[Z]", true)
         .clone()
         .add(30, "minute")
         .format("YYYY-MM-DDTHH:mm[Z]");
      return backwardTimestamp(forwardHalfHourStr);
   } catch (err) {
      Logger.error(`forwardTimestamp Func ${err}. Timestamp = ${timestamp}.`);
      return false;
   }
};

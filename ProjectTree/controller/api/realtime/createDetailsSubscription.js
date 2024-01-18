import Moment from "moment";
import fetchLookupByCategory from "../api/lookup/fetchLookupByCategory.js";
import LOGGER from "../../config/winstonConfig.js";
import SequelizeConfig from "../../config/sequelizeConfig.js";
import { INFO_FOLDER } from "../../utils/constants.js";
import { readFile, writeFile } from "../../utils/fileManagement.js";
import createSubscriptionPattern from "./createSubscriptionPattern.js";
import contactInfoAndDetailsIVRMapper from "../../mapper/contactInfoAndDetailsIVRMapper.js";
import upsertContactInfoService from "../../service/upsertContactInfoService.js";
import upsertDetailsIVRService from "../../service/upsertDetailsIVRService.js";

const getQueues = async () => {
   const funcName = "[getQueues Func]";
   const stageTime = Moment().format("YYYY-MM-DD HH:mm Z");

   let queueIds;
   try {
      // Option 1: Getting from API
      const apiData = await fetchLookupByCategory("queues");

      if (apiData === false) {
         LOGGER.error(`${funcName} - Getting Queues From Genesys API ERROR!`);

         // Option 2: Getting from the database
         const [results] = await SequelizeConfig.query(
            "SELECT DISTINCT [QueueId] FROM [genesysAPI].[dbo].[Gen_Queue] WHERE StageTime = (SELECT MAX(StageTime) FROM [Gen_Queue])"
         );

         if (results.length === 0) {
            LOGGER.error(`${funcName} - Unexpected EMPTY Result From Database ERROR!`);
            return false;
         }

         queueIds = results.map((data) => data["QueueId"]);

         return await writeFile(`${INFO_FOLDER}queuesInfo`, "json", { stageTime, queueIds });
      }

      queueIds = apiData.map((data) => data["id"]);

      return await writeFile(`${INFO_FOLDER}queuesInfo`, "json", { stageTime, queueIds });
   } catch (err) {
      LOGGER.error(`${funcName} Catching ERROR - ${err}.`);
      return false;
   }
};

const createTopics = async () => {
   const funcName = "[createTopics Func]";

   let localFileData = await readFile(`${INFO_FOLDER}queuesInfo`, "json");

   if (JSON.stringify(localFileData) === "{}") {
      const refreshResult = await getQueues();
      if (refreshResult === false) throw new Error(`${funcName} - Refreshing Queues Info ERROR!`);

      localFileData = await readFile(`${INFO_FOLDER}queuesInfo`, "json");
   }

   const { queueIds } = localFileData;
   if (queueIds.length === 0) throw new Error(`${funcName} - Unexpected EMPTY Queue Ids From Local File ERROR!`);

   return queueIds.map((queueId) => ({ id: `v2.routing.queues.${queueId}.conversations` }));
};

const handleData = async (data) => {
   const funcName = "[handleData Func]";
   const funcArgus = `[Data = ${JSON.stringify(data, null, 3)}]`;

   try {
      const dataObj = contactInfoAndDetailsIVRMapper(data);
      if (dataObj === false) {
         LOGGER.error(`${funcName} - Extracting Payload ERROR From Mapper!`);
         return false;
      }

      const { ivrData, contactInfoData } = dataObj;
      const ivrPromise = upsertDetailsIVRService(ivrData);
      const contactInfoPromise = upsertContactInfoService(contactInfoData);

      const [ivrResult, contactInfoResult] = await Promise.all([ivrPromise, contactInfoPromise]);

      return ivrResult && contactInfoResult;
   } catch (err) {
      LOGGER.error(`${funcName} Catching ERROR - ${err}\n${funcArgus} `);
      return false;
   }
};

export default async function createDetailsSubscription() {
   const funcName = "[createDetailsSubscription Func]";
   try {
      const topics = await createTopics();

      // 1000 topics for each WebSocket
      let separatedTopics = [];
      let temp = [];
      for (let i = 0; i < topics.length; i++) {
         temp.push(topics[i]);

         if (temp.length === 1000) {
            separatedTopics.push(temp);
            temp = [];
         }

         if (i === topics.length - 1 && temp.length !== 0) separatedTopics.push(temp);
      }

      for (const topics of separatedTopics) {
         await createSubscriptionPattern("conversation", topics, handleData);
      }
   } catch (err) {
      LOGGER.error(`${funcName} Catching ERROR - ${err}.`);
      return false;
   }
}

// await createDetailsSubscription();

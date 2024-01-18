import Moment from "moment";
import { fetchQueue } from "../../service/fromNotiAPI/lookupsService.js";
import LOGGER from "../../config/winstonConfig.js";
import SequelizeConfig from "../../config/sequelizeConfig.js";
import { INFO_FOLDER } from "../../utils/constants.js";
import { readFile, writeFile } from "../../utils/fileManagement.js";
import createNoti from "./createNoti.js";
import mediaTypeOrientDetailMapper from "../../mapper/mediaTypeOrientDetailMapper.js";
import notiDetailIVREntity from "../../entity/fromNotiAPI/notiDetailIVREntity.js";
import notiContactInfoEntity from "../../entity/fromNotiAPI/notiContactInfoEntity.js";

const getQueue = async () => {
   const funcName = "[getQueue Func]";
   const stageTime = Moment().format("YYYY-MM-DD HH:mm Z");

   let queueIds;
   try {
      // Option 1: Getting from API
      const apiData = await fetchQueue();

      if (apiData === false) {
         LOGGER.error(`${funcName} - Getting Queue From Genesys API ERROR!`);

         // Option 2: Getting from the database
         const [results] = await SequelizeConfig.query(
            "SELECT DISTINCT [QueueId] FROM [genesysAPI].[dbo].[Gen_Queue] WHERE StageTime = (SELECT MAX(StageTime) FROM [Gen_Queue])"
         );

         if (results.length === 0) {
            LOGGER.error(`${funcName} - Unexpected EMPTY Result From Database ERROR!`);
            return false;
         }

         queueIds = results.map((data) => data["QueueId"]);

         return await writeFile(`${INFO_FOLDER}queueInfo`, "json", { stageTime, queueIds });
      }

      queueIds = apiData.map((data) => data["id"]);

      return await writeFile(`${INFO_FOLDER}queueInfo`, "json", { stageTime, queueIds });
   } catch (err) {
      LOGGER.error(`${funcName} Catching ERROR - ${err}.`);
      return false;
   }
};

const createTopics = async () => {
   const funcName = "[createTopics Func]";

   let localFileData = await readFile(`${INFO_FOLDER}queueInfo`, "json");

   if (JSON.stringify(localFileData) === "{}") {
      const refreshResult = await getQueue();
      if (refreshResult === false) throw new Error(`${funcName} - Refreshing Queue Info ERROR!`);

      localFileData = await readFile(`${INFO_FOLDER}queueInfo`, "json");
   }

   const { queueIds } = localFileData;
   if (queueIds.length === 0) throw new Error(`${funcName} - Unexpected EMPTY Queue Ids From Local File ERROR!`);

   return queueIds.map((queueId) => ({ id: `v2.routing.queues.${queueId}.conversations` }));
};

const handleData = async (data) => {
   const funcName = "[handleData Func]";
   const funcArgus = `[Data = ${JSON.stringify(data, null, 3)}]`;

   try {
      const dataObj = mediaTypeOrientDetailMapper(data);
      if (dataObj === false) {
         LOGGER.error(`${funcName} - Extracting Payload ERROR From Mapper!`);
         return false;
      }

      const { ivrData, contactInfoData } = dataObj;
      const ivrPromise = handleIVRData(ivrData);
      const contactInfoPromise = handleContactInfoData(contactInfoData);

      const [ivrResult, contactInfoResult] = await Promise.all([ivrPromise, contactInfoPromise]);

      return ivrResult && contactInfoResult;
   } catch (err) {
      LOGGER.error(`${funcName} Catching ERROR - ${err}\n${funcArgus} `);
      return false;
   }
};

const handleIVRData = async (data) => {
   const funcName = "[handleIVRData Func]";
   const funcArgus = `[Data = ${JSON.stringify(data, null, 3)}]`;

   try {
      if (data.length === 0) return true;

      await Promise.all(
         data.map((record) =>
            notiDetailIVREntity.upsert(record, {
               updateOnDuplicate: ["connected_time", "end_time", "duration", "attribute_value", "stage_time"]
            })
         )
      );

      return true;
   } catch (err) {
      LOGGER.error(`${funcName} Catching ERROR - ${err}\n${funcArgus}`);
      return false;
   }
};

const handleContactInfoData = async (data) => {
   const funcName = "[handleContactInfoData Func]";
   const funcArgus = `[Data = ${JSON.stringify(data, null, 3)}]`;

   try {
      if (data.length === 0) return true;

      await Promise.all(
         data.map((record) =>
            notiContactInfoEntity.upsert(record, {
               updateOnDuplicate: ["stage_time"]
            })
         )
      );

      return true;
   } catch (err) {
      LOGGER.error(`${funcName} Catching ERROR - ${err}\n${funcArgus}`);
      return false;
   }
};

export default async function createDetailNoti() {
   const funcName = "[createDetailNoti Func]";
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
         await createNoti("conversation", topics, handleData);
      }
   } catch (err) {
      LOGGER.error(`${funcName} Catching ERROR - ${err}.`);
      return false;
   }
}

// const result = await createDetailNoti();
// console.log("result: ", result);

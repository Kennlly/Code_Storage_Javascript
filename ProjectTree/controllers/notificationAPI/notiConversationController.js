import Moment from "moment";
import { fetchQueue } from "../../service/notiConversation/lookupsService.js";
import LOGGER from "../../config/winstonConfig.js";
import SequelizeConfig from "../../config/sequelizeConfig.js";
import { INFO_FOLDER } from "../../utils/constants.js";
import { readFile, writeFile } from "../../utils/fileManagement.js";
import createNoti from "./createNoti.js";
import notiConversationMapper from "../../mapper/notiConversation/notiConversationMapper.js";
import notiConversationIVREntity from "../../entity/notiConversation/notiConversationIVREntity.js";
import notiConversationContactInfoEntity from "../../entity/notiConversation/notiConversationContactInfoEntity.js";

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
   try {
      let localFileData = await readFile(`${INFO_FOLDER}queueInfo`, "json");

      if (JSON.stringify(localFileData) === "{}") {
         const refreshResult = await getQueue();
         if (refreshResult === false) {
            LOGGER.error(`${funcName} - Refreshing Queue Info ERROR!`);
            return false;
         }

         localFileData = await readFile(`${INFO_FOLDER}queueInfo`, "json");
      }

      const { queueIds } = localFileData;
      if (queueIds.length === 0) {
         LOGGER.error(`${funcName} - Unexpected EMPTY Queue Ids From Local File ERROR!`);
         return false;
      }

      return queueIds.map((queueId) => ({ id: `v2.routing.queues.${queueId}.conversations` }));
   } catch (err) {
      LOGGER.error(`${funcName} Catching ERROR - ${err}.`);
      return false;
   }
};

const handleData = async (data) => {
   const funcName = "[handleData Func]";
   const funcArgus = `[Data = ${JSON.stringify(data, null, 3)}]`;

   try {
      const dataObj = notiConversationMapper(data);
      if (dataObj === false) {
         LOGGER.error(`${funcName} - Extracting Payload ERROR From Mapper!`);
         return false;
      }

      const { ivrData, contactInfoData } = dataObj;
      const ivrPromise = handleIVRData(ivrData);
      const contactInfoPromise = handleContactInfoData(contactInfoData);

      await Promise.all([ivrPromise, contactInfoPromise]);

      return true;
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
            notiConversationIVREntity.upsert(record, {
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
            notiConversationContactInfoEntity.upsert(record, {
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

export default async function createConversationNoti() {
   const funcName = "[createConversationNoti Func]";
   try {
      const topics = await createTopics();
      if (topics === false) {
         LOGGER.error(`${funcName} - Creating Conversation Topics ERROR!`);
         return false;
      }

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
         createNoti("conversation", topics, handleData);
      }
   } catch (err) {
      LOGGER.error(`${funcName} Catching ERROR - ${err}.`);
      return false;
   }
}

const result = await createConversationNoti();
// console.log("result: ", result);

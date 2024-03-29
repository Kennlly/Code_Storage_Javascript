import { readFile, writeFile } from "../../utils/fileManagement.js";
import { INFO_FOLDER } from "../../utils/constants.js";
import LOGGER from "../../config/winstonConfig.js";
import { fetchFlow } from "../lookup/lookupsService.js";
import Moment from "moment";
import SequelizeConfig from "../../config/sequelizeConfig.js";
import createNoti from "../realtime/createNoti.js";
import notiFlowAggrMapper from "../../mapper/notiFlowAggrMapper.js";
import notiFlowAggrEntity from "../../entity/notiFlowAggrEntity.js";

const getFlow = async () => {
   const funcName = "[getFlow Func]";
   const stageTime = Moment().format("YYYY-MM-DD HH:mm Z");

   let flowIds;
   try {
      // Option 1: Getting from API
      const apiData = await fetchFlow();

      if (apiData === false) {
         LOGGER.error(`${funcName} - Getting Flow From Genesys API ERROR!`);

         // Option 2: Getting from the database
         const [results] = await SequelizeConfig.query(
            "SELECT DISTINCT [FlowID] FROM [genesysAPI].[dbo].[Gen_Flow] WHERE StageTime = (SELECT MAX(StageTime) FROM [Gen_Flow]) AND [Active] = 'true'",
         );

         if (results.length === 0) {
            LOGGER.error(`${funcName} - Unexpected EMPTY Result From Database ERROR!`);
            return false;
         }

         flowIds = results.map((data) => data["FlowID"]);

         return await writeFile(`${INFO_FOLDER}flowInfo`, "json", { stageTime, flowIds });
      }

      flowIds = apiData.map((data) => data["id"]);

      return await writeFile(`${INFO_FOLDER}flowInfo`, "json", { stageTime, flowIds });
   } catch (err) {
      LOGGER.error(`${funcName} Catching ERROR - ${err}.`);
      return false;
   }
};

const createFlowTopic = async () => {
   const funcName = "[createFlowTopic Func]";

   let localFileData = await readFile(`${INFO_FOLDER}flowInfo`, "json");

   if (JSON.stringify(localFileData) === "{}") {
      const refreshResult = await getFlow();
      if (refreshResult === false) throw new Error(`${funcName} - Refreshing Flow Info ERROR!`);

      localFileData = await readFile(`${INFO_FOLDER}flowInfo`, "json");
   }

   const { flowIds } = localFileData;
   if (flowIds.length === 0) throw new Error(`${funcName} - Unexpected EMPTY Flow Ids From Local File ERROR!`);

   return flowIds.map((flowId) => ({ id: `v2.analytics.flow.${flowId}.aggregates` }));
};

const handleFlowData = async (data) => {
   const funcName = "[handleFlowData Func]";
   const funcArgus = `[Data = ${JSON.stringify(data, null, 3)}]`;

   try {
      const notiFlowAggrData = notiFlowAggrMapper(data);
      if (notiFlowAggrData === false) return false;
      if (notiFlowAggrData.length === 0) {
         LOGGER.error(`${funcName} - Unexpected EMPTY Extracted Data ERROR!`);
         return false;
      }

      await Promise.all(
         notiFlowAggrData.map((record) =>
            notiFlowAggrEntity.upsert(record, {
               updateOnDuplicate: ["metric_value", "stage_time"],
            }),
         ),
      );

      return true;
   } catch (err) {
      LOGGER.error(`${funcName} Catching ERROR - ${err}\n${funcArgus} `);
      return false;
   }
};

export default async function createFlowAggrNoti() {
   const funcName = "[createFlowAggrNoti Func]";
   try {
      const topics = await createFlowTopic();

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
         await createNoti("flowAggr", topics, handleFlowData);
      }
   } catch (err) {
      LOGGER.error(`${funcName} Catching ERROR - ${err}.`);
      return false;
   }
}

// const result = await getFlow();
// console.log("result: ", result);

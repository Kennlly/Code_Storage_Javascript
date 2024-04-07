import LOGGER from "../../config/winstonConfig.js";
import Moment from "moment";
import integrateWholeDetailsMapper from "../../mapper/detailsComponentOrientModel/integrateWholeDetailsMapper.js";
import {
   upsertConversationService,
   upsertDivisionService
} from "../../service/detailsComponentOrientModel/conversationLevelService.js";
import { upsertParticipantService } from "../../service/detailsComponentOrientModel/participantLevelService.js";
import {
   upsertActiveSkillIdService,
   upsertCallbackNumbersService,
   upsertMetricService,
   upsertRequestedRoutingService,
   upsertSessionFlowService,
   upsertSessionService
} from "../../service/detailsComponentOrientModel/sessionLevelService.js";
import upsertContactInfoService from "../../service/upsertContactInfoService.js";
import {
   upsertRequestedRoutingSkillService,
   upsertRequestedRoutingUserService,
   upsertScoredAgentService,
   upsertSegmentService,
   upsertSipResponseCodeService
} from "../../service/detailsComponentOrientModel/segmentLevelService.js";
import SequelizeConfig from "../../config/sequelizeConfig.js";

export default async function handleDetailsComponentOrientModelData(jobStageTime, data) {
   const funcName = "[handleDetailsComponentOrientModelData Func]";
   const funcArgus = `[Data = ${JSON.stringify(data, null, 3)}]`;
   const stageTime = !!jobStageTime ? jobStageTime : Moment().format("YYYY-MM-DD HH:mm Z");

   try {
      const {
         conversationData,
         divisionData,
         participantData,
         sessionData,
         contactInfoData,
         requestedRoutingsData,
         callbackNumbersData,
         activeSkillIdsData,
         flowData,
         metricsData,
         segmentData,
         sipResponseCodesData,
         requestedRoutingSkillIdsData,
         requestedRoutingUserIdsData,
         scoredAgentsData
      } = integrateWholeDetailsMapper(stageTime, data);

      return SequelizeConfig.transaction(async (tran) => {
         await Promise.all([
            ...upsertConversationService(conversationData, tran),
            ...upsertDivisionService(divisionData, tran),
            ...upsertParticipantService(participantData, tran),
            ...upsertSessionService(sessionData, tran),
            ...upsertContactInfoService(contactInfoData, tran),
            ...upsertRequestedRoutingService(requestedRoutingsData, tran),
            ...upsertCallbackNumbersService(callbackNumbersData, tran),
            ...upsertActiveSkillIdService(activeSkillIdsData, tran),
            ...upsertSessionFlowService(flowData, tran),
            ...upsertMetricService(metricsData, tran),
            ...upsertSegmentService(segmentData, tran),
            ...upsertSipResponseCodeService(sipResponseCodesData, tran),
            ...upsertRequestedRoutingSkillService(requestedRoutingSkillIdsData, tran),
            ...upsertRequestedRoutingUserService(requestedRoutingUserIdsData, tran),
            ...upsertScoredAgentService(scoredAgentsData, tran)
         ]);
      })
         .then(() => {
            return true;
         })
         .catch((err) => {
            throw new Error(`${funcName} - Sequelize Processing ERROR! ${err}`);
         });
   } catch (err) {
      LOGGER.error(`${funcName} Catching ERROR - ${err}\n${funcArgus}`);
      return false;
   }
}

// const bulkFile = await readFile(`${INFO_FOLDER}sampleBulkDetails`, "json");
// const bulkFuncResult = await handleDetailsComponentOrientModelData(bulkFile);
// const singleFile = await readFile(`${INFO_FOLDER}sampleSingleDetails`, "json");
// const singleFuncResult = await handleDetailsComponentOrientModelData(singleFile);
// console.log("Function Completed! bulkFuncResult: ", bulkFuncResult);

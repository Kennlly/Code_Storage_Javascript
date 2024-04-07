import {
   requestedRoutingSkillEntity,
   requestedRoutingUserEntity,
   scoredAgentEntity,
   segmentEntity,
   sipResponseCodeEntity
} from "../../entity/historical/detailsComponentOrientModel/segmentLevelEntity.js";
import SequelizeConfig from "../../config/sequelizeConfig.js";
import { metricEntity } from "../../entity/historical/detailsComponentOrientModel/sessionLevelEntity.js";

export const upsertSegmentService = (data, transaction) => {
   if (data.length === 0) return [];

   return data.map((row) => {
      return segmentEntity.upsert(row, {
         updateOnDuplicate: [
            "start_time",
            "end_time",
            "duration",
            "disconnect_type",
            "queue_id",
            "group_id",
            "conference",
            "error_code",
            "wrap_up_code",
            "wrap_up_note",
            "source_conversation_id",
            "source_session_id",
            "destination_conversation_id",
            "destination_session_id",
            "subject",
            "requested_language_id",
            "audio_muted",
            "video_muted",
            "stage_time"
         ],
         transaction
      });
   });
};

export const upsertSipResponseCodeService = (data, transaction) => {
   if (data.length === 0) return [];

   return data.map((row) => {
      return sipResponseCodeEntity.upsert(row, {
         updateOnDuplicate: ["stage_time"],
         transaction
      });
   });
};

export const upsertRequestedRoutingSkillService = (data, transaction) => {
   if (data.length === 0) return [];

   return data.map((row) => {
      return requestedRoutingSkillEntity.upsert(row, {
         updateOnDuplicate: ["stage_time"],
         transaction
      });
   });
};

export const upsertRequestedRoutingUserService = (data, transaction) => {
   if (data.length === 0) return [];

   return data.map((row) => {
      return requestedRoutingUserEntity.upsert(row, {
         updateOnDuplicate: ["stage_time"],
         transaction
      });
   });
};

export const upsertScoredAgentService = (data, transaction) => {
   if (data.length === 0) return [];

   return data.map((row) => {
      return scoredAgentEntity.upsert(row, {
         updateOnDuplicate: ["agent_score", "stage_time"],
         transaction
      });
   });
};

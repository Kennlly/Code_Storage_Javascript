import {
   conversationEntity,
   divisionEntity
} from "../../entity/historical/detailsComponentOrientModel/conversationLevelEntity.js";

export const upsertConversationService = (data, transaction) => {
   if (data.length === 0) return [];

   return data.map((row) => {
      return conversationEntity.upsert(row, {
         updateOnDuplicate: [
            "start_time",
            "end_time",
            "duration",
            "originating_direction",
            "external_tag",
            "media_stats_min_conversation_mos",
            "media_stats_min_conversation_R_factor",
            "stage_time"
         ],
         transaction
      });
   });
};

export const upsertDivisionService = (data, transaction) => {
   if (data.length === 0) return [];

   return data.map((row) => {
      return divisionEntity.upsert(row, {
         updateOnDuplicate: ["stage_time"],
         transaction
      });
   });
};

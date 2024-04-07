import { participantEntity } from "../../entity/historical/detailsComponentOrientModel/participantLevelEntity.js";

export const upsertParticipantService = (data, transaction) => {
   if (data.length === 0) return [];

   return data.map((row) => {
      return participantEntity.upsert(row, {
         updateOnDuplicate: [
            "name",
            "purpose",
            "user_id",
            "team_id",
            "external_contact_id",
            "external_organization_id",
            "flagged_reason",
            "stage_time"
         ],
         transaction
      });
   });
};

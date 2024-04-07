import {
   activeSkillIdEntity,
   callbackNumbersEntity,
   metricEntity,
   requestedRoutingEntity,
   sessionEntity,
   sessionFlowEntity
} from "../../entity/historical/detailsComponentOrientModel/sessionLevelEntity.js";
import SequelizeConfig from "../../config/sequelizeConfig.js";
import { participantEntity } from "../../entity/historical/detailsComponentOrientModel/participantLevelEntity.js";
import contactInfoEntity from "../../entity/contactInfoEntity.js";

export const upsertSessionService = (data, transaction) => {
   if (data.length === 0) return [];

   return data.map((row) => {
      return sessionEntity.upsert(row, {
         updateOnDuplicate: [
            "start_time",
            "ANI",
            "direction",
            "edge_id",
            "media_type",
            "provider",
            "DNIS",
            "session_DNIS",
            "peer_id",
            "script_id",
            "outbound_campaign_id",
            "remote",
            "remote_name_displayable",
            "address_from",
            "address_to",
            "address_self",
            "address_other",
            "journey_action_id",
            "journey_action_map_id",
            "journey_action_map_version",
            "journey_customer_id",
            "journey_customer_id_type",
            "journey_customer_session_id",
            "journey_customer_session_id_type",
            "sharing_screen",
            "screen_share_room_id",
            "screen_share_address_self",
            "flow_in_type",
            "flow_out_type",
            "cobrowse_role",
            "cobrowse_room_id",
            "disposition_analyzer",
            "disposition_name",
            "video_room_id",
            "video_address_self",
            "ACW_skipped",
            "skip_enabled",
            "selected_agent_id",
            "selected_agent_rank",
            "media_bridge_id",
            "media_count",
            "message_type",
            "timeout_seconds",
            "protocol_call_id",
            "authenticated",
            "recording",
            "room_id",
            "agent_assistant_id",
            "assigner_id",
            "monitored_participant_id",
            "agent_owned",
            "routing_ring",
            "agent_bullseye_ring",
            "stage_time"
         ],
         transaction
      });
   });
};

export const upsertRequestedRoutingService = (data, transaction) => {
   if (data.length === 0) return [];

   return data.map((row) => {
      return requestedRoutingEntity.upsert(row, {
         updateOnDuplicate: ["used_routing", "stage_time"],
         transaction
      });
   });
};

export const upsertCallbackNumbersService = (data, transaction) => {
   if (data.length === 0) return [];

   return data.map((row) => {
      return callbackNumbersEntity.upsert(row, {
         updateOnDuplicate: ["callback_numbers", "callback_scheduled_time", "callback_user_name", "stage_time"],
         transaction
      });
   });
};

export const upsertActiveSkillIdService = (data, transaction) => {
   if (data.length === 0) return [];

   return data.map((row) => {
      return activeSkillIdEntity.upsert(row, {
         updateOnDuplicate: ["stage_time"],
         transaction
      });
   });
};

export const upsertSessionFlowService = (data, transaction) => {
   if (data.length === 0) return [];

   return data.map((row) => {
      return sessionFlowEntity.upsert(row, {
         updateOnDuplicate: [
            "flow_name",
            "flow_type",
            "flow_version",
            "starting_language",
            "ending_language",
            "entry_reason",
            "exit_reason",
            "entry_type",
            "issued_callback",
            "recognition_failure_reason",
            "transfer_target_address",
            "transfer_target_name",
            "transfer_type",
            "flow_outcome",
            "flow_outcome_start_time",
            "flow_outcome_end_time",
            "flow_outcome_value",
            "stage_time"
         ],
         transaction
      });
   });
};

export const upsertMetricService = (data, transaction) => {
   if (data.length === 0) return [];

   return data.map((row) => {
      return metricEntity.upsert(row, {
         updateOnDuplicate: ["value", "emit_date", "stage_time"],
         transaction
      });
   });
};

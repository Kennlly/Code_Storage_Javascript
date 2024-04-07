// noinspection JSCheckFunctionSignatures

import SequelizeConfig from "../../config/sequelizeConfig.js";
import { DataTypes, Model } from "sequelize";
import defineEntitySetterValue from "../../utils/defineEntitySetterValue.js";

export class Session extends Model {}

Session.init(
   {
      id: {
         type: DataTypes.STRING(36),
         primaryKey: true,
         allowNull: false
      },
      participant_id: {
         type: DataTypes.STRING(36),
         primaryKey: true,
         allowNull: false
      },
      start_time: {
         type: DataTypes.DATE(0),
         set(value) {
            this.setDataValue("start_time", defineEntitySetterValue(value, "datetime"));
         }
      },
      ANI: {
         type: DataTypes.STRING,
         set(value) {
            this.setDataValue("ANI", defineEntitySetterValue(value, "string"));
         }
      },
      direction: {
         type: DataTypes.STRING(8),
         set(value) {
            this.setDataValue("direction", defineEntitySetterValue(value, "string", 8));
         }
      },
      edge_id: {
         type: DataTypes.STRING(36),
         set(value) {
            this.setDataValue("edge_id", defineEntitySetterValue(value, "string", 36));
         }
      },
      media_type: {
         type: DataTypes.STRING(11),
         set(value) {
            this.setDataValue("media_type", defineEntitySetterValue(value, "string", 11));
         }
      },
      provider: {
         type: DataTypes.STRING,
         set(value) {
            this.setDataValue("provider", defineEntitySetterValue(value, "string"));
         }
      },
      DNIS: {
         type: DataTypes.STRING,
         set(value) {
            this.setDataValue("DNIS", defineEntitySetterValue(value, "string"));
         }
      },
      session_DNIS: {
         type: DataTypes.STRING,
         set(value) {
            this.setDataValue("session_DNIS", defineEntitySetterValue(value, "string"));
         }
      },
      peer_id: {
         type: DataTypes.STRING(36),
         set(value) {
            this.setDataValue("peer_id", defineEntitySetterValue(value, "string", 36));
         }
      },
      script_id: {
         type: DataTypes.STRING(36),
         set(value) {
            this.setDataValue("script_id", defineEntitySetterValue(value, "string", 36));
         }
      },
      outbound_campaign_id: {
         type: DataTypes.STRING(36),
         set(value) {
            this.setDataValue("outbound_campaign_id", defineEntitySetterValue(value, "string", 36));
         }
      },
      remote: {
         type: DataTypes.STRING,
         set(value) {
            this.setDataValue("remote", defineEntitySetterValue(value, "string"));
         }
      },
      remote_name_displayable: {
         type: DataTypes.STRING,
         set(value) {
            this.setDataValue("remote_name_displayable", defineEntitySetterValue(value, "string"));
         }
      },
      address_from: {
         type: DataTypes.STRING,
         set(value) {
            this.setDataValue("address_from", defineEntitySetterValue(value, "string"));
         }
      },
      address_to: {
         type: DataTypes.STRING,
         set(value) {
            this.setDataValue("address_to", defineEntitySetterValue(value, "string"));
         }
      },
      address_self: {
         type: DataTypes.STRING,
         set(value) {
            this.setDataValue("address_self", defineEntitySetterValue(value, "string"));
         }
      },
      address_other: {
         type: DataTypes.STRING,
         set(value) {
            this.setDataValue("address_other", defineEntitySetterValue(value, "string"));
         }
      },
      journey_action_id: {
         type: DataTypes.STRING(36),
         set(value) {
            this.setDataValue("journey_action_id", defineEntitySetterValue(value, "string", 36));
         }
      },
      journey_action_map_id: {
         type: DataTypes.STRING(36),
         set(value) {
            this.setDataValue("journey_action_map_id", defineEntitySetterValue(value, "string", 36));
         }
      },
      journey_action_map_version: {
         type: DataTypes.INTEGER,
         set(value) {
            this.setDataValue("journey_action_map_version", defineEntitySetterValue(value, "number"));
         }
      },
      journey_customer_id: {
         type: DataTypes.STRING(36),
         set(value) {
            this.setDataValue("journey_customer_id", defineEntitySetterValue(value, "string", 36));
         }
      },
      journey_customer_id_type: {
         type: DataTypes.STRING,
         set(value) {
            this.setDataValue("journey_customer_id_type", defineEntitySetterValue(value, "string"));
         }
      },
      journey_customer_session_id: {
         type: DataTypes.STRING(36),
         set(value) {
            this.setDataValue("journey_customer_session_id", defineEntitySetterValue(value, "string", 36));
         }
      },
      journey_customer_session_id_type: {
         type: DataTypes.STRING,
         set(value) {
            this.setDataValue("journey_customer_session_id_type", defineEntitySetterValue(value, "string"));
         }
      },
      sharing_screen: {
         type: DataTypes.BOOLEAN,
         set(value) {
            this.setDataValue("sharing_screen", defineEntitySetterValue(value, "boolean"));
         }
      },
      screen_share_room_id: {
         type: DataTypes.STRING(36),
         set(value) {
            this.setDataValue("screen_share_room_id", defineEntitySetterValue(value, "string", 36));
         }
      },
      screen_share_address_self: {
         type: DataTypes.STRING,
         set(value) {
            this.setDataValue("screen_share_address_self", defineEntitySetterValue(value, "string"));
         }
      },
      flow_in_type: {
         type: DataTypes.STRING,
         set(value) {
            this.setDataValue("flow_in_type", defineEntitySetterValue(value, "string"));
         }
      },
      flow_out_type: {
         type: DataTypes.STRING,
         set(value) {
            this.setDataValue("flow_out_type", defineEntitySetterValue(value, "string"));
         }
      },
      cobrowse_role: {
         type: DataTypes.STRING,
         set(value) {
            this.setDataValue("cobrowse_role", defineEntitySetterValue(value, "string"));
         }
      },
      cobrowse_room_id: {
         type: DataTypes.STRING(36),
         set(value) {
            this.setDataValue("cobrowse_room_id", defineEntitySetterValue(value, "string", 36));
         }
      },
      disposition_analyzer: {
         type: DataTypes.STRING,
         set(value) {
            this.setDataValue("disposition_analyzer", defineEntitySetterValue(value, "string"));
         }
      },
      disposition_name: {
         type: DataTypes.STRING,
         set(value) {
            this.setDataValue("disposition_name", defineEntitySetterValue(value, "string"));
         }
      },
      video_room_id: {
         type: DataTypes.STRING(36),
         set(value) {
            this.setDataValue("video_room_id", defineEntitySetterValue(value, "string", 36));
         }
      },
      video_address_self: {
         type: DataTypes.STRING,
         set(value) {
            this.setDataValue("video_address_self", defineEntitySetterValue(value, "string"));
         }
      },
      ACW_skipped: {
         type: DataTypes.BOOLEAN,
         set(value) {
            this.setDataValue("ACW_skipped", defineEntitySetterValue(value, "boolean"));
         }
      },
      skip_enabled: {
         type: DataTypes.BOOLEAN,
         set(value) {
            this.setDataValue("skip_enabled", defineEntitySetterValue(value, "boolean"));
         }
      },
      selected_agent_id: {
         type: DataTypes.STRING(36),
         set(value) {
            this.setDataValue("selected_agent_id", defineEntitySetterValue(value, "string", 36));
         }
      },
      selected_agent_rank: {
         type: DataTypes.INTEGER,
         set(value) {
            this.setDataValue("selected_agent_rank", defineEntitySetterValue(value, "number"));
         }
      },
      media_bridge_id: {
         type: DataTypes.STRING(36),
         set(value) {
            this.setDataValue("media_bridge_id", defineEntitySetterValue(value, "string", 36));
         }
      },
      media_count: {
         type: DataTypes.INTEGER,
         set(value) {
            this.setDataValue("media_count", defineEntitySetterValue(value, "number"));
         }
      },
      message_type: {
         type: DataTypes.STRING,
         set(value) {
            this.setDataValue("message_type", defineEntitySetterValue(value, "string"));
         }
      },
      timeout_seconds: {
         type: DataTypes.INTEGER,
         set(value) {
            this.setDataValue("timeout_seconds", defineEntitySetterValue(value, "number"));
         }
      },
      protocol_call_id: {
         type: DataTypes.STRING,
         set(value) {
            this.setDataValue("protocol_call_id", defineEntitySetterValue(value, "string"));
         }
      },
      authenticated: {
         type: DataTypes.BOOLEAN,
         set(value) {
            this.setDataValue("authenticated", defineEntitySetterValue(value, "boolean"));
         }
      },
      recording: {
         type: DataTypes.BOOLEAN,
         set(value) {
            this.setDataValue("recording", defineEntitySetterValue(value, "boolean"));
         }
      },
      room_id: {
         type: DataTypes.STRING(36),
         set(value) {
            this.setDataValue("room_id", defineEntitySetterValue(value, "string", 36));
         }
      },
      agent_assistant_id: {
         type: DataTypes.STRING(36),
         set(value) {
            this.setDataValue("agent_assistant_id", defineEntitySetterValue(value, "string", 36));
         }
      },
      assigner_id: {
         type: DataTypes.STRING(36),
         set(value) {
            this.setDataValue("assigner_id", defineEntitySetterValue(value, "string", 36));
         }
      },
      monitored_participant_id: {
         type: DataTypes.STRING(36),
         set(value) {
            this.setDataValue("monitored_participant_id", defineEntitySetterValue(value, "string", 36));
         }
      },
      agent_owned: {
         type: DataTypes.BOOLEAN,
         set(value) {
            this.setDataValue("agent_owned", defineEntitySetterValue(value, "boolean"));
         }
      },
      routing_ring: {
         type: DataTypes.INTEGER,
         set(value) {
            this.setDataValue("routing_ring", defineEntitySetterValue(value, "number"));
         }
      },
      agent_bullseye_ring: {
         type: DataTypes.INTEGER,
         set(value) {
            this.setDataValue("agent_bullseye_ring", defineEntitySetterValue(value, "number"));
         }
      },
      stage_time: {
         type: DataTypes.DATE(0),
         allowNull: false
      }
   },
   {
      sequelize: SequelizeConfig,
      tableName: "Gen_ConDetails_Session_STG"
   }
);

export class RequestedRouting extends Model {}

RequestedRouting.init(
   {
      session_id: {
         type: DataTypes.STRING(36),
         primaryKey: true,
         allowNull: false
      },
      requested_routing: {
         type: DataTypes.STRING(10),
         primaryKey: true,
         allowNull: false
      },
      used_routing: {
         type: DataTypes.STRING(10),
         set(value) {
            this.setDataValue("used_routing", defineEntitySetterValue(value, "string", 10));
         }
      },
      stage_time: {
         type: DataTypes.DATE(0),
         allowNull: false
      }
   },
   {
      sequelize: SequelizeConfig,
      tableName: "Gen_ConDetails_Requested_Routing_STG"
   }
);

export class CallbackNumbers extends Model {}

CallbackNumbers.init(
   {
      session_id: {
         type: DataTypes.STRING(36),
         primaryKey: true,
         allowNull: false
      },
      callback_numbers: {
         type: DataTypes.TEXT,
         allowNull: false,
         set(value) {
            const temp = defineEntitySetterValue(value, "text");
            this.setDataValue("callback_numbers", temp ? JSON.stringify(temp) : null);
         }
      },
      callback_scheduled_time: {
         type: DataTypes.DATE(0),
         set(value) {
            this.setDataValue("callback_scheduled_time", defineEntitySetterValue(value, "datetime"));
         }
      },
      callback_user_name: {
         type: DataTypes.STRING,
         set(value) {
            this.setDataValue("callback_user_name", defineEntitySetterValue(value, "string"));
         }
      },
      stage_time: {
         type: DataTypes.DATE(0),
         allowNull: false
      }
   },
   {
      sequelize: SequelizeConfig,
      tableName: "Gen_ConDetails_Callback_Numbers_STG"
   }
);

export class ActiveSkill extends Model {}

ActiveSkill.init(
   {
      session_id: {
         type: DataTypes.STRING(36),
         primaryKey: true,
         allowNull: false
      },
      active_skill_id: {
         type: DataTypes.STRING(36),
         primaryKey: true,
         allowNull: false
      },
      stage_time: {
         type: DataTypes.DATE(0),
         allowNull: false
      }
   },
   {
      sequelize: SequelizeConfig,
      tableName: "Gen_ConDetails_Active_Skill_STG"
   }
);

export class SessionFlow extends Model {}

SessionFlow.init(
   {
      session_id: {
         type: DataTypes.STRING(36),
         primaryKey: true,
         allowNull: false
      },
      flow_id: {
         type: DataTypes.STRING(36),
         primaryKey: true,
         allowNull: false
      },
      flow_name: {
         type: DataTypes.STRING,
         set(value) {
            this.setDataValue("flow_name", defineEntitySetterValue(value, "string"));
         }
      },
      flow_type: {
         type: DataTypes.STRING(21),
         set(value) {
            this.setDataValue("flow_type", defineEntitySetterValue(value, "string", 21));
         }
      },
      flow_version: {
         type: DataTypes.STRING(10),
         set(value) {
            this.setDataValue("flow_version", defineEntitySetterValue(value, "string", 10));
         }
      },
      starting_language: {
         type: DataTypes.STRING(50),
         set(value) {
            this.setDataValue("starting_language", defineEntitySetterValue(value, "string", 50));
         }
      },
      ending_language: {
         type: DataTypes.STRING(50),
         set(value) {
            this.setDataValue("ending_language", defineEntitySetterValue(value, "string", 50));
         }
      },
      entry_reason: {
         type: DataTypes.STRING,
         set(value) {
            this.setDataValue("entry_reason", defineEntitySetterValue(value, "string"));
         }
      },
      exit_reason: {
         type: DataTypes.STRING,
         set(value) {
            this.setDataValue("exit_reason", defineEntitySetterValue(value, "string"));
         }
      },
      entry_type: {
         type: DataTypes.STRING(8),
         set(value) {
            this.setDataValue("entry_type", defineEntitySetterValue(value, "string", 8));
         }
      },
      issued_callback: {
         type: DataTypes.BOOLEAN,
         set(value) {
            this.setDataValue("issued_callback", defineEntitySetterValue(value, "boolean"));
         }
      },
      recognition_failure_reason: {
         type: DataTypes.STRING,
         set(value) {
            this.setDataValue("recognition_failure_reason", defineEntitySetterValue(value, "string"));
         }
      },
      transfer_target_address: {
         type: DataTypes.STRING,
         set(value) {
            this.setDataValue("transfer_target_address", defineEntitySetterValue(value, "string"));
         }
      },
      transfer_target_name: {
         type: DataTypes.STRING,
         set(value) {
            this.setDataValue("transfer_target_name", defineEntitySetterValue(value, "string"));
         }
      },
      transfer_type: {
         type: DataTypes.STRING,
         set(value) {
            this.setDataValue("transfer_type", defineEntitySetterValue(value, "string"));
         }
      },
      flow_outcome: {
         type: DataTypes.STRING,
         set(value) {
            this.setDataValue("flow_outcome", defineEntitySetterValue(value, "string"));
         }
      },
      flow_outcome_id: {
         type: DataTypes.STRING(36),
         primaryKey: true,
         allowNull: false
      },
      flow_outcome_start_time: {
         type: DataTypes.DATE(0),
         set(value) {
            this.setDataValue("flow_outcome_start_time", defineEntitySetterValue(value, "datetime"));
         }
      },
      flow_outcome_end_time: {
         type: DataTypes.DATE(0),
         set(value) {
            this.setDataValue("flow_outcome_end_time", defineEntitySetterValue(value, "datetime"));
         }
      },
      flow_outcome_value: {
         type: DataTypes.STRING,
         set(value) {
            this.setDataValue("flow_outcome_value", defineEntitySetterValue(value, "string"));
         }
      },
      stage_time: {
         type: DataTypes.DATE(0),
         allowNull: false
      }
   },
   {
      sequelize: SequelizeConfig,
      tableName: "Gen_ConDetails_Flow_STG"
   }
);

export class Metric extends Model {}

Metric.init(
   {
      session_id: {
         type: DataTypes.STRING(36),
         primaryKey: true,
         allowNull: false
      },
      name: {
         type: DataTypes.STRING,
         primaryKey: true,
         allowNull: false
      },
      value: {
         type: DataTypes.BIGINT,
         set(value) {
            this.setDataValue("value", defineEntitySetterValue(value, "number"));
         }
      },
      emit_date: {
         type: DataTypes.DATE(0),
         set(value) {
            this.setDataValue("emit_date", defineEntitySetterValue(value, "datetime"));
         }
      },
      stage_time: {
         type: DataTypes.DATE(0),
         allowNull: false
      }
   },
   {
      sequelize: SequelizeConfig,
      tableName: "Gen_ConDetails_Metric_STG"
   }
);

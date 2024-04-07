// noinspection JSCheckFunctionSignatures

import SequelizeConfig from "../../config/sequelizeConfig.js";
import { DataTypes } from "sequelize";
import defineSetterValue from "../defineSetterValue.js";

const defineSession = () => {
   const funcName = "[defineSession Func]";

   try {
      return SequelizeConfig.define("Gen_ConDetails_Session_STG", {
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
               this.setDataValue("start_time", defineSetterValue(value, "datetime"));
            }
         },
         ANI: {
            type: DataTypes.STRING,
            set(value) {
               this.setDataValue("ANI", defineSetterValue(value, "string"));
            }
         },
         direction: {
            type: DataTypes.STRING(8),
            set(value) {
               this.setDataValue("direction", defineSetterValue(value, "string", 8));
            }
         },
         edge_id: {
            type: DataTypes.STRING(36),
            set(value) {
               this.setDataValue("edge_id", defineSetterValue(value, "string", 36));
            }
         },
         media_type: {
            type: DataTypes.STRING(11),
            set(value) {
               this.setDataValue("media_type", defineSetterValue(value, "string", 11));
            }
         },
         provider: {
            type: DataTypes.STRING,
            set(value) {
               this.setDataValue("provider", defineSetterValue(value, "string"));
            }
         },
         DNIS: {
            type: DataTypes.STRING,
            set(value) {
               this.setDataValue("DNIS", defineSetterValue(value, "string"));
            }
         },
         session_DNIS: {
            type: DataTypes.STRING,
            set(value) {
               this.setDataValue("session_DNIS", defineSetterValue(value, "string"));
            }
         },
         peer_id: {
            type: DataTypes.STRING(36),
            set(value) {
               this.setDataValue("peer_id", defineSetterValue(value, "string", 36));
            }
         },
         script_id: {
            type: DataTypes.STRING(36),
            set(value) {
               this.setDataValue("script_id", defineSetterValue(value, "string", 36));
            }
         },
         outbound_campaign_id: {
            type: DataTypes.STRING(36),
            set(value) {
               this.setDataValue("outbound_campaign_id", defineSetterValue(value, "string", 36));
            }
         },
         remote: {
            type: DataTypes.STRING,
            set(value) {
               this.setDataValue("remote", defineSetterValue(value, "string"));
            }
         },
         remote_name_displayable: {
            type: DataTypes.STRING,
            set(value) {
               this.setDataValue("remote_name_displayable", defineSetterValue(value, "string"));
            }
         },
         address_from: {
            type: DataTypes.STRING,
            set(value) {
               this.setDataValue("address_from", defineSetterValue(value, "string"));
            }
         },
         address_to: {
            type: DataTypes.STRING,
            set(value) {
               this.setDataValue("address_to", defineSetterValue(value, "string"));
            }
         },
         address_self: {
            type: DataTypes.STRING,
            set(value) {
               this.setDataValue("address_self", defineSetterValue(value, "string"));
            }
         },
         address_other: {
            type: DataTypes.STRING,
            set(value) {
               this.setDataValue("address_other", defineSetterValue(value, "string"));
            }
         },
         journey_action_id: {
            type: DataTypes.STRING(36),
            set(value) {
               this.setDataValue("journey_action_id", defineSetterValue(value, "string", 36));
            }
         },
         journey_action_map_id: {
            type: DataTypes.STRING(36),
            set(value) {
               this.setDataValue("journey_action_map_id", defineSetterValue(value, "string", 36));
            }
         },
         journey_action_map_version: {
            type: DataTypes.INTEGER,
            set(value) {
               this.setDataValue("journey_action_map_version", defineSetterValue(value, "number"));
            }
         },
         journey_customer_id: {
            type: DataTypes.STRING(36),
            set(value) {
               this.setDataValue("journey_customer_id", defineSetterValue(value, "string", 36));
            }
         },
         journey_customer_id_type: {
            type: DataTypes.STRING,
            set(value) {
               this.setDataValue("journey_customer_id_type", defineSetterValue(value, "string"));
            }
         },
         journey_customer_session_id: {
            type: DataTypes.STRING(36),
            set(value) {
               this.setDataValue("journey_customer_session_id", defineSetterValue(value, "string", 36));
            }
         },
         journey_customer_session_id_type: {
            type: DataTypes.STRING,
            set(value) {
               this.setDataValue("journey_customer_session_id_type", defineSetterValue(value, "string"));
            }
         },
         sharing_screen: {
            type: DataTypes.BOOLEAN,
            set(value) {
               this.setDataValue("sharing_screen", defineSetterValue(value, "boolean"));
            }
         },
         screen_share_room_id: {
            type: DataTypes.STRING(36),
            set(value) {
               this.setDataValue("screen_share_room_id", defineSetterValue(value, "string", 36));
            }
         },
         screen_share_address_self: {
            type: DataTypes.STRING,
            set(value) {
               this.setDataValue("screen_share_address_self", defineSetterValue(value, "string"));
            }
         },
         flow_in_type: {
            type: DataTypes.STRING,
            set(value) {
               this.setDataValue("flow_in_type", defineSetterValue(value, "string"));
            }
         },
         flow_out_type: {
            type: DataTypes.STRING,
            set(value) {
               this.setDataValue("flow_out_type", defineSetterValue(value, "string"));
            }
         },
         cobrowse_role: {
            type: DataTypes.STRING,
            set(value) {
               this.setDataValue("cobrowse_role", defineSetterValue(value, "string"));
            }
         },
         cobrowse_room_id: {
            type: DataTypes.STRING(36),
            set(value) {
               this.setDataValue("cobrowse_room_id", defineSetterValue(value, "string", 36));
            }
         },
         disposition_analyzer: {
            type: DataTypes.STRING,
            set(value) {
               this.setDataValue("disposition_analyzer", defineSetterValue(value, "string"));
            }
         },
         disposition_name: {
            type: DataTypes.STRING,
            set(value) {
               this.setDataValue("disposition_name", defineSetterValue(value, "string"));
            }
         },
         video_room_id: {
            type: DataTypes.STRING(36),
            set(value) {
               this.setDataValue("video_room_id", defineSetterValue(value, "string", 36));
            }
         },
         video_address_self: {
            type: DataTypes.STRING,
            set(value) {
               this.setDataValue("video_address_self", defineSetterValue(value, "string"));
            }
         },
         ACW_skipped: {
            type: DataTypes.BOOLEAN,
            set(value) {
               this.setDataValue("ACW_skipped", defineSetterValue(value, "boolean"));
            }
         },
         skip_enabled: {
            type: DataTypes.BOOLEAN,
            set(value) {
               this.setDataValue("skip_enabled", defineSetterValue(value, "boolean"));
            }
         },
         selected_agent_id: {
            type: DataTypes.STRING(36),
            set(value) {
               this.setDataValue("selected_agent_id", defineSetterValue(value, "string", 36));
            }
         },
         selected_agent_rank: {
            type: DataTypes.INTEGER,
            set(value) {
               this.setDataValue("selected_agent_rank", defineSetterValue(value, "number"));
            }
         },
         media_bridge_id: {
            type: DataTypes.STRING(36),
            set(value) {
               this.setDataValue("media_bridge_id", defineSetterValue(value, "string", 36));
            }
         },
         media_count: {
            type: DataTypes.INTEGER,
            set(value) {
               this.setDataValue("media_count", defineSetterValue(value, "number"));
            }
         },
         message_type: {
            type: DataTypes.STRING,
            set(value) {
               this.setDataValue("message_type", defineSetterValue(value, "string"));
            }
         },
         timeout_seconds: {
            type: DataTypes.INTEGER,
            set(value) {
               this.setDataValue("timeout_seconds", defineSetterValue(value, "number"));
            }
         },
         protocol_call_id: {
            type: DataTypes.STRING,
            set(value) {
               this.setDataValue("protocol_call_id", defineSetterValue(value, "string"));
            }
         },
         authenticated: {
            type: DataTypes.BOOLEAN,
            set(value) {
               this.setDataValue("authenticated", defineSetterValue(value, "boolean"));
            }
         },
         recording: {
            type: DataTypes.BOOLEAN,
            set(value) {
               this.setDataValue("recording", defineSetterValue(value, "boolean"));
            }
         },
         room_id: {
            type: DataTypes.STRING(36),
            set(value) {
               this.setDataValue("room_id", defineSetterValue(value, "string", 36));
            }
         },
         agent_assistant_id: {
            type: DataTypes.STRING(36),
            set(value) {
               this.setDataValue("agent_assistant_id", defineSetterValue(value, "string", 36));
            }
         },
         assigner_id: {
            type: DataTypes.STRING(36),
            set(value) {
               this.setDataValue("assigner_id", defineSetterValue(value, "string", 36));
            }
         },
         monitored_participant_id: {
            type: DataTypes.STRING(36),
            set(value) {
               this.setDataValue("monitored_participant_id", defineSetterValue(value, "string", 36));
            }
         },
         agent_owned: {
            type: DataTypes.BOOLEAN,
            set(value) {
               this.setDataValue("agent_owned", defineSetterValue(value, "boolean"));
            }
         },
         routing_ring: {
            type: DataTypes.INTEGER,
            set(value) {
               this.setDataValue("routing_ring", defineSetterValue(value, "number"));
            }
         },
         agent_bullseye_ring: {
            type: DataTypes.INTEGER,
            set(value) {
               this.setDataValue("agent_bullseye_ring", defineSetterValue(value, "number"));
            }
         },
         stage_time: {
            type: DataTypes.DATE(0),
            allowNull: false
         }
      });
   } catch (err) {
      throw new Error(`${funcName} Catching ERROR - ${err}`);
   }
};

const defineRequestedRouting = () => {
   const funcName = "[defineRequestedRouting Func]";

   try {
      return SequelizeConfig.define("Gen_ConDetails_Requested_Routing_STG", {
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
               this.setDataValue("used_routing", defineSetterValue(value, "string", 10));
            }
         },
         stage_time: {
            type: DataTypes.DATE(0),
            allowNull: false
         }
      });
   } catch (err) {
      throw new Error(`${funcName} Catching ERROR - ${err}`);
   }
};

const defineCallbackNumbers = () => {
   const funcName = "[defineCallbackNumbers Func]";

   try {
      return SequelizeConfig.define("Gen_ConDetails_Callback_Numbers_STG", {
         session_id: {
            type: DataTypes.STRING(36),
            primaryKey: true,
            allowNull: false
         },
         callback_numbers: {
            type: DataTypes.TEXT,
            allowNull: false,
            set(value) {
               const temp = defineSetterValue(value, "text");
               this.setDataValue("callback_numbers", temp ? JSON.stringify(temp) : null);
            }
         },
         callback_scheduled_time: {
            type: DataTypes.DATE(0),
            set(value) {
               this.setDataValue("callback_scheduled_time", defineSetterValue(value, "datetime"));
            }
         },
         callback_user_name: {
            type: DataTypes.STRING,
            set(value) {
               this.setDataValue("callback_user_name", defineSetterValue(value, "string"));
            }
         },
         stage_time: {
            type: DataTypes.DATE(0),
            allowNull: false
         }
      });
   } catch (err) {
      throw new Error(`${funcName} Catching ERROR - ${err}`);
   }
};

const defineActiveSkillId = () => {
   const funcName = "[defineActiveSkillId Func]";

   try {
      return SequelizeConfig.define("Gen_ConDetails_Active_Skill_STG", {
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
      });
   } catch (err) {
      throw new Error(`${funcName} Catching ERROR - ${err}`);
   }
};

const defineSessionFlow = () => {
   const funcName = "[defineSessionFlow Func]";

   try {
      return SequelizeConfig.define("Gen_ConDetails_Flow_STG", {
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
               this.setDataValue("flow_name", defineSetterValue(value, "string"));
            }
         },
         flow_type: {
            type: DataTypes.STRING(21),
            set(value) {
               this.setDataValue("flow_type", defineSetterValue(value, "string", 21));
            }
         },
         flow_version: {
            type: DataTypes.STRING(10),
            set(value) {
               this.setDataValue("flow_version", defineSetterValue(value, "string", 10));
            }
         },
         starting_language: {
            type: DataTypes.STRING(50),
            set(value) {
               this.setDataValue("starting_language", defineSetterValue(value, "string", 50));
            }
         },
         ending_language: {
            type: DataTypes.STRING(50),
            set(value) {
               this.setDataValue("ending_language", defineSetterValue(value, "string", 50));
            }
         },
         entry_reason: {
            type: DataTypes.STRING,
            set(value) {
               this.setDataValue("entry_reason", defineSetterValue(value, "string"));
            }
         },
         exit_reason: {
            type: DataTypes.STRING,
            set(value) {
               this.setDataValue("exit_reason", defineSetterValue(value, "string"));
            }
         },
         entry_type: {
            type: DataTypes.STRING(8),
            set(value) {
               this.setDataValue("entry_type", defineSetterValue(value, "string", 8));
            }
         },
         issued_callback: {
            type: DataTypes.BOOLEAN,
            set(value) {
               this.setDataValue("issued_callback", defineSetterValue(value, "boolean"));
            }
         },
         recognition_failure_reason: {
            type: DataTypes.STRING,
            set(value) {
               this.setDataValue("recognition_failure_reason", defineSetterValue(value, "string"));
            }
         },
         transfer_target_address: {
            type: DataTypes.STRING,
            set(value) {
               this.setDataValue("transfer_target_address", defineSetterValue(value, "string"));
            }
         },
         transfer_target_name: {
            type: DataTypes.STRING,
            set(value) {
               this.setDataValue("transfer_target_name", defineSetterValue(value, "string"));
            }
         },
         transfer_type: {
            type: DataTypes.STRING,
            set(value) {
               this.setDataValue("transfer_type", defineSetterValue(value, "string"));
            }
         },
         flow_outcome: {
            type: DataTypes.STRING,
            set(value) {
               this.setDataValue("flow_outcome", defineSetterValue(value, "string"));
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
               this.setDataValue("flow_outcome_start_time", defineSetterValue(value, "datetime"));
            }
         },
         flow_outcome_end_time: {
            type: DataTypes.DATE(0),
            set(value) {
               this.setDataValue("flow_outcome_end_time", defineSetterValue(value, "datetime"));
            }
         },
         flow_outcome_value: {
            type: DataTypes.STRING,
            set(value) {
               this.setDataValue("flow_outcome_value", defineSetterValue(value, "string"));
            }
         },
         stage_time: {
            type: DataTypes.DATE(0),
            allowNull: false
         }
      });
   } catch (err) {
      throw new Error(`${funcName} Catching ERROR - ${err}`);
   }
};

const defineMetric = () => {
   const funcName = "[defineMetric Func]";

   try {
      return SequelizeConfig.define("Gen_ConDetails_Metric_STG", {
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
               this.setDataValue("value", defineSetterValue(value, "number"));
            }
         },
         emit_date: {
            type: DataTypes.DATE(0),
            set(value) {
               this.setDataValue("emit_date", defineSetterValue(value, "datetime"));
            }
         },
         stage_time: {
            type: DataTypes.DATE(0),
            allowNull: false
         }
      });
   } catch (err) {
      throw new Error(`${funcName} Catching ERROR - ${err}`);
   }
};

export const sessionEntity = defineSession();

export const requestedRoutingEntity = defineRequestedRouting();

export const callbackNumbersEntity = defineCallbackNumbers();

export const activeSkillIdEntity = defineActiveSkillId();

export const sessionFlowEntity = defineSessionFlow();

export const metricEntity = defineMetric();

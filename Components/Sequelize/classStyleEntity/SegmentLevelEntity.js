// noinspection JSCheckFunctionSignatures

import SequelizeConfig from "../../config/sequelizeConfig.js";
import { DataTypes, Model } from "sequelize";
import defineEntitySetterValue from "../../utils/defineEntitySetterValue.js";

export class Segment extends Model {}

Segment.init(
   {
      session_id: {
         type: DataTypes.STRING(36),
         primaryKey: true,
         allowNull: false
      },
      segment_type: {
         type: DataTypes.STRING(12),
         primaryKey: true,
         allowNull: false
      },
      start_time: {
         type: DataTypes.DATE(0),
         set(value) {
            this.setDataValue("start_time", defineEntitySetterValue(value, "datetime"));
         }
      },
      end_time: {
         type: DataTypes.DATE(0),
         set(value) {
            this.setDataValue("end_time", defineEntitySetterValue(value, "datetime"));
         }
      },
      duration: {
         type: DataTypes.BIGINT,
         set(value) {
            this.setDataValue("duration", defineEntitySetterValue(value, "number"));
         }
      },
      disconnect_type: {
         type: DataTypes.STRING(22),
         set(value) {
            this.setDataValue("disconnect_type", defineEntitySetterValue(value, "string", 22));
         }
      },
      queue_id: {
         type: DataTypes.STRING(36),
         set(value) {
            this.setDataValue("queue_id", defineEntitySetterValue(value, "string", 36));
         }
      },
      group_id: {
         type: DataTypes.STRING(36),
         set(value) {
            this.setDataValue("group_id", defineEntitySetterValue(value, "string", 36));
         }
      },
      conference: {
         type: DataTypes.BOOLEAN,
         set(value) {
            this.setDataValue("conference", defineEntitySetterValue(value, "boolean"));
         }
      },
      error_code: {
         type: DataTypes.STRING,
         set(value) {
            this.setDataValue("error_code", defineEntitySetterValue(value, "string"));
         }
      },
      wrap_up_code: {
         type: DataTypes.STRING,
         set(value) {
            this.setDataValue("wrap_up_code", defineEntitySetterValue(value, "string"));
         }
      },
      wrap_up_note: {
         type: DataTypes.STRING(450),
         set(value) {
            this.setDataValue("wrap_up_note", defineEntitySetterValue(value, "string", 450));
         }
      },
      source_conversation_id: {
         type: DataTypes.STRING(36),
         set(value) {
            this.setDataValue("source_conversation_id", defineEntitySetterValue(value, "string", 36));
         }
      },
      source_session_id: {
         type: DataTypes.STRING(36),
         set(value) {
            this.setDataValue("source_session_id", defineEntitySetterValue(value, "string", 36));
         }
      },
      destination_conversation_id: {
         type: DataTypes.STRING(36),
         set(value) {
            this.setDataValue("destination_conversation_id", defineEntitySetterValue(value, "string", 36));
         }
      },
      destination_session_id: {
         type: DataTypes.STRING(36),
         set(value) {
            this.setDataValue("destination_session_id", defineEntitySetterValue(value, "string", 36));
         }
      },
      subject: {
         type: DataTypes.STRING(450),
         set(value) {
            this.setDataValue("subject", defineEntitySetterValue(value, "string", 450));
         }
      },
      requested_language_id: {
         type: DataTypes.STRING,
         set(value) {
            this.setDataValue("requested_language_id", defineEntitySetterValue(value, "string"));
         }
      },
      audio_muted: {
         type: DataTypes.BOOLEAN,
         set(value) {
            this.setDataValue("audio_muted", defineEntitySetterValue(value, "boolean"));
         }
      },
      video_muted: {
         type: DataTypes.BOOLEAN,
         set(value) {
            this.setDataValue("video_muted", defineEntitySetterValue(value, "boolean"));
         }
      },
      stage_time: {
         type: DataTypes.DATE(0),
         allowNull: false
      }
   },
   {
      sequelize: SequelizeConfig,
      tableName: "Gen_ConDetails_Segment_STG"
   }
);

export class SipResponseCode extends Model {}

SipResponseCode.init(
   {
      session_id: {
         type: DataTypes.STRING(36),
         primaryKey: true,
         allowNull: false
      },
      segment_type: {
         type: DataTypes.STRING(12),
         primaryKey: true,
         allowNull: false
      },
      SIP_response_code: {
         type: DataTypes.INTEGER,
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
      tableName: "Gen_ConDetails_SIP_Response_Code_STG"
   }
);

export class RequestedRoutingSkill extends Model {}

RequestedRoutingSkill.init(
   {
      session_id: {
         type: DataTypes.STRING(36),
         primaryKey: true,
         allowNull: false
      },
      segment_type: {
         type: DataTypes.STRING(12),
         primaryKey: true,
         allowNull: false
      },
      requested_routing_skill_id: {
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
      tableName: "Gen_ConDetails_Requested_Routing_Skill_STG"
   }
);

export class RequestedRoutingUser extends Model {}

RequestedRoutingUser.init(
   {
      session_id: {
         type: DataTypes.STRING(36),
         primaryKey: true,
         allowNull: false
      },
      segment_type: {
         type: DataTypes.STRING(12),
         primaryKey: true,
         allowNull: false
      },
      requested_routing_user_id: {
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
      tableName: "Gen_ConDetails_Requested_Routing_User_STG"
   }
);

export class ScoredAgent extends Model {}

ScoredAgent.init(
   {
      session_id: {
         type: DataTypes.STRING(36),
         primaryKey: true,
         allowNull: false
      },
      segment_type: {
         type: DataTypes.STRING(12),
         primaryKey: true,
         allowNull: false
      },
      scored_agent_id: {
         type: DataTypes.STRING(36),
         primaryKey: true,
         allowNull: false
      },
      agent_score: {
         type: DataTypes.INTEGER,
         set(value) {
            this.setDataValue("agent_score", defineEntitySetterValue(value, "number"));
         }
      },
      stage_time: {
         type: DataTypes.DATE(0),
         allowNull: false
      }
   },
   {
      sequelize: SequelizeConfig,
      tableName: "Gen_ConDetails_Scored_Agent_STG"
   }
);

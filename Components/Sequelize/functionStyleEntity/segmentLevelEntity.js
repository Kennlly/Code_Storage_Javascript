// noinspection JSCheckFunctionSignatures

import SequelizeConfig from "../../config/sequelizeConfig.js";
import { DataTypes } from "sequelize";
import defineSetterValue from "../defineSetterValue.js";

const defineSegment = () => {
   const funcName = "[defineSegment Func]";

   try {
      return SequelizeConfig.define("Gen_ConDetails_Segment_STG", {
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
               this.setDataValue("start_time", defineSetterValue(value, "datetime"));
            }
         },
         end_time: {
            type: DataTypes.DATE(0),
            set(value) {
               this.setDataValue("end_time", defineSetterValue(value, "datetime"));
            }
         },
         duration: {
            type: DataTypes.BIGINT,
            set(value) {
               this.setDataValue("duration", defineSetterValue(value, "number"));
            }
         },
         disconnect_type: {
            type: DataTypes.STRING(22),
            set(value) {
               this.setDataValue("disconnect_type", defineSetterValue(value, "string", 22));
            }
         },
         queue_id: {
            type: DataTypes.STRING(36),
            set(value) {
               this.setDataValue("queue_id", defineSetterValue(value, "string", 36));
            }
         },
         group_id: {
            type: DataTypes.STRING(36),
            set(value) {
               this.setDataValue("group_id", defineSetterValue(value, "string", 36));
            }
         },
         conference: {
            type: DataTypes.BOOLEAN,
            set(value) {
               this.setDataValue("conference", defineSetterValue(value, "boolean"));
            }
         },
         error_code: {
            type: DataTypes.STRING,
            set(value) {
               this.setDataValue("error_code", defineSetterValue(value, "string"));
            }
         },
         wrap_up_code: {
            type: DataTypes.STRING,
            set(value) {
               this.setDataValue("wrap_up_code", defineSetterValue(value, "string"));
            }
         },
         wrap_up_note: {
            type: DataTypes.STRING(450),
            set(value) {
               this.setDataValue("wrap_up_note", defineSetterValue(value, "string", 450));
            }
         },
         source_conversation_id: {
            type: DataTypes.STRING(36),
            set(value) {
               this.setDataValue("source_conversation_id", defineSetterValue(value, "string", 36));
            }
         },
         source_session_id: {
            type: DataTypes.STRING(36),
            set(value) {
               this.setDataValue("source_session_id", defineSetterValue(value, "string", 36));
            }
         },
         destination_conversation_id: {
            type: DataTypes.STRING(36),
            set(value) {
               this.setDataValue("destination_conversation_id", defineSetterValue(value, "string", 36));
            }
         },
         destination_session_id: {
            type: DataTypes.STRING(36),
            set(value) {
               this.setDataValue("destination_session_id", defineSetterValue(value, "string", 36));
            }
         },
         subject: {
            type: DataTypes.STRING(450),
            set(value) {
               this.setDataValue("subject", defineSetterValue(value, "string", 450));
            }
         },
         requested_language_id: {
            type: DataTypes.STRING,
            set(value) {
               this.setDataValue("requested_language_id", defineSetterValue(value, "string"));
            }
         },
         audio_muted: {
            type: DataTypes.BOOLEAN,
            set(value) {
               this.setDataValue("audio_muted", defineSetterValue(value, "boolean"));
            }
         },
         video_muted: {
            type: DataTypes.BOOLEAN,
            set(value) {
               this.setDataValue("video_muted", defineSetterValue(value, "boolean"));
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

const defineSipResponseCode = () => {
   const funcName = "[defineSipResponseCode Func]";

   try {
      return SequelizeConfig.define("Gen_ConDetails_SIP_Response_Code_STG", {
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
      });
   } catch (err) {
      throw new Error(`${funcName} Catching ERROR - ${err}`);
   }
};

const defineRequestedRoutingSkill = () => {
   const funcName = "[defineRequestedRoutingSkill Func]";

   try {
      return SequelizeConfig.define("Gen_ConDetails_Requested_Routing_Skill_STG", {
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
      });
   } catch (err) {
      throw new Error(`${funcName} Catching ERROR - ${err}`);
   }
};

const defineRequestedRoutingUser = () => {
   const funcName = "[defineRequestedRoutingUser Func]";

   try {
      return SequelizeConfig.define("Gen_ConDetails_Requested_Routing_User_STG", {
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
      });
   } catch (err) {
      throw new Error(`${funcName} Catching ERROR - ${err}`);
   }
};

const defineScoredAgent = () => {
   const funcName = "[defineScoredAgent Func]";

   try {
      return SequelizeConfig.define("Gen_ConDetails_Scored_Agent_STG", {
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
               this.setDataValue("agent_score", defineSetterValue(value, "number"));
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

export const segmentEntity = defineSegment();

export const sipResponseCodeEntity = defineSipResponseCode();

export const requestedRoutingSkillEntity = defineRequestedRoutingSkill();

export const requestedRoutingUserEntity = defineRequestedRoutingUser();

export const scoredAgentEntity = defineScoredAgent();

// noinspection JSCheckFunctionSignatures

import SequelizeConfig from "../../config/sequelizeConfig.js";
import { DataTypes } from "sequelize";
import defineSetterValue from "../defineSetterValue.js";

const defineConversation = () => {
   const funcName = "[defineConversation Func]";

   try {
      return SequelizeConfig.define("Gen_ConDetails_Conversation_STG", {
         id: {
            type: DataTypes.STRING(36),
            primaryKey: true,
            allowNull: false,
         },
         start_time: {
            type: DataTypes.DATE(0),
            set(value) {
               this.setDataValue("start_time", defineSetterValue(value, "datetime"));
            },
         },
         end_time: {
            type: DataTypes.DATE(0),
            set(value) {
               this.setDataValue("end_time", defineSetterValue(value, "datetime"));
            },
         },
         duration: {
            type: DataTypes.BIGINT,
            set(value) {
               this.setDataValue("duration", defineSetterValue(value, "number"));
            },
         },
         originating_direction: {
            type: DataTypes.STRING(8),
            set(value) {
               this.setDataValue("originating_direction", defineSetterValue(value, "string", 8));
            },
         },
         external_tag: {
            type: DataTypes.STRING,
            set(value) {
               this.setDataValue("external_tag", defineSetterValue(value, "string"));
            },
         },
         media_stats_min_conversation_mos: {
            type: DataTypes.DECIMAL(6, 2),
            set(value) {
               this.setDataValue("media_stats_min_conversation_mos", defineSetterValue(value, "number"));
            },
         },
         media_stats_min_conversation_R_factor: {
            type: DataTypes.DECIMAL(6, 2),
            set(value) {
               this.setDataValue("media_stats_min_conversation_R_factor", defineSetterValue(value, "number"));
            },
         },
         stage_time: {
            type: DataTypes.DATE(0),
            allowNull: false,
         },
      });
   } catch (err) {
      throw new Error(`${funcName} Catching ERROR - ${err}`);
   }
};

const defineDivision = () => {
   const funcName = "[defineDivision Func]";

   try {
      return SequelizeConfig.define("Gen_ConDetails_Division_STG", {
         id: {
            type: DataTypes.STRING(36),
            primaryKey: true,
            allowNull: false,
         },
         conversation_id: {
            type: DataTypes.STRING(36),
            primaryKey: true,
            allowNull: false,
         },
         stage_time: {
            type: DataTypes.DATE(0),
            allowNull: false,
         },
      });
   } catch (err) {
      throw new Error(`${funcName} Catching ERROR - ${err}`);
   }
};

export const conversationEntity = defineConversation();

export const divisionEntity = defineDivision();

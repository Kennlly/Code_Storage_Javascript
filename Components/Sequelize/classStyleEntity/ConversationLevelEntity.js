// noinspection JSCheckFunctionSignatures

import SequelizeConfig from "../../config/sequelizeConfig.js";
import { DataTypes, Model } from "sequelize";
import defineEntitySetterValue from "../../utils/defineEntitySetterValue.js";

export class Conversation extends Model {}

// class Conversation extends Model {}
Conversation.init(
   {
      id: {
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
      originating_direction: {
         type: DataTypes.STRING(8),
         set(value) {
            this.setDataValue("originating_direction", defineEntitySetterValue(value, "string", 8));
         }
      },
      external_tag: {
         type: DataTypes.STRING,
         set(value) {
            this.setDataValue("external_tag", defineEntitySetterValue(value, "string"));
         }
      },
      media_stats_min_conversation_mos: {
         type: DataTypes.DECIMAL(6, 2),
         set(value) {
            this.setDataValue("media_stats_min_conversation_mos", defineEntitySetterValue(value, "number"));
         }
      },
      media_stats_min_conversation_R_factor: {
         type: DataTypes.DECIMAL(6, 2),
         set(value) {
            this.setDataValue("media_stats_min_conversation_R_factor", defineEntitySetterValue(value, "number"));
         }
      },
      stage_time: {
         type: DataTypes.DATE(0),
         allowNull: false
      }
   },
   {
      sequelize: SequelizeConfig,
      tableName: "Gen_ConDetails_Conversation_STG"
   }
);

export class Division extends Model {}
Division.init(
   {
      id: {
         type: DataTypes.STRING(36),
         primaryKey: true,
         allowNull: false
      },
      conversation_id: {
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
      tableName: "Gen_ConDetails_Division_STG"
   }
);

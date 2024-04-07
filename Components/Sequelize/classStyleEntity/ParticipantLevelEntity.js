// noinspection JSCheckFunctionSignatures

import SequelizeConfig from "../../config/sequelizeConfig.js";
import { DataTypes, Model } from "sequelize";
import defineEntitySetterValue from "../../utils/defineEntitySetterValue.js";

export default class Participant extends Model {}

Participant.init(
   {
      id: {
         type: DataTypes.STRING(36),
         primaryKey: true,
         allowNull: false
      },
      name: {
         type: DataTypes.STRING,
         set(value) {
            this.setDataValue("name", defineEntitySetterValue(value, "string"));
         }
      },
      conversation_id: {
         type: DataTypes.STRING(36),
         primaryKey: true,
         allowNull: false
      },
      purpose: {
         type: DataTypes.STRING(9),
         set(value) {
            this.setDataValue("purpose", defineEntitySetterValue(value, "string", 9));
         }
      },
      user_id: {
         type: DataTypes.STRING(36),
         set(value) {
            this.setDataValue("user_id", defineEntitySetterValue(value, "string", 36));
         }
      },
      team_id: {
         type: DataTypes.STRING(36),
         set(value) {
            this.setDataValue("team_id", defineEntitySetterValue(value, "string", 36));
         }
      },
      external_contact_id: {
         type: DataTypes.STRING(36),
         set(value) {
            this.setDataValue("external_contact_id", defineEntitySetterValue(value, "string", 36));
         }
      },
      external_organization_id: {
         type: DataTypes.STRING(36),
         set(value) {
            this.setDataValue("external_organization_id", defineEntitySetterValue(value, "string", 36));
         }
      },
      flagged_reason: {
         type: DataTypes.STRING(7),
         set(value) {
            this.setDataValue("flagged_reason", defineEntitySetterValue(value, "string", 7));
         }
      },
      stage_time: {
         type: DataTypes.DATE(0),
         allowNull: false
      }
   },
   {
      sequelize: SequelizeConfig,
      tableName: "Gen_ConDetails_Participant_STG"
   }
);

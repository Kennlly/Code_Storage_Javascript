// noinspection JSCheckFunctionSignatures

import SequelizeConfig from "../../config/sequelizeConfig.js";
import { DataTypes } from "sequelize";
import defineSetterValue from "../defineSetterValue.js";

const defineParticipant = () => {
   const funcName = "[defineParticipant Func]";

   try {
      return SequelizeConfig.define("Gen_ConDetails_Participant_STG", {
         id: {
            type: DataTypes.STRING(36),
            primaryKey: true,
            allowNull: false
         },
         name: {
            type: DataTypes.STRING,
            set(value) {
               this.setDataValue("name", defineSetterValue(value, "string"));
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
               this.setDataValue("purpose", defineSetterValue(value, "string", 9));
            }
         },
         user_id: {
            type: DataTypes.STRING(36),
            set(value) {
               this.setDataValue("user_id", defineSetterValue(value, "string", 36));
            }
         },
         team_id: {
            type: DataTypes.STRING(36),
            set(value) {
               this.setDataValue("team_id", defineSetterValue(value, "string", 36));
            }
         },
         external_contact_id: {
            type: DataTypes.STRING(36),
            set(value) {
               this.setDataValue("external_contact_id", defineSetterValue(value, "string", 36));
            }
         },
         external_organization_id: {
            type: DataTypes.STRING(36),
            set(value) {
               this.setDataValue("external_organization_id", defineSetterValue(value, "string", 36));
            }
         },
         flagged_reason: {
            type: DataTypes.STRING(7),
            set(value) {
               this.setDataValue("flagged_reason", defineSetterValue(value, "string", 7));
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

export const participantEntity = defineParticipant();

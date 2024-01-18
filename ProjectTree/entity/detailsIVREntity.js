import { DataTypes } from "sequelize";
import SequelizeConfig from "../config/sequelizeConfig.js";

const defineDetailsIVR = () => {
   const funcName = "[defineDetailsIVR Func]";

   try {
      return SequelizeConfig.define("Gen_Conversation_IVR_STG", {
         conversation_id: {
            type: DataTypes.STRING(36),
            primaryKey: true,
            unique: true,
            allowNull: false,
            validate: {
               notEmpty: true,
               isUUID: 4
            }
         },
         participant_id: {
            type: DataTypes.STRING(36),
            primaryKey: true,
            unique: true,
            allowNull: false,
            validate: {
               notEmpty: true,
               isUUID: 4
            }
         },
         queue_id: {
            type: DataTypes.STRING(36),
            primaryKey: true,
            unique: true,
            allowNull: false
         },
         connected_time: {
            type: DataTypes.DATE(0),
            primaryKey: false,
            allowNull: true
         },
         end_time: {
            type: DataTypes.DATE(0),
            primaryKey: false,
            allowNull: true
         },
         duration: {
            type: DataTypes.BIGINT(),
            allowNull: true
         },
         attribute_key: {
            type: DataTypes.STRING(255),
            primaryKey: true,
            allowNull: false,
            validate: {
               notEmpty: true,
               len: [1, 255]
            },
            set(value) {
               value
                  ? this.setDataValue("attribute_key", value.replace(/'/g, "''").replace(/\n/g, " ").substring(0, 255))
                  : null;
            }
         },
         attribute_value: {
            type: DataTypes.TEXT,
            primaryKey: false,
            allowNull: false,
            validate: {
               notEmpty: true
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

const detailsIVREntity = defineDetailsIVR();

export default detailsIVREntity;

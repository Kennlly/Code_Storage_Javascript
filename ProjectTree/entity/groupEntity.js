import { DataTypes } from "sequelize";
import SequelizeConfig from "../config/sequelizeConfig.js";
import { generalLogger } from "../config/winstonConfig.js";

const DefineGroup = () => {
   const funcName = "[DefineGroup]";
   try {
      if (SequelizeConfig === false) {
         generalLogger.error(`${funcName} - Sequelize Configuration ERROR`);
         return false;
      }

      return SequelizeConfig.define("Gen_Group", {
         group_id: {
            type: DataTypes.STRING(36),
            primaryKey: true,
            unique: true,
            allowNull: false,
            validate: {
               notEmpty: true,
               isUUID: 4,
            },
         },
         group_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
               notEmpty: true,
               len: [1, 255],
            },
            set(value) {
               this.setDataValue("group_name", value.replace(/'/g, "''").replace(/\n/g, " ").substring(0, 255));
            },
         },
         description: {
            type: DataTypes.STRING(255),
            set(value) {
               value ? this.setDataValue("description", value.replace(/'/g, "''").replace(/\n/g, " ").substring(0, 255)) : null;
            },
         },
         date_modified: {
            type: DataTypes.DATE(0),
            validate: {
               isDate: true,
            },
         },
         member_count: {
            type: DataTypes.INTEGER,
            validate: {
               isInt: true,
            },
         },
         state: {
            type: DataTypes.STRING(255),
            set(value) {
               value ? this.setDataValue("state", value.replace(/'/g, "''").replace(/\n/g, " ").substring(0, 255)) : null;
            },
         },
         version: {
            type: DataTypes.INTEGER,
            validate: {
               isInt: true,
            },
         },
         type: {
            type: DataTypes.STRING(255),
            set(value) {
               value ? this.setDataValue("type", value.replace(/'/g, "''").replace(/\n/g, " ").substring(0, 255)) : null;
            },
         },
         is_rules_visible: {
            type: DataTypes.BOOLEAN,
            validate: {
               isBoolean: true,
            },
         },
         visibility: {
            type: DataTypes.STRING(255),
            set(value) {
               value ? this.setDataValue("visibility", value.replace(/'/g, "''").replace(/\n/g, " ").substring(0, 255)) : null;
            },
         },
         chat_jabber_id: {
            type: DataTypes.STRING(255),
            set(value) {
               value
                  ? this.setDataValue("chat_jabber_id", value.replace(/'/g, "''").replace(/\n/g, " ").substring(0, 255))
                  : null;
            },
         },
         addresses: {
            type: DataTypes.TEXT,
            get() {
               const value = this.getDataValue("addresses");
               return value ? JSON.parse(value) : null;
            },
            set(value) {
               value ? this.setDataValue("addresses", JSON.stringify(value)) : null;
            },
         },
         owners: {
            type: DataTypes.TEXT,
            get() {
               const value = this.getDataValue("owners");
               return value ? JSON.parse(value) : null;
            },
            set(value) {
               value ? this.setDataValue("owners", JSON.stringify(value)) : null;
            },
         },
         stage_time: {
            // If using the "Date" type, it converses to UTC by the "Sequelize"
            type: DataTypes.STRING(26),
            allowNull: false,
            // defaultValue: DataTypes.NOW,
            // validate: {
            //    isDate: true,
            // },
         },
      });
   } catch (err) {
      generalLogger.error(`[DefineGroup Func] Catching ERROR - ${err}`);
   }
};

const groupEntity = DefineGroup();

export default groupEntity;

import { generalLogger } from "../utils/loggerConfig.js";
import Moment from "moment";
import { DataTypes } from "sequelize";

export default async function extractAndInsertGroup(payload, sequelize) {
   try {
      const groupData = extractGroup(payload);
      if (groupData === false) return false;

      const groupModel = DefineGroup(sequelize);
      if (groupModel === false) return false;

      await Promise.all(
         groupData.map((data) =>
            groupModel.upsert(data, {
               updateOnDuplicate: [
                  "group_name",
                  "description",
                  "date_modified",
                  "member_count",
                  "state",
                  "version",
                  "type",
                  "is_rules_visible",
                  "visibility",
                  "chat_jabber_id",
                  "owners",
                  "stage_time",
               ],
            }),
         ),
      );

      return true;
   } catch (err) {
      generalLogger.error(`extractAndInsertGroup Func Catching ERROR - ${err}.`);
      return false;
   }
}
const extractGroup = (payload) => {
   try {
      return payload.map((group) => ({
         group_id: group["id"],
         group_name: group["name"],
         description: group["description"],
         date_modified: group["dateModified"],
         member_count: group["memberCount"],
         state: group["state"],
         version: group["version"],
         type: group["type"],
         is_rules_visible: group["rulesVisible"],
         visibility: group["visibility"],
         chat_jabber_id: group["chat"] ? (group["chat"]["jabberId"] ? group["chat"]["jabberId"] : null) : null,
         owners: group["owners"],
         stage_time: Moment().format("YYYY-MM-DD HH:mm Z"),
      }));
   } catch (err) {
      generalLogger.error(`extractGroup Func Catching ERROR - ${err}`);
      return false;
   }
};

const DefineGroup = (sequelize) => {
   try {
      return sequelize.define("Gen_Group", {
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
               this.setDataValue(fieldName, value.replace(/'/g, "''").replace(/\n/g, " ").substring(0, 255));
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
      generalLogger.error(`DefineGroup Func Catching ERROR - ${err}`);
      return false;
   }
};

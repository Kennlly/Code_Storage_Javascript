import { DataTypes } from "sequelize";
import SequelizeConfig from "../config/sequelizeConfig.js";

const defineContactInfo = () => {
   const funcName = "[defineContactInfo Func]";

   try {
      return SequelizeConfig.define("Gen_Conversation_ContactInfo_STG", {
         contact_list_id: {
            type: DataTypes.STRING(450),
            primaryKey: true,
            unique: true,
            allowNull: false,
            validate: {
               notEmpty: true,
               len: [1, 450]
            },
            set(value) {
               value
                  ? this.setDataValue("contact_list_id", value.replace(/'/g, "''").replace(/\n/g, " ").substring(0, 450))
                  : null;
            }
         },
         contact_id: {
            type: DataTypes.STRING(450),
            primaryKey: true,
            unique: true,
            allowNull: false,
            validate: {
               notEmpty: true,
               len: [1, 450]
            },
            set(value) {
               value ? this.setDataValue("contact_id", value.replace(/'/g, "''").replace(/\n/g, " ").substring(0, 450)) : null;
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

const contactInfoEntity = defineContactInfo();

export default contactInfoEntity;

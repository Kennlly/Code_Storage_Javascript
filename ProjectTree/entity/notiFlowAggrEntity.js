import { DataTypes } from "sequelize";
import SequelizeConfig from "../config/sequelizeConfig.js";
import LOGGER from "../config/winstonConfig.js";

const defineNotiFlowAggr = () => {
   const funcName = "[defineNotiFlowAggr Func]";
   try {
      if (SequelizeConfig === false) {
         LOGGER.error(`${funcName} - Sequelize Configuration ERROR`);
         return false;
      }

      return SequelizeConfig.define("Gen_Noti_FlowAggregate_STG", {
         id: {
            type: DataTypes.STRING(36),
            primaryKey: true,
            unique: true,
            allowNull: false,
            validate: {
               notEmpty: true,
               isUUID: 4,
            },
         },
         media_type: {
            type: DataTypes.STRING(100),
            primaryKey: true,
            allowNull: false,
            validate: {
               notEmpty: true,
               len: [1, 100],
            },
            set(value) {
               value ? this.setDataValue("media_type", value.replace(/'/g, "''").replace(/\n/g, " ").substring(0, 100)) : null;
            },
         },
         start_time: {
            type: DataTypes.DATE(0),
            primaryKey: true,
            allowNull: false,
            validate: {
               notEmpty: true,
            },
         },
         end_time: {
            type: DataTypes.DATE(0),
            primaryKey: true,
            allowNull: false,
            validate: {
               notEmpty: true,
            },
         },
         metric_key: {
            type: DataTypes.STRING(255),
            primaryKey: true,
            allowNull: false,
            validate: {
               notEmpty: true,
               len: [1, 255],
            },
            set(value) {
               value ? this.setDataValue("metric_key", value.replace(/'/g, "''").replace(/\n/g, " ").substring(0, 255)) : null;
            },
         },
         metric_value: {
            type: DataTypes.BIGINT(),
            allowNull: false,
            validate: {
               notEmpty: true,
            },
         },
         stage_time: {
            type: DataTypes.DATE(0),
            allowNull: false,
         },
      });
   } catch (err) {
      LOGGER.error(`[DefineGroup Func] Catching ERROR - ${err}`);
      return false;
   }
};

const notiFlowAggrEntity = defineNotiFlowAggr();

export default notiFlowAggrEntity;

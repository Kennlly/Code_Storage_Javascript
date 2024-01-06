import { Sequelize } from "sequelize";
import { SQL_DATABASE, SQL_PASSWORD, SQL_SERVER, SQL_USER } from "../utils/constants.js";
import { generalLogger } from "./winstonConfig.js";

const buildSequelizeInstance = async () => {
   try {
      const instance = new Sequelize(SQL_DATABASE, SQL_USER, SQL_PASSWORD, {
         host: SQL_SERVER,
         dialect: "mssql",
         port: 1433,
         timezone: "Eastern Standard Time",
         // logging: (msg) => generalLogger.debug(msg),
         logging: false,
         define: {
            schema: "dbo",
            freezeTableName: true, //Do it in here, so no need to do it in each table schema
            timestamps: false,
         },
         dialectOptions: {
            options: {
               trustServerCertificate: true,
               encrypt: true,
            },
            useUTC: false, // for reading from the MsSQL
         },
         pool: {
            max: 20,
            min: 0,
            idle: 300000,
            acquire: 300000,
         },
      });

      await instance.authenticate();

      return instance;
   } catch (err) {
      generalLogger.error(`[buildSequelizeInstance Func] - ${err}`);
      return false;
   }
};

const SequelizeConfig = await buildSequelizeInstance();

export default SequelizeConfig;

import { Sequelize } from "sequelize";
import { SQL_DATABASE, SQL_PW, SQL_SERVER, SQL_USER, SQL_PORT } from "../utils/constants.js";
import LOGGER from "./winstonConfig.js";

const buildSequelizeInstance = async () => {
   try {
      const instance = new Sequelize(SQL_DATABASE, SQL_USER, SQL_PW, {
         host: SQL_SERVER,
         dialect: "mssql",
         port: SQL_PORT,
         timezone: "Eastern Standard Time",
         // logging: (msg) => LOGGER.debug(msg),
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
         retry: {
            max: 3,
         },
      });

      await instance.authenticate();

      return instance;
   } catch (err) {
      LOGGER.error(`[buildSequelizeInstance Func] Catching ERROR - ${err}`);
      return false;
   }
};

const SequelizeConfig = await buildSequelizeInstance();

export default SequelizeConfig;

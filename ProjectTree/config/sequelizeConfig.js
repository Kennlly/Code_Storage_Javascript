import { Sequelize } from "sequelize";
import { SQL_DATABASE, SQL_PW, SQL_SERVER, SQL_USER, SQL_PORT } from "../utils/constants.js";

const buildSequelizeInstance = async () => {
   const instance = new Sequelize(SQL_DATABASE, SQL_USER, SQL_PW, {
      host: SQL_SERVER,
      dialect: "mssql",
      port: SQL_PORT,
      timezone: "Eastern Standard Time",
      // logging: (msg) => console.log("Sequelize Log: ", msg),
      logging: false,
      define: {
         schema: "dbo",
         freezeTableName: true, //Do it in here, so no need to do it in each table schema
         timestamps: false
      },
      dialectOptions: {
         options: {
            trustServerCertificate: true,
            encrypt: true,
            requestTimeout: 300000
         },
         useUTC: false // for reading from the MsSQL
      },
      pool: {
         max: 100,
         min: 0,
         idle: 300000,
         acquire: 300000
      },
      retry: {
         max: 3
      }
   });

   await instance.authenticate();

   return instance;
};

const SequelizeConfig = await buildSequelizeInstance();

const sequelizeErrHandling = (err) => {
   const { name, errors } = err;
   let customErrs = [];

   for (const error of errors) {
      const errName = error["constructor"]["name"];
      const { message, type, instance } = error;
      const tableName = instance["constructor"]["name"];
      const data = instance["dataValues"];

      const customObj = {
         name,
         category: errName,
         message,
         type,
         tableName,
         data
      };

      customErrs.push(customObj);
   }

   return JSON.stringify(customErrs, null, 3);
};

export { SequelizeConfig, sequelizeErrHandling };

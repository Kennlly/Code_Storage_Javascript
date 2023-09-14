import { Sequelize } from "sequelize";
import { SQL_DATABASE, SQL_PASSWORD, SQL_SERVER, SQL_USER } from "../../utils/constants.js";
import { generalLogger } from "../../utils/loggerConfig.js";

const sequelize = new Sequelize(SQL_DATABASE, SQL_USER, SQL_PASSWORD, {
   host: SQL_SERVER,
   dialect: "mssql",
   port: 1433,
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
      useUTC: false, // for reading from the database
   },
   timezone: "Eastern Standard Time",
   pool: {
      max: 20,
      min: 0,
      idle: 300000,
      acquire: 300000,
   },
   // logging: (msg) => generalLogger.debug(msg),
   logging: false,
});

export default async function buildInstance() {
   try {
      await sequelize.authenticate();
      return sequelize;
   } catch (err) {
      generalLogger.error(`buildInstance Func ${err}`);
      return false;
   }
}

/*
   sync(): Creates the table if it does not exist, else do nothing
   sync({force:true}): Drops the table first if it already exists
   sync({alter:true}): Checks the current state of database(columns it has, their data types, etc.); Performs necessary changes to match the model
*/

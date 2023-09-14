import { Sequelize } from "sequelize";

const sequelize = new Sequelize("GenesysAPI", "sa", "Node@SQLtest", {
   host: "localhost",
   dialect: "mssql",
   dialectOptions: {
      encrypt: true,
   },
   pool: {
      max: 20,
      min: 0,
      acquire: 300000,
      idle: 300000,
   },
   retry: {
      max: 5,
   },
});

export default sequelize;
// try {
//    await sequelize.authenticate();
//    console.log("Connection has been established successfully.");
// } catch (error) {
//    console.error("Unable to connect to the database:", error);
// }

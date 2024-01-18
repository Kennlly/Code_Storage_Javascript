import contactInfoEntity from "../entity/contactInfoEntity.js";
import LOGGER from "../config/winstonConfig.js";

export default async function upsertContactInfoService(data) {
   const funcName = "[upsertContactInfoService Func]";
   const funcArgus = `[Data = ${JSON.stringify(data, null, 3)}]`;

   try {
      if (data.length === 0) return true;

      await Promise.all(
         data.map((record) =>
            contactInfoEntity.upsert(record, {
               updateOnDuplicate: ["stage_time"]
            })
         )
      );

      return true;
   } catch (err) {
      LOGGER.error(`${funcName} Catching ERROR - ${err}\n${funcArgus}`);
      return false;
   }
}

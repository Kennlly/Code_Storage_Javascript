import detailsIVREntity from "../entity/detailsIVREntity.js";
import LOGGER from "../config/winstonConfig.js";

export default async function upsertDetailsIVRService(data) {
   const funcName = "[upsertDetailsIVRService Func]";
   const funcArgus = `[Data = ${JSON.stringify(data, null, 3)}]`;

   try {
      if (data.length === 0) return true;

      await Promise.all(
         data.map((record) =>
            detailsIVREntity.upsert(record, {
               updateOnDuplicate: ["connected_time", "end_time", "duration", "attribute_value", "stage_time"]
            })
         )
      );

      return true;
   } catch (err) {
      LOGGER.error(`${funcName} Catching ERROR - ${err}\n${funcArgus}`);
      return false;
   }
}

import detailsIVREntity from "../entity/detailsIVREntity.js";

export default async function upsertDetailsIVRService(data) {
   if (data.length === 0) return;

   const funcName = "[upsertDetailsIVRService Func]";
   const funcArgus = `[Data = ${JSON.stringify(data, null, 3)}]`;

   try {
      await Promise.all(
         data.map((record) =>
            detailsIVREntity.upsert(record, {
               updateOnDuplicate: ["connected_time", "end_time", "duration", "attribute_value", "stage_time"]
            })
         )
      );
   } catch (err) {
      throw new Error(`${funcName} Catching ERROR - ${err}\n${funcArgus}`);
   }
}

import contactInfoEntity from "../entity/contactInfoEntity.js";

export default async function upsertContactInfoService(data) {
   if (data.length === 0) return;

   const funcName = "[upsertContactInfoService Func]";
   const funcArgus = `[Data = ${JSON.stringify(data, null, 3)}]`;

   try {
      await Promise.all(
         data.map((record) =>
            contactInfoEntity.upsert(record, {
               updateOnDuplicate: ["stage_time"]
            })
         )
      );
   } catch (err) {
      throw new Error(`${funcName} Catching ERROR - ${err}\n${funcArgus}`);
   }
}

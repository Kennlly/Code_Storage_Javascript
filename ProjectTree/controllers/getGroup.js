import { generalLogger } from "../config/winstonConfig.js";
import { fetchGroup } from "../service/lookupsService.js";
import groupEntity from "../entity/groupEntity.js";
import groupMapper from "../mapper/groupMapper.js";

export default async function getGroup() {
   const funcName = `[groupController Func]`;

   try {
      // Step 1: Get data from Genesys
      const data = await fetchGroup();
      if (data === false) return false;

      // Step 2:
      const groupData = groupMapper(data);
      if (groupData === false) return false;
      if (groupData.length === 0) {
         generalLogger.error(`${funcName} - Unexpected EMPTY extracted data!`);
         return false;
      }

      if (groupEntity === false) {
         generalLogger.error(`${funcName} - Sequelize Configuration ERROR`);
         return false;
      }

      // Step 3:
      await Promise.all(
         groupData.map((data) =>
            groupEntity.upsert(data, {
               updateOnDuplicate: [
                  "group_name",
                  "description",
                  "date_modified",
                  "member_count",
                  "state",
                  "version",
                  "type",
                  "is_rules_visible",
                  "visibility",
                  "chat_jabber_id",
                  "owners",
                  "stage_time",
               ],
            }),
         ),
      );

      generalLogger.info(`${funcName} - Completed!`);
      return true;
   } catch (err) {
      generalLogger.error(`${funcName} Catching ERROR - ${err}`);
      return false;
   }
}

const result = await getGroup();
console.log("result", result);

import Moment from "moment";
import LOGGER from "../../config/winstonConfig.js";
import { fetchGroup } from "../../service/lookupsService.js";
import groupEntity from "../../entity/groupEntity.js";
import groupMapper from "../../mapper/groupMapper.js";
import { writeFile } from "../../utils/fileManagement.js";
import { INFO_FOLDER } from "../../utils/constants.js";

export default async function getGroup() {
   const funcName = `[groupController Func]`;

   try {
      // Step 1: Get data from Genesys
      const data = await fetchGroup();
      if (data === false) return false;

      // Step 2: Get the mapped data and entity
      const groupData = groupMapper(data);
      if (groupData === false) return false;
      if (groupData.length === 0) {
         LOGGER.error(`${funcName} - Unexpected EMPTY extracted data!`);
         return false;
      }

      // Step 2: Prepare for storing the Ids in a local file and updating database
      let groupIds = [];
      let upsertPromises = [];

      groupData.forEach((record) => {
         groupIds.push(record["group_id"]);

         const promise = groupEntity.upsert(record, {
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
         });
         upsertPromises.push(promise);
      });

      // Step 3: Writing local file
      const stageTime = Moment().format("YYYY-MM-DD HH:mm");
      await writeFile(`${INFO_FOLDER}groupInfo`, "json", { stageTime, groupIds });

      // Step 4: Insert / Update to database
      await Promise.all(upsertPromises);

      LOGGER.info(`${funcName} - Completed!`);
      return true;
   } catch (err) {
      LOGGER.error(`${funcName} Catching ERROR - ${err}`);
      return false;
   }
}

// const result = await getGroup();
// console.log("result", result);

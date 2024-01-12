import Moment from "moment";
import LOGGER from "../config/winstonConfig.js";

export default function groupMapper(payload) {
   const funcName = "[groupMapper Func]";
   const funcArgus = `[payload = ${JSON.stringify(payload)}]`;

   try {
      if (!payload) {
         LOGGER.error(`${funcName} - Unexpected empty payload!`);
         return false;
      }

      return payload.map((group) => ({
         group_id: group["id"],
         group_name: group["name"],
         description: group["description"],
         date_modified: group["dateModified"],
         member_count: group["memberCount"],
         state: group["state"],
         version: group["version"],
         type: group["type"],
         is_rules_visible: group["rulesVisible"],
         visibility: group["visibility"],
         chat_jabber_id: group["chat"] ? (group["chat"]["jabberId"] ? group["chat"]["jabberId"] : null) : null,
         owners: group["owners"],
         stage_time: Moment().format("YYYY-MM-DD HH:mm Z"),
      }));
   } catch (err) {
      LOGGER.error(`${funcName} Catching ERROR - ${err}\n${funcArgus}`);
      return false;
   }
}

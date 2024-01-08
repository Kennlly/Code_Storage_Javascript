import Moment from "moment";
import { Logger } from "../config/winstonConfig.js";

export default function groupMapper(payload) {
   const funcNote = `[groupMapper Func] [payload = ${JSON.stringify(payload)}]`;
   try {
      if (!payload) {
         Logger.error("[groupMapper Func] - Unexpected empty payload!");
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
      Logger.error(`${funcNote} Catching ERROR - ${err}`);
      return false;
   }
}

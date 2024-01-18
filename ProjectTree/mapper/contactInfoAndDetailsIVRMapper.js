import Moment from "moment";
import LOGGER from "../config/winstonConfig.js";

export default function contactInfoAndDetailsIVRMapper(payload) {
   const funcName = "[contactInfoAndDetailsIVRMapper Func]";
   const funcArgus = `[payload = ${JSON.stringify(payload, null, 3)}]`;

   try {
      if (!payload || payload.length === 0 || JSON.stringify(payload) === "{}") {
         LOGGER.error(`${funcName} - Unexpected EMPTY Payload ERROR!`);
         return false;
      }

      const conversationId = payload["id"];
      if (!conversationId) {
         LOGGER.error(`${funcName} - Unexpected EMPTY Conversation Id ERROR!\n${funcArgus}`);
         return false;
      }

      const participantData = payload["participants"];
      if (!participantData || participantData.length === 0) {
         LOGGER.error(`${funcName} - Unexpected EMPTY Participants Data ERROR!\n${funcArgus}`);
         return false;
      }

      const stageTime = Moment().format("YYYY-MM-DD HH:mm:ss Z");
      const listIdToId = new Map();
      let ivrData = [];

      for (const participant of participantData) {
         const attributes = participant["attributes"];
         if (!attributes || JSON.stringify(attributes) === "{}") continue;

         const attributeKeys = Object.keys(attributes);
         for (const key of attributeKeys) {
            const value = attributes[key];
            if (!value.trim()) continue;

            const ivrObj = {
               conversation_id: conversationId,
               participant_id: participant["id"] ? participant["id"] : null,
               queue_id: participant["queueId"] ? participant["queueId"] : "NULL",
               connected_time: participant["connectedTime"] ? participant["connectedTime"] : null,
               end_time: participant["endTime"] ? participant["endTime"] : null,
               duration:
                  participant["connectedTime"] && participant["endTime"]
                     ? Moment(participant["endTime"], "YYYY-MM-DDTHH:mm:ss.SSS[Z]").diff(
                          Moment(participant["connectedTime"], "YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
                          "ms"
                       )
                     : null,
               attribute_key: key,
               attribute_value: attributes[key],
               stage_time: stageTime
            };

            ivrData.push(ivrObj);
         }

         const contactId = attributes["dialerContactId"];
         const contactListId = attributes["dialerContactListId"];
         if (contactId && contactListId) {
            if (listIdToId.has(contactListId)) {
               const idObj = listIdToId.get(contactListId);
               idObj[contactId] = stageTime;
               listIdToId.set(contactListId, idObj);
            } else {
               listIdToId.set(contactListId, { [contactId]: stageTime });
            }
         }
      }

      let contactInfoData = [];
      for (const [key, value] of listIdToId.entries()) {
         const idKeys = Object.keys(value);
         for (const idKey of idKeys) {
            const obj = {
               contact_list_id: key,
               contact_id: idKey,
               stage_time: stageTime
            };
            contactInfoData.push(obj);
         }
      }

      return { ivrData, contactInfoData };
   } catch (err) {
      LOGGER.error(`${funcName} Catching ERROR - ${err}\n${funcArgus}`);
      return false;
   }
}

// const data = await readFile(`${INFO_FOLDER}conversation_18`, "json");
// const data = await readFile(`${INFO_FOLDER}conversation_104`, "json");
// const result = contactInfoAndDetailsIVRMapper(data);
// console.log("extract result: ", result);

import WebSocket from "ws";
import { refreshChannel } from "./refreshChannel.js";
import LOGGER from "../../../config/winstonConfig.js";

export default async function createNoti(name, topics, handleDataFunc) {
   const funcNote = "[createNoti Func]";
   const funcArgus = `[Topics = ${JSON.stringify(topics, null, 3)}]`;

   try {
      let isSocketOpen = false;
      let timeout, wsInstance;

      const activateChannel = async () => {
         const channelUri = await refreshChannel(name, topics);
         if (channelUri === false) {
            LOGGER.error(`${funcNote} - Refreshing Channel ERROR!\n${funcArgus}`);
            return;
         }

         wsInstance = new WebSocket(channelUri);

         wsInstance.on("open", () => {
            LOGGER.info(`${funcNote} - WebSocket OPEN!`);

            isSocketOpen = true;
            timeout = setTimeout(() => {
               isSocketOpen = false;
            }, 100000);
         });

         wsInstance.on("close", (err) => {
            LOGGER.error(`${funcNote} - WebSocket CLOSED: ${err}`);
            wsInstance.terminate();
            activateChannel();
         });

         wsInstance.on("error", (err) => {
            LOGGER.error(`${funcNote} - WebSocket ERROR: ${err}`);
            wsInstance.terminate();
            activateChannel();
         });

         wsInstance.on("ping", (event) => {
            LOGGER.warn(`${funcNote} - WebSocket Received "ping" Message: ${event}`);
         });

         wsInstance.on("message", async (data) => {
            //If no data within 100 seconds (because heartbeat sends every 30 sec, after no heartbeat 3 times, openedSocket turn to false, then the second time setInterval will trigger reconnect)
            clearTimeout(timeout);
            isSocketOpen = true;
            timeout = setTimeout(() => {
               isSocketOpen = false;
            }, 100000);

            let jsonData;
            try {
               jsonData = JSON.parse(data);
            } catch (err) {
               LOGGER.error(`${funcNote} - Convert flow-in data into JSON ERROR!`);
               return;
            }

            const { topicName, eventBody } = jsonData;

            if (topicName === "channel.metadata" && eventBody.message === "WebSocket Heartbeat") return;

            return await handleDataFunc(eventBody);
         });
      };

      await activateChannel();

      // Detect heartbeat, or reconnect
      const timeInterval = 60 * 1000;
      setInterval(() => {
         if (isSocketOpen) return;

         LOGGER.error(`${funcNote} - NO Heartbeat Detected! Reconnecting!`);

         wsInstance.terminate();
         clearTimeout(timeout);
         timeout = null;
         wsInstance = null;

         activateChannel();
      }, timeInterval);
   } catch (err) {
      LOGGER.error(`${funcNote} Catching ERROR - ${err}\n${funcArgus}`);
      return false;
   }
}

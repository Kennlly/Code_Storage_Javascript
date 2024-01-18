import WebSocket from "ws";
import LOGGER from "../../config/winstonConfig.js";
import { readFile, writeFile } from "../../utils/fileManagement.js";
import { INFO_FOLDER } from "../../utils/constants.js";
import { createChannel, createSubscription, removeChannel } from "../api/realtime/channelManagement.js";

const refreshChannel = async (name, topics) => {
   const funcNote = `[refreshChannel Func] [Channel Name = ${name}]`;
   const funcArgus = `[Topics = ${JSON.stringify(topics, null, 3)}]`;

   try {
      // Step 1: Delete the previous channel Id if exists
      const localRecord = await readFile(`${INFO_FOLDER}${name}ChannelInfo`, "json");

      const prevChannelId = localRecord["id"];

      if (prevChannelId) {
         const removeResult = await removeChannel(prevChannelId);
         if (!removeResult) {
            LOGGER.warn(`${funcNote} - Deleting Previous Channel Id ERROR!`);
         }
      }

      // Step 2: Create a new channel
      const channelInfo = await createChannel();

      const { connectUri, id } = channelInfo;

      // Store channelId in local file
      await writeFile(`${INFO_FOLDER}${name}ChannelInfo`, "json", channelInfo);

      // Step 3: Create subscription
      await createSubscription(id, topics);

      return connectUri;
   } catch (err) {
      throw new Error(`${funcNote} Catching ERROR - ${err}\n${funcArgus}`);
   }
};

export default async function createSubscriptionPattern(name, topics, handleDataFunc) {
   const funcNote = `[createSubscriptionPattern Func] [Channel Name = ${name}]`;

   let isSocketOpen = false;
   let timeout, wsInstance;

   const activateChannel = async () => {
      try {
         const channelUri = await refreshChannel(name, topics);

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

            const { topicName, eventBody } = JSON.parse(data);

            if (topicName === "channel.metadata" && eventBody.message === "WebSocket Heartbeat") return;

            return await handleDataFunc(eventBody);
         });
      } catch (err) {
         LOGGER.error(`${funcNote} [activateChannel Sub Func] Catching ERROR - ${err}.`);
         wsInstance.terminate();
         await activateChannel();
      }
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
}

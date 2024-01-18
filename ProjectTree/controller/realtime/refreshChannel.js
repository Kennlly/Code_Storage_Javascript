import LOGGER from "../../config/winstonConfig.js";
import { readFile, writeFile } from "../../utils/fileManagement.js";
import { INFO_FOLDER } from "../../utils/constants.js";
import { createChannel, createSubscription, removeChannel } from "../api/realtime/channelManagement.js";

export default async function refreshChannel(name, topics) {
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
}

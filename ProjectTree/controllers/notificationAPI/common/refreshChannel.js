import LOGGER from "../../../config/winstonConfig.js";
import { readFile, writeFile } from "../../../utils/fileManagement.js";
import { INFO_FOLDER } from "../../../utils/constants.js";
import { createChannel, createSubscription, removeChannel } from "../../../service/common/notificationAPIService.js";

export const refreshChannel = async (name, topics) => {
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
      if (channelInfo === false) {
         LOGGER.error(`${funcNote} - Creating New Channel ERROR!`);
         return false;
      }

      const { connectUri, id } = channelInfo;

      // Store channelId in local file
      await writeFile(`${INFO_FOLDER}${name}ChannelInfo`, "json", channelInfo);

      // Step 3: Create subscription
      const isSubscribed = await createSubscription(id, topics);
      if (isSubscribed === false) {
         LOGGER.error(`${funcNote} - Creating Subscription ERROR!\n${funcArgus}`);
         return false;
      }

      return connectUri;
   } catch (err) {
      LOGGER.error(`${funcNote} Catching ERROR - ${err}\n${funcArgus}`);
      return false;
   }
};

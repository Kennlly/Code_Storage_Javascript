import LOGGER from "../config/winstonConfig.js";
import nodeMailerConfig from "../config/nodeMailerConfig.js";
import { EMAIL_CC_RECIPIENTS, EMAIL_RECIPIENTS } from "./constants.js";

export default async function deliverEmailNoti(content) {
   const funcName = "[deliverEmailNoti Func]";
   const funcArgus = `[Content = ${JSON.stringify(content)}]`;

   if (nodeMailerConfig === false) {
      LOGGER.error(`${funcName} - Node Mailer Configuration ERROR!`);
      return false;
   }

   try {
      const message = {
         from: "NTT_IW_WFM_DATA_CHECK<bpo_iw_smtprelay@global.ntt>",
         to: EMAIL_RECIPIENTS,
         cc: EMAIL_CC_RECIPIENTS,
         subject: "Testing locally",
         text: content,
      };

      // const errorFilePath = `${INFO_FILEPATH}emailNotificationErrorMsg.txt`;
      // const isErrorFileExist = await isFileExist(errorFilePath);

      // if (isErrorFileExist) {
      //    message.attachments = [{ path: errorFilePath }];
      // }

      const sendEmailResult = await nodeMailerConfig.sendMail(message);
      // if (sendEmailResult && isErrorFileExist) {
      //    return await removeFile(errorFilePath);
      // }

      return true;
   } catch (err) {
      LOGGER.error(`${funcName} ${funcArgus} Catching ERROR - ${err}`);
      return false;
   }
}

// const result = await deliverEmailNoti("test");
// console.log("result", result);

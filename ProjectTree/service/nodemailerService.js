import { generalLogger } from "../config/winstonConfig.js";
import nodeMailerConfig from "../config/nodeMailerConfig.js";
import { EMAIL_CC_RECIPIENTS, EMAIL_RECIPIENTS } from "../utils/constants.js";

export default async function nodemailerService(content) {
   const funcNote = `[nodemailerService Func] [content = ${content}]`;
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
      generalLogger.error(`${funcNote} - ${err}`);
      return false;
   }
}

// const result = await nodemailerService("test");
// console.log("result", result);

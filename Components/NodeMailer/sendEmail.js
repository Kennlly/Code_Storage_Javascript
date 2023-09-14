"use strict";
import nodemailer from "nodemailer";
import { generalLogger } from "../utils/loggerConfig.js";
import { EMAIL_PW, EMAIL_RECIPIENTS } from "./constants.js";

export default async function sendEmail(content) {
   try {
      // const transporter = nodemailer.createTransport({
      //    service: "hotmail",
      //    auth: {
      //       user: "kenny.he1121@outlook.com",
      //       pass: "???",
      //    },
      // });
      const transporter = nodemailer.createTransport({
         pool: true,
         host: "eu-smtp-outbound-1.mimecast.com",
         port: 587,
         secure: false,
         auth: {
            user: "bpo_iw_smtprelay@global.ntt",
            pass: EMAIL_PW,
         },
      });

      const errorFilePath = `${INFO_FILEPATH}emailNotificationErrorMsg.txt`;
      const isErrorFileExist = await isFileExist(errorFilePath);

      let message = {};
      message.from = "NTT_IW_WFM_DATA_CHECK<bpo_iw_smtprelay@global.ntt>";
      message.to = EMAIL_RECIPIENTS;
      message.cc = EMAIL_CC_RECIPIENTS;
      message.subject = "Calabrio Salesforce Agent License Checking";
      message.text = content;
      if (isErrorFileExist) {
         message.attachments = [{ path: errorFilePath }];
      }

      const sendEmailResult = await transporter.sendMail(message);

      if (sendEmailResult && isErrorFileExist) {
         return await removeFile(errorFilePath);
      }

      return true;
   } catch (err) {
      generalLogger.error(`sendEmail Func ${err}.`);
      return false;
   }
}

// await sendEmail();

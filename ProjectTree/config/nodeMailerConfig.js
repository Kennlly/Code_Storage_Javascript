import nodemailer from "nodemailer";
import { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PW } from "../utils/constants.js";

const NodeMailerConfig = nodemailer.createTransport({
   pool: true,
   host: EMAIL_HOST,
   port: EMAIL_PORT,
   secure: false,
   auth: {
      user: EMAIL_USER,
      pass: EMAIL_PW
   }
});

export default NodeMailerConfig;

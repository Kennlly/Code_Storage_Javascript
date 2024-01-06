import Nodemailer from "nodemailer";
import { EMAIL_USER, EMAIL_PW } from "../utils/constants.js";

// const transporter = nodemailer.createTransport({
//    service: "hotmail",
//    auth: {
//       user: "kenny.he1121@outlook.com",
//       pass: "???",
//    },
// });
const NodeMailerConfig = Nodemailer.createTransport({
   pool: true,
   host: "eu-smtp-outbound-1.mimecast.com",
   port: 587,
   secure: false,
   auth: {
      user: EMAIL_USER,
      pass: EMAIL_PW,
   },
   // tls: {
   // do not fail on invalid certs
   // rejectUnauthorized: false,
   // },
});

export default NodeMailerConfig;

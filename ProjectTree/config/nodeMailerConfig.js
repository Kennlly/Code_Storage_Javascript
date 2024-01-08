import Nodemailer from "nodemailer";
import { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PW } from "../utils/constants.js";

// const transporter = nodemailer.createTransport({
//    service: "hotmail",
//    auth: {
//       user: "kenny.he@itsp-inc.com",
//       pass: "???",
//    },
// });
const NodeMailerConfig = Nodemailer.createTransport({
   pool: true,
   host: EMAIL_HOST,
   port: EMAIL_PORT,
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

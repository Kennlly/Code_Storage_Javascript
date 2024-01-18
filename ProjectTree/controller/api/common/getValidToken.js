import Moment from "moment";
import LOGGER from "../../../config/winstonConfig.js";
import { GENESYS_CLIENT_ID, GENESYS_CLIENT_SECRET, INFO_FOLDER } from "../../../utils/constants.js";
import { readFile, writeFile } from "../../../utils/fileManagement.js";
import Axios from "axios";
import { setTimeout } from "timers/promises";

const fetchToken = async () => {
   const funcName = "[fetchToken Func]";

   const apiEndpoint = "https://login.cac1.pure.cloud/oauth/token";

   let retryCounter = 1;

   while (retryCounter <= 3) {
      try {
         const response = await Axios({
            method: "POST",
            url: apiEndpoint,
            params: {
               grant_type: "client_credentials",
            },
            headers: {
               "Content-Type": "application/x-www-form-urlencoded",
               Authorization: `Basic ${Buffer.from(GENESYS_CLIENT_ID + ":" + GENESYS_CLIENT_SECRET).toString("base64")}`,
            },
         });

         const { data, status, statusText } = response;

         if (status === 200) return data;

         if (status === 429) {
            // Known issue - Calling API too frequently
            await setTimeout(60000);
         } else {
            LOGGER.error(
               `${funcName} - Response code = ${status}; Error Msg = ${statusText}. Retrying on ${retryCounter} / 3.`,
            );

            if (retryCounter === 3) break;

            await setTimeout(10000 * retryCounter);
            retryCounter++;
         }
      } catch (err) {
         const errResponse = err["response"];

         if (!errResponse) {
            LOGGER.error(`${funcName} - ${err.toString()}`);
         } else {
            const {
               data: { message },
               status,
               statusText,
            } = err["response"];
            LOGGER.error(`${funcName} - Response Code = ${status}. Status Text = ${statusText}. Description: ${message}`);
         }

         if (retryCounter === 3) break;

         await setTimeout(10000 * retryCounter);
         retryCounter++;
      }
   }

   throw new Error(`${funcName} - ERROR after 3 times retries!`);
};

const isTokenValid = (tokenInfo) => {
   try {
      if (JSON.stringify(tokenInfo) === "{}") return { isValid: false, token: "" };

      const { access_token, token_type, expires_in, createAt } = tokenInfo;
      if (!access_token || !token_type || !expires_in || !createAt) return { isValid: false, token: "" };

      const createTimeInMoment = Moment(createAt, "YYYY-MM-DD HH:mm", true);
      const timeDiff = Moment().diff(createTimeInMoment, "hour");

      return timeDiff <= 23 ? { isValid: true, token: access_token } : { isValid: false, token: "" };
   } catch (err) {
      throw new Error(`[isTokenValid Func] Catching ERROR - ${err}.`);
   }
};

export default async function getValidToken() {
   const funcName = "[getValidToken Func]";

   try {
      // Get token from local file
      const localTokenInfo = await readFile(`${INFO_FOLDER}genesysToken`, "json");

      const { isValid, token } = isTokenValid(localTokenInfo);
      if (isValid) return token;

      // Generate new token and update local file
      const newToken = await fetchToken();
      newToken.createAt = Moment().format("YYYY-MM-DD HH:mm");
      await writeFile(`${INFO_FOLDER}genesysToken`, "json", newToken);

      return newToken["access_token"];
   } catch (err) {
      throw new Error(`${funcName} Catching ERROR - ${err}.`);
   }
}

// const result = await getValidToken();
// console.log("result: ", result);

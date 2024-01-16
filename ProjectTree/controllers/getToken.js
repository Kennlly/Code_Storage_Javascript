import Moment from "moment";
import fetchToken from "../service/common/tokenService.js";
import LOGGER from "../config/winstonConfig.js";
import { INFO_FOLDER } from "../utils/constants.js";
import { readFile, writeFile } from "../utils/fileManagement.js";

export default async function getToken() {
   const funcName = "[getToken Func]";

   try {
      // Get token from local file
      const localTokenInfo = await readFile(`${INFO_FOLDER}genesysToken`, "json");

      const { isValid, token } = isTokenValid(localTokenInfo);
      if (isValid) return token;

      // Generate new token and update local file
      const newToken = await fetchToken();
      if (newToken === false) {
         LOGGER.error(`${funcName} - Generate new token ERROR!`);
         return false;
      }

      newToken.createAt = Moment().format("YYYY-MM-DD HH:mm");
      await writeFile(`${INFO_FOLDER}genesysToken`, "json", newToken);

      return newToken["access_token"];
   } catch (err) {
      LOGGER.error(`${funcName} Catching ERROR - ${err}.`);
      return false;
   }
}

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

// const result = await getToken();
// console.log("result: ", result);

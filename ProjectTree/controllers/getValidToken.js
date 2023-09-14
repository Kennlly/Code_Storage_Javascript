import moment from "moment";
import fetchToken from "../apis/fetchToken.js";
import { generalLogger } from "../utils/loggerConfig.js";
import { INFOS_FOLDER } from "../utils/constants.js";
import { readFilePattern, writeFilePattern } from "./fileControllers/index.js";

export default async function getValidToken() {
   try {
      // Get token from local file
      const localTokenInfo = await readFilePattern(`${INFOS_FOLDER}genesysToken`, "json");
      if (localTokenInfo === false) {
         generalLogger.error("getValidToken Func - Get local token info ERROR!");
         return false;
      }

      // If local token info available, check if it is valid
      const { isValid, token } = isTokenValid(localTokenInfo);
      if (isValid) return token;

      // Generate new token and update local file
      const newToken = await fetchToken();
      if (newToken === false) {
         generalLogger.error("getValidToken Func - Generate new token ERROR!");
         return false;
      }

      newToken.createAt = moment().format("YYYY-MM-DD HH:mm");
      const writingResult = await writeFilePattern(`${INFOS_FOLDER}genesysToken`, "json", newToken);
      if (writingResult === false) {
         generalLogger.error("getValidToken Func - Writing new token to local ERROR!");
         return false;
      }

      return newToken["access_token"];
   } catch (err) {
      generalLogger.error(`getValidToken Func ${err}.`);
      return false;
   }
}

const isTokenValid = async (tokenInfo) => {
   if (JSON.stringify(tokenInfo) === "{}") return { isValid: false, token: "" };

   const { access_token, createAt } = tokenInfo;
   if (!createAt) return { isValid: false, token: "" };

   const createTimeInMoment = moment(createAt, "YYYY-MM-DD HH:mm", true);
   const currentTimeInMoment = moment();
   const timeDiff = currentTimeInMoment.diff(createTimeInMoment, "hour");

   return timeDiff <= 23 ? { isValid: true, token: access_token } : { isValid: false, token: "" };
};

// Complicated Version
// export default async function getValidToken(context, isMandatory) {
//    try {
//       const momentNow = moment();
//
//       const currentIndex = await getTokenIndex(context, isMandatory);
//       if (currentIndex === false) return false;
//
//       const clientIdPromise = getSecretsFromKeyVault(context, `GenesysClientId${currentIndex}`);
//       const clientSecretPromise = getSecretsFromKeyVault(context, `GenesysClientSecret${currentIndex}`);
//       const [clientId, clientSecret] = await Promise.all([clientIdPromise, clientSecretPromise]);
//
//       // if isMandatory, means the token exceed api calling limitation, needs to switch
//       if (isMandatory) {
//          const tokenInfo = await fetchToken(context, clientId, clientSecret);
//          tokenInfo.createAt = momentNow.format("YYYY-MM-DD HH:mm");
//          const writingResult = await writeFilePattern(context, "src/info/token", "json", tokenInfo);
//          if (writingResult === false) return false;
//
//          return tokenInfo["access_token"];
//       }
//
//       // if !isMandatory, check if token is valid
//       const tokenInfo = await readFilePattern(context, "src/info/token", "json");
//       if (tokenInfo === false) return false;
//
//       const isValid = tokenInfo !== "" && momentNow.diff(moment(tokenInfo["createAt"], "YYYY-MM-DD HH:mm", true), "hour") <= 23;
//
//       if (isValid) return tokenInfo["access_token"];
//
//       const newToken = await fetchToken(context, clientId, clientSecret);
//       newToken.createAt = momentNow.format("YYYY-MM-DD HH:mm");
//       const writingResult = await writeFilePattern(context, "src/info/token", "json", newToken);
//       if (writingResult === false) return false;
//
//       return newToken["access_token"];
//    } catch (err) {
//       context.error(`getValidToken Func ${err}.`);
//       return false;
//    }
// }
//
// const getTokenIndex = async (context, isMandatory) => {
//    try {
//       const originalIdIndex = await readFilePattern(context, "src/info/tokenIndex", "txt");
//       if (originalIdIndex === false) return false;
//
//       if (originalIdIndex === "") {
//          const writingResult = await writeFilePattern(context, "src/info/tokenIndex", "txt", "1,2,3");
//          if (writingResult === false) return false;
//
//          return "1";
//       }
//
//       if (!isMandatory) return originalIdIndex[0];
//
//       // reorder the indexes
//       const tempArr = originalIdIndex.split(",");
//       const firstEle = tempArr.shift();
//       tempArr.push(firstEle);
//       const resultStr = tempArr.join(",");
//
//       const writingResult = await writeFilePattern(context, "src/info/tokenIndex", "txt", resultStr);
//       if (writingResult === false) return false;
//
//       return resultStr[0];
//    } catch (err) {
//       context.error(`getTokenIndex Func ${err}.`);
//       return false;
//    }
// };

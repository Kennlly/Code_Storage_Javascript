import { generalLogger } from "../../ProjectTree/utils/loggerConfig.js";
import { GENESYS_ENDPOINT_URL } from "../../ProjectTree/utils/constants.js";
import restGETPattern from "../../ProjectTree/apis/patterns/restGETPattern.js";

export default async function getLookUpsModel(apiEndpoint) {
   let fullPayload = [];
   try {
      const loopingResult = await getLookUpsModelRecursionHelper(apiEndpoint, fullPayload);
      if (loopingResult === false) return false;

      return fullPayload;
   } catch (err) {
      generalLogger.error(`getLookUpsModel Func ${err}. ApiEndpoint = ${apiEndpoint}`);
      return false;
   }
}

const getLookUpsModelRecursionHelper = async (apiEndpoint, fullPayload) => {
   try {
      const payload = await restGETPattern(apiEndpoint);
      if (payload === false) {
         generalLogger.error(
            `getLookUpsModel Func - getLookUpsModelRecursionHelper: Get payload ERROR! ApiEndpoint = ${apiEndpoint}`
         );
         return false;
      }

      const { entities, nextUri } = payload;
      if (JSON.stringify(payload) === "{}" || !entities || entities.length === 0) {
         generalLogger.error(
            `getLookUpsModel Func - getLookUpsModelRecursionHelper: Unexpected EMPTY payload! ApiEndpoint = ${apiEndpoint} Payload = \n${JSON.stringify(
               payload
            )}`
         );
         return false;
      }

      fullPayload.push(...entities);
      if (!nextUri) return;

      await getLookUpsModelRecursionHelper(`${GENESYS_ENDPOINT_URL}${nextUri}`, fullPayload);
   } catch (err) {
      generalLogger.error(`getLookUpsModel Func - getLookUpsModelRecursionHelper: ${err}. ${apiEndpoint}`);
      return false;
   }
};

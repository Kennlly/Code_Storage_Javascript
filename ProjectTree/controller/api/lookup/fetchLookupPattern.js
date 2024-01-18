import restAPIPattern from "../common/restAPIPattern.js";

export default async function fetchLookupPattern(apiEndpoint) {
   const funcName = "[fetchLookupPattern Func]";

   let currentUri = apiEndpoint;
   let results = [];

   while (true) {
      let funcArgus = `[API Endpoint = ${currentUri}]`;

      const data = await restAPIPattern("GET", currentUri, null, null);
      if (data === false) throw new Error(`${funcName} ${funcArgus} - Getting data from Genesys ERROR!`);

      const partial = data["entities"];
      if (JSON.stringify(data) === "{}" || !partial || partial.length === 0) {
         throw new Error(`${funcName} ${funcArgus} - Unexpected EMPTY payload!`);
      }

      results.push(...partial);

      const nextUri = data["nextUri"];

      if (!nextUri) return results;

      currentUri = nextUri;
   }
}

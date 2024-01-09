export default async function fetchPayload(lob, jobId) {
   const funcNote = `LOB = ${lob}, JobId = ${jobId}.`;
   try {
      let fullPayload = [];

      const isDFSSucceed = await fetchPayloadRecursionHelper(lob, jobId, null, fullPayload);

      if (!isDFSSucceed) return false;

      return fullPayload;
   } catch (err) {
      LOGGER.error(`fetchPayload Func ${err} ${funcNote}`);
      return false;
   }
}

const fetchPayloadRecursionHelper = async (lob, jobId, cursor, fullPayload) => {
   const apiEndpoint = cursor
      ? `${GENESYS_ENDPOINT_URL}/api/v2/analytics/conversations/details/jobs/${jobId}/results?pageSize=1000&cursor=${cursor}`
      : `${GENESYS_ENDPOINT_URL}/api/v2/analytics/conversations/details/jobs/${jobId}/results?pageSize=1000`;
   const funcNote = `LOB = ${lob}; JobId = ${jobId}; API Endpoint = ${apiEndpoint}`;

   let retryCounter = 1;
   while (retryCounter <= 3) {
      try {
         const genesysToken = await generateValidToken(lob);
         if (genesysToken === false) return false;

         const response = await fetch(apiEndpoint, {
            method: "GET",
            headers: {
               "Content-Type": "application/json",
               Authorization: `bearer ${genesysToken}`,
            },
         });

         const isSucceed = response.ok;
         if (isSucceed) {
            const jsonResponse = await response.json();
            fullPayload.push(...jsonResponse["conversations"]);
            if (jsonResponse["cursor"]) await fetchPayloadRecursionHelper(lob, jobId, jsonResponse["cursor"], fullPayload);
            return true;
         }

         const responseCode = response["status"];
         const errorMsg = response["statusText"];
         if (responseCode === 429) {
            // Known issue - Calling apis too frequently
            await forceThreadSleep(120000 * retryCounter);
         } else {
            LOGGER.error(
               `fetchPayloadRecursionHelper Func - Response code = ${responseCode}; Error Msg = ${errorMsg}. Retrying on ${retryCounter} / 3.`,
            );
            await forceThreadSleep(10000 * retryCounter);
         }
      } catch (err) {
         LOGGER.error(`fetchPayloadRecursionHelper Func ${err} Retrying on ${retryCounter} / 3.`);
         await forceThreadSleep(10000 * retryCounter);
      }

      retryCounter++;
   }

   LOGGER.error(`fetchPayloadRecursionHelper Func ERROR after 3 times retries! ${funcNote}`);
   return false;
};

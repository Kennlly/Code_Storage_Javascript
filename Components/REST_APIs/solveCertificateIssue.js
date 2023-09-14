import https from "node:https";
import fetch from "node-fetch";

const httpAgent = new https.Agent({
   rejectUnauthorized: false,
});

const response = await fetch(apiEndpoint, {
   method: "GET",
   headers: {
      "Content-Type": "application/json",
      "Accept-Language": "en-US",
      "ININ-ICWS-CSRF-Token": csrfToken,
      Cookie: setCookie,
   },
   agent: httpAgent,
});

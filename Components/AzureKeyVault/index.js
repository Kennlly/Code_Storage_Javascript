import { SecretClient } from "@azure/keyvault-secrets";
import { DefaultAzureCredential } from "@azure/identity";
import { setTimeout } from "timers/promises";

const CREDENTIAL = new DefaultAzureCredential();
const KEY_VAULT_NAME = process.env["KEY_VAULT_NAME"];
const URL = "https://" + KEY_VAULT_NAME + ".vault.azure.net";
const CLIENT = new SecretClient(URL, CREDENTIAL);

const createSecret = async (context, secretName, value) => {
   const funcNote = `Secret Name = ${secretName}; Value = ${value}`;
   let retryCounter = 1;

   while (retryCounter <= 3) {
      try {
         const createResult = await CLIENT.setSecret(secretName, value);

         if (createResult) return true;
      } catch (err) {
         context.error(`createSecret Func ${err}.`);
      }

      await setTimeout(5000 * retryCounter);
      retryCounter++;
   }

   context.error(`createSecret Func ERROR after 3 times retries! ${funcNote}`);
   return false;
};

const getSecret = async (context, secretName) => {
   const funcNote = `Secret Name = ${secretName}.`;
   let retryCounter = 1;

   while (retryCounter <= 3) {
      try {
         const getResult = await CLIENT.getSecret(secretName);

         if (getResult) return getResult["value"];
      } catch (err) {
         context.error(`getSecret Func ${err}.`);
      }

      await setTimeout(5000 * retryCounter);
      retryCounter++;
   }

   context.error(`createSecret Func ERROR after 3 times retries! ${funcNote}`);
   return false;
};

const purgeDeleteSecret = async (context, secretName) => {
   const funcNote = `Secret Name = ${secretName}.`;

   let retryCounter = 0;

   do {
      try {
         const poller = await CLIENT.beginDeleteSecret(secretName);
         await poller.pollUntilDone();

         await CLIENT.purgeDeletedSecret(secretName);

         return true;
      } catch (err) {
         if (err.toString().startsWith(`RestError`)) {
            await createSecret(context, secretName, "000");
         } else {
            context.error(`purgeDeleteSecret Func ${err}. ${funcNote}`);
            return false;
         }
      }
      retryCounter++;
   } while (retryCounter <= 1);

   context.error(`purgeDeleteSecret Func - ERROR after 1 time retry!`);
   return false;
};

export { createSecret, getSecret, purgeDeleteSecret };

import restAPIPattern from "../common/restAPIPattern.js";
import LOGGER from "../../../config/winstonConfig.js";

export default async function fetchContact(contactListId, contactIds) {
   const funcName = "[fetchContact Func]";
   const funcArgus = `[ContactList Id = ${contactListId}; Contact Ids = ${JSON.stringify(contactIds)}]`;

   const url = `/api/v2/outbound/contactlists/${contactListId}/contacts/bulk`;

   try {
      const data = await restAPIPattern("POST", url, null, contactIds);
      if (data === false) {
         LOGGER.error(`${funcName} - Getting API response ERROR! ${funcArgus}`);
         return false;
      }

      return data;
   } catch (err) {
      LOGGER.error(`${funcName} Catching ERROR - ${err}\n${funcArgus}`);
      return false;
   }
}

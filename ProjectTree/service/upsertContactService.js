import contactEntity from "../entity/contactEntity.js";

export default async function upsertContactService(data) {
   if (data.length === 0) return;

   const funcName = "[upsertContactService Func]";
   const funcArgus = `[Data = ${JSON.stringify(data, null, 3)}]`;

   try {
      await Promise.all(
         data.map((record) =>
            contactEntity.upsert(record, {
               updateOnDuplicate: [
                  "attribute_value",
                  "call_records_CTN_last_attempt",
                  "call_records_CTN_last_result",
                  "callable",
                  "phone_number_status_CTN_callable",
                  "contactable_status_Email_contactable",
                  "stage_time"
               ]
            })
         )
      );
   } catch (err) {
      throw new Error(`${funcName} Catching ERROR - ${err}\n${funcArgus}`);
   }
}

// const mappedData = contactMapper([
//    {
//       id: "4163897911",
//       contactListId: "1a9bf397-bf4d-4424-9f5c-7960ea75ce4b",
//       data: {
//          CALL_ATTEMPTS: "1",
//          ECID: "451568892",
//          CTN: "4163897911",
//          BAN: "249258328",
//          RSID: "249258328",
//          LOB: "0",
//          FIRST_NAME: "YOSEF",
//          LAST_NAME: "MOGHAREH-DEHKORDY",
//          LANGUAGE_CODE: "E",
//          POSTAL_CODE: "L4L9L2",
//          PROVINCE: "On",
//          CITY: "WOODBRIDGE",
//          COUNTRY: "America/Toronto",
//          CURRENT_MSF: "",
//          "6_MO_AVG_DATA_USAGE": "",
//          TAGGED_PLAN: "",
//          PAYER_TYPE: "",
//          TAGGED_PLAN_MSF: "",
//          BAN_MSF_INCREASE: "",
//          ACCOUNT_TYPE: "",
//          LINE_MSF_INCREASE: "",
//          CURRENT_PLAN: "",
//          DEVICE: "",
//          CAMPAIGN_CODE: "CAMP11695",
//          CAMPAIGN_START_DATE: "45306",
//          CAMPAIGN_NAME: "2021.1442_Rogers_Winback_Cable_INT_6M_TM",
//          CELL_CD: "WB_IGN_BBO_6M",
//          COMMUNICATION_CD: "COMM565128",
//          RESPTRACKING_CD: "26950480201",
//          LIST_ID: "269004",
//          COHORT: "M1S_RES_CAMP11695_269004_TM_20240115",
//          OPT1: "0",
//          OPT2: "0",
//          OPT3: "0",
//          OPT4: "",
//          OPT5: "",
//          OPT6: "",
//          OPT7: "",
//          OPT8: "",
//          OPT9: "",
//          TREATMENT_CD: "0",
//          FTTH: "",
//          FTTN: "",
//          NEW: "",
//          MA_CONTACT_ID: "MA_3381734529",
//          LEAD_ID: "PostDisconnect_20240115_30521",
//          LEAD_ORDER: "30521",
//          FIRST_NAMELAST_NAMEBAN: "YOSEFMOGHAREH-DEHKORDY249258328"
//       },
//       callRecords: {
//          CTN: {
//             lastAttempt: "2024-01-17T21:08:05.720Z",
//             lastResult: "82d33f6a-793e-4296-a644-79d379bd6804"
//          }
//       },
//       callable: false,
//       phoneNumberStatus: {
//          CTN: {
//             callable: false
//          }
//       },
//       contactableStatus: {
//          Email: {
//             contactable: true
//          }
//       },
//       dateCreated: "2024-01-16T23:09:48.952Z",
//       selfUri: "/api/v2/outbound/contactlists/1a9bf397-bf4d-4424-9f5c-7960ea75ce4b/contacts/4163897911"
//    }
// ]);
// const createContactServiceResult = await upsertContactService(mappedData);
// console.log("createContactServiceResult: ", createContactServiceResult);

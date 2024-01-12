import Moment from "moment";
import LOGGER from "../config/winstonConfig.js";

export default function notiFlowAggrMapper(payload) {
   const funcName = "[notiFlowAggrMapper Func]";
   const funcArgus = `[payload = ${JSON.stringify(payload, null, 3)}]`;

   try {
      if (!payload || payload.length === 0 || JSON.stringify(payload) === "{}") {
         LOGGER.error(`${funcName} - Unexpected EMPTY Payload ERROR!`);
         return false;
      }

      const flattedData = !!payload["results"] ? payload["results"] : [payload];

      let firstLevelData = [];
      flattedData.forEach((payloadLevelData) => {
         payloadLevelData["data"].forEach((entity) => {
            let obj = {};
            obj.stage_time = Moment().format("YYYY-MM-DD HH:mm:ss Z");
            obj.id = payloadLevelData["group"]
               ? payloadLevelData["group"]["flowId"]
                  ? payloadLevelData["group"]["flowId"]
                  : null
               : null;
            obj.media_type = payloadLevelData["group"]
               ? payloadLevelData["group"]["mediaType"]
                  ? payloadLevelData["group"]["mediaType"]
                  : null
               : null;
            const interval = entity["interval"] ? entity["interval"].split("/") : [];
            obj.start_time = interval[0] ? interval[0] : null;
            obj.end_time = interval[1] ? interval[1] : null;
            obj.carryForwardMetrics = entity["metrics"];

            firstLevelData.push(obj);
         });
      });

      let result = [];
      firstLevelData.forEach((metricsData) => {
         metricsData["carryForwardMetrics"].forEach((entity) => {
            const metricKey = Object.keys(entity["stats"]);
            metricKey.forEach((metricStat) => {
               const obj = {
                  stage_time: metricsData["stage_time"],
                  id: metricsData["id"],
                  media_type: metricsData["media_type"],
                  start_time: metricsData["start_time"],
                  end_time: metricsData["end_time"],
                  metric_key: entity["metric"] + metricStat[0].toUpperCase() + metricStat.substring(1),
                  metric_value: entity["stats"][metricStat],
               };

               result.push(obj);
            });
         });
      });

      return result;
   } catch (err) {
      LOGGER.error(`${funcName} Catching ERROR - ${err}\n${funcArgus}`);
      return false;
   }
}

// const result = notiFlowAggrMapper({
//    group: {
//       mediaType: "voice",
//       flowId: "42f2be2c-99d2-43b7-9ffd-da7eb4e4a7a2",
//    },
//    data: [
//       {
//          interval: "2024-01-11T16:30:00.000Z/2024-01-11T17:00:00.000Z",
//          metrics: [
//             {
//                metric: "tFlowDisconnect",
//                stats: {
//                   count: 1,
//                   sum: 19386,
//                   min: 19386,
//                   max: 19386,
//                },
//             },
//             {
//                metric: "nFlow",
//                stats: {
//                   count: 51,
//                },
//             },
//             {
//                metric: "tFlow",
//                stats: {
//                   count: 53,
//                   sum: 1241679,
//                   min: 553,
//                   max: 71727,
//                },
//             },
//             {
//                metric: "tFlowExit",
//                stats: {
//                   count: 52,
//                   sum: 1222293,
//                   min: 553,
//                   max: 71727,
//                },
//             },
//          ],
//       },
//    ],
// });
//
// console.log("extractResult: ", result);

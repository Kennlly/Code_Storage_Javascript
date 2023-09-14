import { Sequelize } from "sequelize";
import sequelize from "./databaseConnection.js";
import { DataTypes } from "sequelize";
import moment from "moment";
import { modelLogger } from "../../ProjectTree/utils/loggerConfig.js";

const Skill = sequelize.define(
   "skill",
   {
      StageTime: {
         type: DataTypes.DATE,
         allowNull: true,
         // validate: {
         //    isValidDate(value) {
         //       if (value !== null && value !== undefined && !isValidDate(value)) {
         //          throw new Error("Invalid date of birth.");
         //       }
         //    },
         // },
         // get() {
         //    const dateOfBirth = this.getDataValue("dateOfBirth");
         //    if (dateOfBirth) {
         //       return moment(dateOfBirth).toISOString();
         //    }
         //    return null;
         // },
         set(value) {
            let parsedDate = null;
            if (value) {
               // parsedDate = moment(value, moment.ISO_8601);
               // if (!parsedDate.isValid()) {
               //    console.error("Validation error for field dateOfBirth:", value);
               //    this.setDataValue("dateOfBirth", null);
               // }
               return validateDate(value, "StageTime");
            }
            this.setDataValue("dateOfBirth", parsedDate);
         },
      },
      SkillId: {
         type: DataTypes.STRING,
         allowNull: false,
         validate: {
            // isValidId(value) {
            //    const isId = this.isValidId(value);
            //    console.error("WorkingValidateUUID", isId);
            // },
            //
            // isUUID: {
            //    msg: "Please input UUID",
            // },
         },
         get() {
            const skillId = this.getDataValue("SkillId");
            if (skillId) {
               return skillId;
            }
            return null;
         },
      },
      SkillName: {
         type: DataTypes.STRING,
         allowNull: true,
         validate: {},
      },
      DateModified: {
         type: DataTypes.DATE(3),
         allowNull: true,
         validate: {
            isValidDate(value) {
               if (value !== null && value !== undefined && !isValidDate(value)) {
                  throw new Error("Invalid date of birth.");
               }
            },
         },
         get() {
            const DateModified = this.getDataValue(DateModified);
            if (DateModified) {
               return moment(DateModified).toISOString();
            }
            return null;
         },
         set(value) {
            let parsedDate = null;
            if (value) {
               parsedDate = moment(value, moment.ISO_8601);
               if (!parsedDate.isValid()) {
                  console.error("Validation error for field DateModified:", value);
                  this.setDataValue("DateModified", null);
               }
            }
            this.setDataValue("DateModified", parsedDate);
         },
      },
      State: {
         type: DataTypes.STRING,
         allowNull: true,
         validate: {
            isValidString(value) {
               if (value !== null && typeof value !== "string") {
                  throw new Error("Invalid State.");
               }
            },
            sanitizeAndValidate(value) {
               if (value !== null && value !== undefined) {
                  const sanitizedValue = sanitizeAndSubstring(value);
                  if (!sanitizedValue) {
                     console.error("Validation error for field State:", value);
                     this.setDataValue("State", null); // Set field value to null
                  } else {
                     this.setDataValue("State", sanitizedValue);
                  }
               }
            },
         },
      },
      Version: {
         type: DataTypes.INTEGER,
         allowNull: true,
         validate: {
            isValidNumber(value) {
               if (value !== null && value !== undefined && isNaN(value)) {
                  throw new Error("Invalid Version value.");
               }
            },
         },
      },
   },
   {
      tableName: "Gen_Skill",
      timestamps: false,
   }
);
Skill.removeAttribute("id");

const isValidStr = (fieldName, value, expectLength) => {
   if (value === null || value === undefined || value.length === 0) {
      return this.setDataValue(fieldName, null);
   }

   const refactoredStr = value.replace(/'/g, "''").replace(/\n/g, " ");
   if (refactoredStr.length <= expectLength) return this.setDataValue(fieldName, refactoredStr);

   console.error("isValidStr Function Working!");
   return this.setDataValue(fieldName, refactoredStr.substring(0, expectLength));
};

// Helper function to sanitize a string and substring if longer than 255 characters
function sanitizeAndSubstring(value) {
   const sanitizedValue = value.replace(/'/g, "''").replace(/\n/g, " ");
   if (sanitizedValue.length > 255) {
      console.error("Validation error for field name:", value);
      return null;
   }
   return sanitizedValue;
}

// Helper function to check if the date is valid
// function isValidDate(value) {
//    return moment(value, "MM/DD/YYYY", true).isValid();
// }

const validateDate = (value, fieldName) => {
   console.log("ValidateDate Func Triggered");
   const funcNote = `SourceData = ${value}; FieldName = ${fieldName}.`;
   try {
      if (!value || value.length === 0) return null;

      // Cannot use "strict" mode because Genesys has different datetime format with different payload
      const parseMomentDateStr = moment.utc(value, "YYYY-MM-DDTHH:mm:ss.SSS[Z]");
      const isValidDateStr = parseMomentDateStr.isValid();
      if (isValidDateStr) return parseMomentDateStr.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");

      console.error(`validateDate Func - Error data: NOT a Datetime! ${funcNote}`);
      return null;
   } catch (err) {
      console.error(`validateDate Func ${err}. ${funcNote}`);
      return null;
   }
};

const result1 = await sequelize.sync();
// console.log("result1", result1);
try {
   const result2 = await Skill.create({
      StageTime: "2023-20-21 00:01:02",
      SkillId: "2121212121212",
      SkillName: "Yeah",
      DateModified: null,
      State: "Handsome",
      Version: 100,
   });
   console.log("result2", result2);
} catch (err) {
   console.error(`Func ${err}.`);
   // return false;
}

// sequelize.sync().then((result) => {
//    return Skill.create({
//       StageTime: "2023-20-21 00:01:02",
//       SkillId: "2121212121212",
//       SkillName: "Yeah",
//       DateModified: null,
//       State: "Handsome",
//       Version: 100,
//    }).then((skill) => {
//       console.log("First Skill Created!");
//    });

// console.log("WhatsNewSkill", newSkill);
// });

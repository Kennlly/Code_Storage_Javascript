const isRequiredParam = (columnName) => {
   throw new Error(`Param is required for ${columnName}`);
};

const validateDate = (
   sourceData,
   columnName = isRequiredParam("columnName"),
   primaryKeyNote = isRequiredParam("primaryKeyNote")
) => {};

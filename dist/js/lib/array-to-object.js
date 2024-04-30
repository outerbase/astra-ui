const arrayToObject = (arr, keyField, valueField) => arr.reduce((obj, item) => ({ ...obj, [item[keyField]]: item[valueField] }), {});
export default arrayToObject;

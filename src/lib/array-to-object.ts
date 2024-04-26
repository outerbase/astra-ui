const arrayToObject = <T extends Record<string, any>>(arr: T[], keyField: keyof T, valueField: keyof T): Record<string, T[keyof T]> =>
    arr.reduce((obj, item) => ({ ...obj, [item[keyField]]: item[valueField] }), {} as Record<string, T[keyof T]>)
export default arrayToObject

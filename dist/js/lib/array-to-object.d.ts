declare const arrayToObject: <T extends Record<string, any>>(arr: T[], keyField: keyof T, valueField: keyof T) => Record<string, T[keyof T]>;
export default arrayToObject;
//# sourceMappingURL=array-to-object.d.ts.map
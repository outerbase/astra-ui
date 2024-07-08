// This helper allows you to compare the following objects for equality without erroneously reporting them as different
// { } vs { foo: undefined }
// both of these evaluate to { } since they have no defined keys

type AnyObject = Record<string, any>
export function normalizeKeys<T extends AnyObject, U extends AnyObject>(obj1: T, obj2: U): [T, U] {
  const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)])
  allKeys.forEach((key) => {
    if (!(key in obj1)) (obj1 as AnyObject)[key] = undefined
    if (!(key in obj2)) (obj2 as AnyObject)[key] = undefined
  })
  return [obj1, obj2]
}

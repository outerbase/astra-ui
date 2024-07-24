// returns an object containing the k/v pairs in `values` that different from `originalValues`
export function diffObjects(values: Record<string, any>, originalValues: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {}

  for (const key in values) {
    if (values[key] !== originalValues[key]) {
      result[key] = values[key]
    }
  }

  return result
}

export default function stringifyWithoutNewLines(obj: any, spaceCount = 1): string {
  // Convert the object to JSON string with specified spaces
  const jsonString = JSON.stringify(obj, null, spaceCount)

  // Create a string with the specified number of spaces or a single space if spaceCount is greater than 0
  const spaces = spaceCount > 0 ? ' '.repeat(spaceCount) : ''

  // Replace all new lines and the spaces that follow them with the desired spaces
  return jsonString.replace(/\n\s*/g, spaces)
}

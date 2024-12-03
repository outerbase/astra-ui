type DateFormat =
  | 'yyyy-MM-dd'
  | 'MM/dd/yyyy'
  | 'dd-MM-yyyy'
  | 'd MMM yyyy'
  | 'MMMM d, yyyy'
  | 'yyyyMMdd'
  | 'yy-MM-dd'
  | 'd-MMM-yy'
  | 'EEE, dd MMM yyyy'
  | 'yyyy.MM.dd'
  | 'EEE MMM dd yyyy HH:mm:ss GMT'
  | 'yyyy-MM-ddTHH:mm:ssZ'
  | 'M/d/yy'
  | 'yyyy-Www-d'
  | 'yy.MM.dd'
  | 'yyyy-DDD'
  | 'yyyy-MMM-dd G'
  | 'EEE, d MMM yyyy HH:mm:ss Z'
  | 'dd/MM/yyyy hh:mm a'
  | 'yyyy.DDDTHH:mm:ss'
  | 'd MMM yy'
  | 'MMMM do, yyyy'
  | 'yyyy/MM/dd HH:mm'
  | 'yyyyDDD'
  | 'd-MMM-yyyy'
  | 'EEEE, dd MMMM yyyy hh:mm:ss a'
  | 'dd.MM.yy'
  | 'yyyy-MMM-dd'
  | 'EEE MMM dd yyyy HH:mm:ss'
  | 'yyyy/MM/dd'

interface DatePattern {
  pattern: RegExp
  format: DateFormat
}

export function formatDate(value: string): string {
  if (value.trim() === '') {
    return value
  }

  const datePatterns: DatePattern[] = [
    { pattern: /^(\d{4})-(\d{2})-(\d{2})$/, format: 'yyyy-MM-dd' },
    { pattern: /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, format: 'MM/dd/yyyy' },
    { pattern: /^(\d{1,2})-(\d{2})-(\d{4})$/, format: 'dd-MM-yyyy' },
    { pattern: /^(\d{1,2})\s+(\w{3})\s+(\d{4})$/, format: 'd MMM yyyy' },
    { pattern: /^(\w+)\s+(\d{1,2}),\s+(\d{4})$/, format: 'MMMM d, yyyy' },
    { pattern: /^(\d{2})-(\d{2})-(\d{2})$/, format: 'yy-MM-dd' },
    { pattern: /^(\d{1,2})-(\w{3})-(\d{2})$/, format: 'd-MMM-yy' },
    { pattern: /^(\w{3}),\s+(\d{1,2})\s+(\w{3})\s+(\d{4})$/, format: 'EEE, dd MMM yyyy' },
    { pattern: /^(\d{4})\.(\d{2})\.(\d{2})$/, format: 'yyyy.MM.dd' },
    {
      pattern: /^(\w{3})\s+(\w{3})\s+(\d{2})\s+(\d{4})\s+(\d{2}):(\d{2}):(\d{2})\s+GMT([-+]\d{4})\s*\(.+\)$/,
      format: 'EEE MMM dd yyyy HH:mm:ss GMT',
    },
    { pattern: /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})([-+]\d{2}:\d{2})$/, format: 'yyyy-MM-ddTHH:mm:ssZ' },
    { pattern: /^(\d{1,2})\/(\d{1,2})\/(\d{2})$/, format: 'M/d/yy' },
    { pattern: /^(\w+),\s+(\d{1,2})\s+(\w+)\s+(\d{4})\s+(\d{2}):(\d{2}):(\d{2})\s+([APap][Mm])$/, format: 'EEEE, dd MMMM yyyy hh:mm:ss a' },
    { pattern: /^(\d{2})\.(\d{2})\.(\d{2})$/, format: 'yy.MM.dd' },
    { pattern: /^(\d{4})-(\w{3})-(\d{2})\s+AD$/, format: 'yyyy-MMM-dd G' },
    { pattern: /^(\w{3}),\s+(\d{1,2})\s+(\w{3})\s+(\d{4})\s+(\d{2}):(\d{2}):(\d{2})\s+([-+]\d{4})$/, format: 'EEE, d MMM yyyy HH:mm:ss Z' },
    { pattern: /^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})\s+([APap][Mm]?)$/, format: 'dd/MM/yyyy hh:mm a' },
    { pattern: /^(\d{4})\.(\d{3})T(\d{2}):(\d{2}):(\d{2})$/, format: 'yyyy.DDDTHH:mm:ss' },
    { pattern: /^(\d{1,2})\s+(\w{3})\s+(\d{2})$/, format: 'd MMM yy' },
    { pattern: /^(\w+)\s+(\d{1,2})(?:st|nd|rd|th)?,\s+(\d{4})$/, format: 'MMMM do, yyyy' },
    { pattern: /^(\d{4})\/(\d{2})\/(\d{2})\s+(\d{2}):(\d{2})$/, format: 'yyyy/MM/dd HH:mm' },
    { pattern: /^(\d{1,2})-(\w{3})-(\d{4})$/, format: 'd-MMM-yyyy' },
    { pattern: /^(\w+)\s+(\d{1,2}),\s+(\d{4})$/, format: 'MMMM d, yyyy' },
    {
      pattern: /^(\w+),\s+(\d{1,2})\s+(\w+)\s+(\d{4})\s+(\d{1,2}):(\d{2}):(\d{2})\s+([APap][Mm])$/,
      format: 'EEEE, dd MMMM yyyy hh:mm:ss a',
    },
    { pattern: /^(\w+)\s+(\d{1,2})(?:st|nd|rd|th),\s+(\d{4})$/, format: 'MMMM do, yyyy' },
  ]

  function parseDateComponents(dateString: string, pattern: RegExp): { year?: number; month?: number; day?: number } | null {
    const match = dateString.match(pattern)
    if (!match) return null

    let year: number | undefined
    let month: number | undefined
    let day: number | undefined

    const setMonthIndex = (monthString?: string): number | undefined => {
      if (!monthString) return undefined
      const monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const index = monthNamesShort.findIndex((name) => name.toLowerCase().startsWith(monthString.toLowerCase()))
      return index !== -1 ? index + 1 : undefined
    }

    switch (pattern.toString()) {
      case datePatterns[0].pattern.toString():
        year = parseInt(match[1], 10)
        month = parseInt(match[2], 10)
        day = parseInt(match[3], 10)
        break
      case datePatterns[1].pattern.toString():
        month = parseInt(match[1], 10)
        day = parseInt(match[2], 10)
        year = parseInt(match[3], 10)
        break
      case datePatterns[2].pattern.toString():
        day = parseInt(match[1], 10)
        month = parseInt(match[2], 10)
        year = parseInt(match[3], 10)
        break
      case datePatterns[3].pattern.toString():
        day = parseInt(match[1], 10)
        month = setMonthIndex(match[2])
        year = parseInt(match[3], 10)
        break
      case datePatterns[4].pattern.toString():
        month = setMonthIndex(match[1])
        day = parseInt(match[2], 10)
        year = parseInt(match[3], 10)
        break
      case datePatterns[5].pattern.toString():
        year = 2000 + parseInt(match[1], 10)
        month = parseInt(match[2], 10)
        day = parseInt(match[3], 10)
        break
      case datePatterns[6].pattern.toString():
        day = parseInt(match[1], 10)
        month = setMonthIndex(match[2])
        year = 2000 + parseInt(match[3], 10)
        break
      case datePatterns[7].pattern.toString():
        day = parseInt(match[2], 10)
        month = setMonthIndex(match[3])
        year = parseInt(match[4], 10)
        break
      case datePatterns[8].pattern.toString():
        year = parseInt(match[1], 10)
        month = parseInt(match[2], 10)
        day = parseInt(match[3], 10)
        break
      case datePatterns[9].pattern.toString():
        day = parseInt(match[3], 10)
        month = setMonthIndex(match[2])
        year = parseInt(match[4], 10)
        break
      case datePatterns[10].pattern.toString():
        year = parseInt(match[1], 10)
        month = parseInt(match[2], 10)
        day = parseInt(match[3], 10)
        break
      case datePatterns[11].pattern.toString():
        month = parseInt(match[1], 10)
        day = parseInt(match[2], 10)
        year = 2000 + parseInt(match[3], 10)
        break
      case datePatterns[12].pattern.toString():
        day = parseInt(match[2], 10)
        month = setMonthIndex(match[3])
        year = parseInt(match[4], 10)
        break
      case datePatterns[13].pattern.toString():
        day = parseInt(match[1], 10)
        month = parseInt(match[2], 10)
        year = 2000 + parseInt(match[3], 10)
        break
      case datePatterns[14].pattern.toString():
        year = parseInt(match[1], 10)
        month = setMonthIndex(match[2])
        day = parseInt(match[3], 10)
        break
      case datePatterns[15].pattern.toString():
        day = parseInt(match[2], 10)
        month = setMonthIndex(match[3])
        year = parseInt(match[4], 10)
        break
      case datePatterns[16].pattern.toString():
        day = parseInt(match[1], 10)
        month = parseInt(match[2], 10)
        year = parseInt(match[3], 10)
        break
      case datePatterns[17].pattern.toString():
        year = parseInt(match[1], 10)
        const dayOfYear = parseInt(match[2], 10)
        const parsedDate = new Date(year, 0) // Start at the beginning of the year
        parsedDate.setUTCDate(dayOfYear)
        day = parsedDate.getUTCDate()
        month = parsedDate.getUTCMonth() + 1
        break
      case datePatterns[18].pattern.toString():
        day = parseInt(match[1], 10)
        month = setMonthIndex(match[2])
        year = 2000 + parseInt(match[3], 10)
        break
      case datePatterns[19].pattern.toString():
        month = setMonthIndex(match[1])
        day = parseInt(match[2], 10)
        year = parseInt(match[3], 10)
        break
      case datePatterns[20].pattern.toString():
        year = parseInt(match[1], 10)
        month = parseInt(match[2], 10)
        day = parseInt(match[3], 10)
        break
      case datePatterns[21].pattern.toString():
        day = parseInt(match[1], 10)
        month = setMonthIndex(match[2])
        year = parseInt(match[3], 10)
        break
      case datePatterns[22].pattern.toString():
        month = setMonthIndex(match[1])
        day = parseInt(match[2], 10)
        year = parseInt(match[3], 10)
        break
      case datePatterns[23].pattern.toString():
        day = parseInt(match[2], 10)
        month = setMonthIndex(match[3])
        year = parseInt(match[4], 10)
        break
      case datePatterns[24].pattern.toString():
        month = setMonthIndex(match[1])
        day = parseInt(match[2], 10)
        year = parseInt(match[3], 10)
        break
      default:
        return null
    }

    return { year, month, day }
  }

  function formatDateComponents({ year, month, day }: { year?: number; month?: number; day?: number }): string {
    const yearPart = year !== undefined ? `${year}` : ''
    const monthPart = month !== undefined ? `${String(month).padStart(2, '0')}` : ''
    const dayPart = day !== undefined ? `${String(day).padStart(2, '0')}` : ''

    return [monthPart, dayPart, yearPart].filter((part) => part).join('/')
  }

  for (const { pattern } of datePatterns) {
    const dateComponents = parseDateComponents(value, pattern)
    if (dateComponents) {
      return formatDateComponents(dateComponents)
    }
  }

  return value
}

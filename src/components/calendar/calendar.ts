import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { state } from 'lit/decorators/state.js'

enum DateRangeCellMode {
  OUT_OF_RANGE,
  ENABLED,
  SELECTED_START_NODE,
  SELECTED_END_NODE,
  SELECTED,
  SELECTED_OUT_OF_RANGE,
}

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

@customElement('astra-calendar')
export default class AstraCalendar extends LitElement {
  @property({ type: Boolean, attribute: 'single-month-view' }) singleMonthView = false

  @state() startDate: Date | null = null
  @state() endDate: Date | null = null
  @state() viewingMonth: Date = new Date()
  @state() hoveringDate: Date | null = null

  static styles = css`
    .top-section {
      display: flex;
      flex-direction: row;
      gap: 0.625rem; /* gap-2.5 */
    }

    .date-range-picker {
      font-family: 'Inter', sans-serif;
      font-size: 12px;
      display: inline-block;
      flex-direction: column;
      gap: 0.625rem; /* gap-2.5 */
      border-radius: 0.75rem; /* rounded-xl */
      background-color: #f5f5f5; /* bg-neutral-100 */
      padding: 1rem; /* p-4 */
      color: #1a1a1a; /* dark:bg-neutral-900 */
      user-select: none; /* select-none */
      max-width: 400px;
    }

    .month-header > button {
      cursor: pointer;
      border-radius: 0.25rem; /* rounded */
      background-color: rgba(209, 213, 219, 0.85); /* bg-neutral-300/85 */
      padding: 0.375rem; /* p-1.5 */
      transition: background-color 0.2s;
      width: 28px;
      height: 28px;
    }

    .month-header > button:hover {
      background-color: #d1d5db; /* hover:bg-neutral-300 */
    }

    @media (prefers-color-scheme: dark) {
      .month-header > button {
        background-color: rgba(55, 65, 81, 0.85); /* dark:bg-neutral-700/85 */
      }

      .month-header > button:hover {
        background-color: #374151; /* hover:dark:bg-neutral-700 */
      }
    }

    .month-container {
      display: flex;
      flex-direction: column;
      gap: 1rem; /* gap-4 */
      position: relative; /* relative */
      width: 194px; /* w-[196px] */
    }

    .month-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .month-header button {
      cursor: pointer; /* cursor-pointer */
      border-radius: 0.25rem; /* rounded */
      background-color: rgba(209, 213, 219, 0.85); /* bg-neutral-300/85 */
      padding: 0.375rem; /* p-1.5 */
      transition: background-color 0.2s;
      border: none;
    }

    .month-header button:hover {
      background-color: #d1d5db; /* hover:bg-neutral-300 */
    }

    .month-header div[contenteditable] {
      padding: 0.375rem; /* py-1.5 */
      text-align: center; /* text-center */
      font-size: 12px; /* text-sm */
      font-weight: 600; /* font-semibold */
      border-radius: 0.375rem; /* rounded-md */
      color: #111827; /* text-neutral-900 */
      transition: background-color 0.2s;
    }

    .month-header div[contenteditable]:hover {
      background-color: rgba(209, 213, 219, 0.1); /* hover:dark:bg-neutral-300/10 */
    }

    .days-of-week {
      display: grid;
      grid-template-columns: repeat(7, minmax(0, 1fr)); /* grid-cols-7 */
      gap: 0.25rem; /* gap-1 */
    }

    .days-of-week div {
      text-align: center; /* text-center */
      font-size: 12px; /* text-sm */
      color: #6b7280; /* text-neutral-500 */
    }

    .days {
      display: grid;
      grid-template-columns: repeat(7, minmax(0, 1fr)); /* grid-cols-7 */
      gap: 0.125rem; /* gap-y-0.5 */
    }

    .day-cell {
      height: 26px; /* h-[26px] */
      width: 1.75rem; /* w-7 */
      text-align: center; /* text-center */
      font-size: 12px; /* text-sm */
      line-height: 26px; /* leading-[26px] */
      cursor: pointer; /* cursor-pointer */
      transition:
        background-color 0.05s,
        color 0.05s; /* transition-all duration-[50] */
    }

    .day-cell.out-of-range {
      background-color: transparent; /* bg-transparent */
      color: #d1d5db; /* !text-neutral-300 */
    }

    .day-cell.enabled:hover {
      background-color: #d1d5db; /* hover:bg-neutral-300 */
      color: #111827; /* text-neutral-900 */
    }

    .day-cell.selected-start-node {
      background-color: #0a0a0a; /* !bg-neutral-950 */
      border-top-left-radius: 5px; /* rounded-tl-[5px] */
      border-bottom-left-radius: 5px; /* rounded-bl-[5px] */
      color: #e5e7eb; /* !text-neutral-200 */
    }

    .day-cell.selected-end-node {
      background-color: #0a0a0a; /* !bg-neutral-950 */
      border-top-right-radius: 5px; /* rounded-tr-[5px] */
      border-bottom-right-radius: 5px; /* rounded-br-[5px] */
      color: #e5e7eb; /* !text-neutral-200 */
    }

    .day-cell.selected {
      background-color: #d1d5db; /* bg-neutral-300 */
      color: #111827; /* text-neutral-900 */
    }

    .day-cell.selected-out-of-range {
      background-color: #e5e7eb; /* bg-neutral-200 */
      color: #d1d5db; /* !text-neutral-300 */
    }

    .footer {
      display: flex;
      align-items: center;
      gap: 0.5rem; /* gap-2 */
      font-size: 12px; /* text-sm */
      color: #374151; /* text-neutral-700 */
    }

    .footer span {
      flex: 1; /* flex-1 */
    }

    .footer button {
      cursor: pointer; /* cursor-pointer */
      font-weight: 600; /* font-semibold */
      text-decoration: underline; /* underline */
      text-underline-offset: 2px; /* underline-offset-2 */
      color: #111827; /* text-neutral-800 */
      transition: color 0.2s;
      background: transparent;
      border: none;
    }

    .footer button:hover {
      color: #1f2937; /* dark:text-neutral-200 */
    }
  `

  private getMonthName(date: Date, monthOffset = 0): string {
    const copyDate = new Date(date)
    copyDate.setMonth(copyDate.getMonth() + monthOffset)
    return copyDate.toLocaleString('default', { month: 'long' })
  }

  private getDateYear(date: Date, monthOffset = 0): number {
    const copyDate = new Date(date)
    copyDate.setMonth(copyDate.getMonth() + monthOffset)
    return copyDate.getFullYear()
  }

  private getMonthsStartingDay(date: Date, monthOffset = 0): number {
    const copyDate = new Date(date)
    copyDate.setDate(1)
    copyDate.setMonth(copyDate.getMonth() + monthOffset)
    return copyDate.getDay()
  }

  private getNumberOfDaysInMonth(date: Date, monthOffset = 0): number {
    const copyDate = new Date(date)
    copyDate.setDate(1)
    copyDate.setMonth(copyDate.getMonth() + monthOffset + 1)
    copyDate.setDate(0)
    return copyDate.getDate()
  }

  private adjustMonth(monthOffset: number) {
    this.viewingMonth = new Date(this.viewingMonth.setMonth(this.viewingMonth.getMonth() + monthOffset))
  }

  private getDateFromIndex(date: Date, monthOffset: number, index: number): Date {
    const startingDay = this.getMonthsStartingDay(date, monthOffset)

    if (index < startingDay) {
      const previousMonth = new Date(date)
      previousMonth.setMonth(previousMonth.getMonth() + monthOffset)
      previousMonth.setDate(1)
      previousMonth.setDate(previousMonth.getDate() - (startingDay - index))
      return previousMonth
    } else if (index > this.getNumberOfDaysInMonth(date, monthOffset) + startingDay - 1) {
      const nextMonth = new Date(date)
      nextMonth.setMonth(nextMonth.getMonth() + monthOffset + 1)
      nextMonth.setDate(index - this.getNumberOfDaysInMonth(date, monthOffset) - startingDay + 1)
      return nextMonth
    } else {
      const newDate = new Date(date)
      newDate.setMonth(newDate.getMonth() + monthOffset)
      newDate.setDate(index - startingDay + 1)
      return newDate
    }
  }

  private isDateEqual(date1: Date | null, date2: Date | null): boolean {
    if (!date1 || !date2) return false
    return date1.toDateString() === date2.toDateString()
  }

  private handleDateClick(date: Date) {
    if (this.singleMonthView) {
      this.startDate = date
      this.endDate = null

      this.dispatchEvent(
        new CustomEvent('date-selected', {
          detail: { date },
          bubbles: true,
          composed: true,
        })
      )
    } else {
      if (!this.startDate || date < this.startDate) {
        this.startDate = date
        this.hoveringDate = date
      } else {
        this.endDate = date
      }

      this.dispatchEvent(
        new CustomEvent('date-selected', {
          detail: { startDate: this.startDate, endDate: this.endDate },
          bubbles: true,
          composed: true,
        })
      )
    }
  }

  private handleDateHover(date: Date) {
    if (this.startDate && !this.endDate && date > this.startDate) {
      this.hoveringDate = date
    }
  }

  private resetDates() {
    this.startDate = null
    this.endDate = null
  }

  public override render() {
    return html`
      <div class="date-range-picker" style="">
        <div class="top-section">
          <div class="month-container">
            <div class="month-header">
              <button @click=${() => this.adjustMonth(-1)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                  <rect width="256" height="256" fill="none" />
                  <polyline
                    points="160 208 80 128 160 48"
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="16"
                  />
                </svg>
              </button>

              <div contenteditable @blur=${(e: Event) => this.setViewingMonth((e.target as HTMLDivElement).textContent || '')}>
                ${this.getMonthName(this.viewingMonth)} ${this.getDateYear(this.viewingMonth)}
              </div>

              ${!this.singleMonthView
                ? html`<div style="width: 28px;"></div>`
                : html`<button @click=${() => this.adjustMonth(1)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                      <rect width="256" height="256" fill="none" />
                      <polyline
                        points="96 48 176 128 96 208"
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="16"
                      />
                    </svg>
                  </button>`}
            </div>
            <div class="days-of-week">${DAYS_OF_WEEK.map((day) => html`<div>${day}</div>`)}</div>
            <div class="days">
              ${Array.from({ length: 42 }).map((_, index) => {
                const date = this.getDateFromIndex(this.viewingMonth, 0, index)
                const mode = this.getDateMode(date, index)
                return html`
                  <div class="day-cell ${mode}" @click=${() => this.handleDateClick(date)} @mouseover=${() => this.handleDateHover(date)}>
                    ${date.getDate()}
                  </div>
                `
              })}
            </div>
          </div>
          ${!this.singleMonthView
            ? html`
                <div class="month-container">
                  <div class="month-header">
                    <div style="width: 28px;"></div>
                    <div contenteditable @blur=${(e: Event) => this.setViewingMonth((e.target as HTMLDivElement).textContent || '', -1)}>
                      ${this.getMonthName(this.viewingMonth, 1)} ${this.getDateYear(this.viewingMonth, 1)}
                    </div>
                    <button @click=${() => this.adjustMonth(1)}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                        <rect width="256" height="256" fill="none" />
                        <polyline
                          points="96 48 176 128 96 208"
                          fill="none"
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="16"
                        />
                      </svg>
                    </button>
                  </div>
                  <div class="days-of-week">${DAYS_OF_WEEK.map((day) => html`<div>${day}</div>`)}</div>
                  <div class="days">
                    ${Array.from({ length: 42 }).map((_, index) => {
                      const date = this.getDateFromIndex(this.viewingMonth, 1, index)
                      const mode = this.getDateMode(date, index, 1)
                      return html`
                        <div
                          class="day-cell ${mode}"
                          @click=${() => this.handleDateClick(date)}
                          @mouseover=${() => this.handleDateHover(date)}
                        >
                          ${date.getDate()}
                        </div>
                      `
                    })}
                  </div>
                </div>
              `
            : ''}
        </div>

        ${!this.singleMonthView
          ? html`
        <div class="footer">
          <div style="flex: 1; display: flex; gap: 4px; align-items: center;"></div>
          <button class="reset-dates" @click=${this.resetDates}>Reset Dates</button>
        </div>
      </div>
      `
          : ''}
      </div>
    `
  }

  private getDateMode(date: Date, index: number, monthOffset = 0): string {
    const startingDay = this.getMonthsStartingDay(this.viewingMonth, monthOffset)
    const daysInMonth = this.getNumberOfDaysInMonth(this.viewingMonth, monthOffset)

    if (index < startingDay || index >= daysInMonth + startingDay) {
      return 'out-of-range'
    }
    if (this.isDateEqual(date, this.startDate)) {
      if (this.singleMonthView) {
        return 'selected-start-node selected-end-node'
      }
      return 'selected-start-node'
    }
    if (this.isDateEqual(date, this.endDate)) {
      return 'selected-end-node'
    }
    if (!this.singleMonthView && this.startDate && date >= this.startDate && this.endDate && date <= this.endDate) {
      return 'selected'
    }
    if (
      !this.singleMonthView &&
      this.startDate &&
      !this.endDate &&
      this.hoveringDate &&
      date <= this.hoveringDate &&
      date > this.startDate
    ) {
      return 'selected'
    }
    return 'enabled'
  }

  private setViewingMonth(dateString: string, offset = 0) {
    const date = new Date(dateString)
    date.setMonth(date.getMonth() + offset)
    this.viewingMonth = date
  }
}

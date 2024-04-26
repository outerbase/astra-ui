export function eventTargetIsPlugin(event: Event) {
    return event.composedPath().some((el) => {
        if (el instanceof HTMLElement) {
            if (el.tagName.toLowerCase().includes('outerbase-plugin')) {
                return true
            }
        }
    })
}

export function eventTargetIsPluginEditor(event: Event) {
    return event.composedPath().some((el) => {
        if (el instanceof HTMLElement) {
            if (el.tagName.toLowerCase().includes('outerbase-plugin-editor')) {
                return true
            }
        }
    })
}

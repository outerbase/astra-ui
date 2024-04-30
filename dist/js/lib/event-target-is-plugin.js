export function eventTargetIsPlugin(event) {
    return event.composedPath().some((el) => {
        if (el instanceof HTMLElement) {
            if (el.tagName.toLowerCase().includes('astra-plugin')) {
                return true;
            }
        }
    });
}
export function eventTargetIsPluginEditor(event) {
    return event.composedPath().some((el) => {
        if (el instanceof HTMLElement) {
            if (el.tagName.toLowerCase().includes('astra-plugin-editor')) {
                return true;
            }
        }
    });
}

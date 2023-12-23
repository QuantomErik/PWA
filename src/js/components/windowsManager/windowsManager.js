export class WindowManager {
    constructor() {
        this.windows = new Set()
        this.topZIndex = 100;
    }

    addWindow(window) {
        this.windows.add(window)
    }

    removeWindow(window) {
        this.windows.delete(window)
    }

    bringToFront(window) {
        this.windows.forEach(win => {
            win.style.zIndex = (win === window) ? this.topZIndex : ''
        });
    }
}

const windowManager = new WindowManager();

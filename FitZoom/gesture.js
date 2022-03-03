const lim = 500
let zoom = document.body.style.zoom
class TouchHolder {
    constructor() {
        this.update = (ev) => {
            const w = (touch) => {
                if (this.a === undefined || this.a.identifier === touch.identifier) {
                    this.a = touch
                } else if (this.b === undefined || this.b.identifier === touch.identifier) {
                    this.b = touch
                }
            }

            if (ev.touches.length == 1) {
                w(ev.touches[0])
            } else if (ev.touches.length == 2) {
                w(ev.touches[0])
                w(ev.touches[1])
            }
        }
        this.clear = (ev) => {
            if (ev.touches.length == 1) {
                if (this.a !== undefined && this.a.identifier === ev.touches[0].identifier) {
                    this.a = undefined
                } else if (this.b !== undefined && this.b.identifier === ev.touches[0].identifier) {
                    this.b = undefined
                }
            } else {
                this.a = undefined
                this.b = undefined
            }
        }
        this.len = () => Math.sqrt((this.a.clientX - this.b.clientX) ** 2 + (this.a.clientY - this.b.clientY) ** 2)
        this.size = () => this.a === undefined ? 0 : (this.b === undefined ? 1 : 2)
    }
}

const start = new TouchHolder()
const current = new TouchHolder()

addEventListener("touchstart", (ev) => {
    start.update(ev)
    current.update(ev)
})

addEventListener("touchmove", (ev) => {
    current.update(ev)
    if (current.size() < 2) {
        return
    }
    let p = current.len() / start.len() * zoom
    if (p > 5) {
        p = 1
    } else if (p < 0.1) {
        p = 0.1
    }
    document.body.style.zoom = p
})

function processMoveEnd(ev) {
    start.clear(ev)
    current.clear(ev)
    zoom = document.body.style.zoom
}
addEventListener("touchend", processMoveEnd)
addEventListener("touchcancel", processMoveEnd)
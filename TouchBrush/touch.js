document.body.insertAdjacentHTML("beforebegin", `
<style>
.brushed {
    animation-duration: 0.4s;
    animation-name: blinkin;
}

@keyframes blinkin {
    from {
        background: rgba(255, 255, 0, 1);
    }

    to {
        background: rgba(255, 255, 0, 0);
    }
}

#colorInput {
    display: none;
}
</style>
<input type="color" id="colorInput" value="#ff0000">
`)

const colorInput = document.querySelector('#colorInput')
let selected = null
colorInput.addEventListener('input', () => {
    if (selected === null) {
        return
    }
    const value = colorInput.value
    selected.style.color = value
})
colorInput.addEventListener('focusout', () => selected = null)


function getLightnessOfRGB(r, g, b) {
    let rgbIntArray = (g === undefined || b === undefined) ? r.replace(/ /g, '').slice(4, -1).split(',').map(e => parseInt(e))
        : [r, g, b]
  
    const highest = Math.max(...rgbIntArray);
    const lowest = Math.min(...rgbIntArray);
  
    const saturation = (highest + lowest) / 2 / 255
    return saturation
}

function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
    });
  
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
}

function isColorVisible(color) {
    const threhold = 0.9

    if (typeof color === 'string') {
        color = color.trim()
        if (color.startsWith('#')) {
            const rgb = hexToRgb(color)
            return getLightnessOfRGB(rgb.r, rgb.g, rgb.b) <= threhold
        } else if (color.startsWith('rgb(')) {
            return getLightnessOfRGB(color) <= threhold
        }
        return !color.includes('white')
    }
    return true
}

function actualColor(ele) {
    const v = ele.ownerDocument.defaultView
    return v.getComputedStyle(ele).getPropertyValue('color')
}

function findTarget(root) {
    function through(target) {
        if (typeof target.style === 'undefined' || isColorVisible(actualColor(target))) {
            if (target.parentElement === null) {
                return undefined
            }
            through(target.parentElement)
        } else {
            return target
        }
    }
    return through(root)
}

document.addEventListener("click", (ev) => {
    if (ev.target.classList.contains('brushed')) {
        selected = ev.target
        colorInput.click()
    } else {
        const target = findTarget(ev.target)
        if (typeof target === 'undefined') {
            return
        }
        target.style.color = colorInput.value
        target.classList.add('brushed')
    }
})
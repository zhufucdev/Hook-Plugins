(function() {
    const displayHTML = `
    <style>
        .timer {
            position: fixed;
            top: 20px;
            right: 20px;
        }
    </style>
    <h3 class="timer"></h3>
    `
    const autoplayHTML = `
    <a class="play-button" href="#" onclick="javascript:startRolling()">自动播放</a>
    `

    document.body.insertAdjacentHTML("beforebegin", displayHTML)
    document.body.insertAdjacentHTML("beforeend", autoplayHTML)
})()

const display = document.querySelector('.timer'),
    playBtn = document.querySelector('.play-button')

function setDisplay(remaining) {
    display.textContent = "剩余" + remaining + "s"
}

function isWhitespace(str) {
    for (let i in str) {
        const c = str[i]
        if (c !== ' ' && c !== '\n') {
            return false
        }
    }
    return true
}

function getTarget() {
    function getChildrenList(ele) {
        if (ele.children.length >= 2) {
            return ele
        }
        return getChildrenList(ele.children[0])
    }
    const c = getChildrenList(document.body).children
    for (let i = parseInt(c.length / 4); i < c.length; i++) {
        const ele = c[i]
        if (isWhitespace(ele.textContent)) {
            return ele
        }
    }
    return c[parseInt((c.length - 1)/2)]
}

const scrolling = document.scrollingElement
getTarget().scrollIntoView({ block: "end" })
const height = scrolling.scrollTop
const duration = 7 * 60, delta = height * 10 / duration
const counts = parseInt(height / delta)

function startRolling() {
    playBtn.remove()

    let timer, s = 0, count = 0

    timer = setInterval(() => {
        s += delta
        scrolling.scrollTop = s
        count ++
        if (count >= counts) {
            clearInterval(timer)
            startRolling()
        }
        setDisplay((counts - count) * 10)
    }, 10000)

    display.addEventListener('click', () => {
        display.textContent = "已取消"
        clearInterval(timer)
        setTimeout(() => display.remove, 5000)
    })
}

function autoplay() {
    let i, dt = new Date();
    if (dt.getDay() % 2 != 0 || dt.getDay() == 0) {
        i = (6 - dt.getHours()) * 60 * 60 + (30 - dt.getMinutes()) * 60 - dt.getSeconds()
    }
    else {
        i = (7 - dt.getHours()) * 60 * 60 + (30 - dt.getMinutes()) * 60 - dt.getSeconds()
    }
    if (i <= 0) {
        startRolling()
    }
    else {
        let timer, countdown = i;
        timer = setInterval(() => {
            countdown --
            if (countdown < 0) {
                clearInterval(timer)
                return
            }
            setDisplay(countdown)
        }, 1000)
        i *= 1000
        setTimeout(startRolling, i)
    }
}

setTimeout(() => {
    scrolling.scrollTop = 0
})

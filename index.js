const getRandom = (max) => Math.floor(Math.random()*max)
const getRandomMin = (min, max) => min + Math.floor(Math.random()*(max-min))

let lastrun = 0;
let shouldrunid = 0;
let lastelem = null;
let lastruninf = 0;
let ran = false

let imgInt = null;

var count = localStorage.getItem("cats") ?? 0;
const counter = document.getElementById("counter")

//* menu stuff
var darkMode = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
var newTitleAnimImpl = true;
var refreshDelay = 2000;
var stretcher = false;
var boopSoundEffect = true;
var boopSoundVolume = .5;
var boopPitch = 1.5;
var resizeAnim = true;
var fadeAnim = true;
var pause = false;
var fillScreen = false;

function updateDark() {
    // console.log("dark:", darkMode)
    if (darkMode) {
        document.body.classList.add("darkmode")
        document.getElementById("menu").classList.add("darkmode")
        for (let span of document.querySelectorAll("#title span")) {
            span.classList.add("dark-text")
        }
        for (let link of document.querySelectorAll("a")) {
            link.classList.add("dark-text")
        }
    }
    else {
        document.body.classList.remove("darkmode")
        document.getElementById("menu").classList.remove("darkmode")
        for (let span of document.querySelectorAll("#title span")) {
            span.classList.remove("dark-text")
        }
        for (let link of document.querySelectorAll("a")) {
            link.classList.remove("dark-text")
        }
    }
}
updateDark()

let darkchk = document.getElementById("dark")
let resizechk = document.getElementById("resize")
let resizeanimchk = document.getElementById("resize-anim")
let fadechk = document.getElementById("opacity-anim")
let boopchk = document.getElementById("boop-enabled")
let boopvlm = document.getElementById("volume-input")
let booppch = document.getElementById("pitch-input")
let refreshint = document.getElementById("refresh-input")
let pausechk = document.getElementById("pause-chk")
let fillchk = document.getElementById("fill-chk")
let opacity = document.getElementById("opacity-input")
darkchk.checked = darkMode
darkchk.addEventListener("click", ()=>{darkMode = darkchk.checked; updateDark()})
resizechk.checked = stretcher
resizechk.addEventListener("click", ()=>{stretcher = resizechk.checked})
resizeanimchk.checked = resizeAnim
resizeanimchk.addEventListener("click", ()=>{resizeAnim = resizeAnim.checked})
fadechk.checked = fadeAnim
fadechk.addEventListener("click", ()=>{fadeAnim = fadechk.checked})
boopchk.checked = boopSoundEffect
boopchk.addEventListener("click", ()=>{boopSoundEffect = boopchk.checked})
booppch.value = boopPitch * 100
booppch.addEventListener("input", ()=>{boopPitch = booppch.value / 100})
boopvlm.value = boopSoundVolume * 100
boopvlm.addEventListener("input", ()=>{boopSoundVolume = boopvlm.value / 100})
refreshint.value = refreshDelay
refreshint.addEventListener("input", ()=>{refreshDelay = refreshint.value})
pausechk.checked = pause
pausechk.addEventListener("click", ()=>{pause = pausechk.checked; if (!pause) refreshImage(); else clearInterval(imgInt)})
fillchk.checked = fillScreen
fillchk.addEventListener("click", ()=>{
    fillScreen = fillchk.checked
    if (fillScreen) {
        document.getElementById("title").classList.add("title-fill-screen")
        document.getElementById("image-container").classList.add("img-fill-screen")
    } else {
        document.getElementById("title").classList.remove("title-fill-screen")
        document.getElementById("image-container").classList.remove("img-fill-screen")
    }
})
opacity.addEventListener("input", ()=>{
    document.getElementById("title").style.opacity = opacity.value + "%"
})
//* end of menu stuff

let anims = {}

//! bad impl, do not follow
function fixShittyAnims(){
    ran = true
    if (Object.keys(anims).length > 0) {
        for (let animId of Object.keys(anims)) {
            try {
                anims[animId].cancel()
            } catch {}
            anims[animId] = null
            delete anims[animId]
        }
    }
    let titleCharacters = []
    if (newTitleAnimImpl) {
        let len = document.getElementById("title")
                          .innerText
                          .replaceAll("\n","")
                          .length
        //* i havent used a counting for-loop in so long omg
        for (let i = 1; i <= len; i++) {
            let elem = document.getElementById(`title-char-${i}`)
            titleCharacters.push(elem)
        }
    } else {
        titleCharacters = document.getElementById("title").children
    }
    let delay = 0
    for (let span of titleCharacters) {
        function run(oldanim = null) {
            if (oldanim) {
                //* The anim shldve been stopped beforehand so remove it
                anims[oldanim] = null
                delete anims[oldanim]
            } 
            //* this can and WILL break
            //* but i aint gonna fix it
            if (new Date() - lastrun < 200 && lastelem != span) return setTimeout(run, 200 - (new Date() - lastrun))
            lastrun = new Date()
            lastelem = span;
            let hue = getRandom(360)
            let light = !dark ? getRandomMin(55, 65) : getRandomMin(45, 55)
            let anim = span.animate([
                {
                    color: darkMode ? "white" : "black"
                },
                { 
                    color: `hsl(${hue}, 100%, ${light}%)`,
                    offset: .3,
                },
                { 
                    color: `hsl(${hue}, 100%, ${light}%)`,
                    offset: .7
                },
                {
                    color: darkMode ? "white" : "black"
                }
            ], {
                duration: 2000
            })
            let id = getRandom(542341)
            anims[id] = anim
            anim.onfinish = ()=>{run(id)}
        }
        
        //* Fun fact about this function!
        //* It runs super fucking out of sync on page load
        function runOnce() {
            if (new Date() - lastruninf < 200) {
                //* please this makes me cry
                // TODO: deprecate old title anim (tho it looks nice out of sync too)
                if (!newTitleAnimImpl || (newTitleAnimImpl && shouldrunid != titleCharacters.indexOf(span)))
                    return setTimeout(runOnce, 200 - (new Date() - lastruninf))
            }
            shouldrunid++;
            lastruninf = new Date()
            let anim = span.animate([
                { transform: "scale(100%)", padding: "0" },
                {
                    padding: ".25em",
                    transform: "scale(125%)", 
                    offset: .5
                },
                { transform: "scale(100%)", padding: "0" }
            ], {
                duration: 2000,
                iterations: Infinity
            })
            let id = getRandom(542341)
            anims[id] = anim
            run()
        }
        setTimeout(()=>{
            runOnce()
        }, delay)
        delay += 200
    }
}
window.onload = ()=>{
    if (!ran) fixShittyAnims()
}
setTimeout(()=>{
    if (!ran) fixShittyAnims()
}, 1000)

const img = document.getElementById("image")
//* wait for image to load, then send a new request for a new image
img.addEventListener("load", ()=>{
    count++
    localStorage.setItem("cats", count)
    counter.innerHTML = `You have ${count < 50 ? "only " : ""}watched a total of ${count} cats ${count < 50 || count > 150 ? ">" : ""}:${count < 50 ? "(" : "3"}`

    if (!pause)
        imgInt = setTimeout(refreshImage, refreshDelay)
    img.style.opacity = "100%"
    if (fadeAnim) {
        img.animate([
            {opacity: "0%"},
            {opacity: "100%"}
        ], 100)
    }
    if (stretcher) {
        img.style.width = "100%"
        return;
    }
    img.style.width = img.naturalWidth/img.naturalHeight*img.clientHeight + "px"
})
function refreshImage() {
    img.setAttribute("src", "https://cataas.com/cat?" + getRandom(getRandom(1000000)))
    if (fadeAnim) {
        img.style.opacity = "0%"
        img.animate([
            {opacity: "100%"},
            {opacity: "0%"}
        ], 100)
    }
    if (resizeAnim) {
        if (!img.classList.contains("resize-anim"))  
            img.classList.add("resize-anim")
    } else {
        if (img.classList.contains("resize-anim"))  
            img.classList.remove("resize-anim")
    }
}

//* Booping
document.documentElement.addEventListener("click", e=>{
    if (boopSoundEffect){
        let audio = new Audio("./boop.mp3")
        audio.playbackRate = boopPitch
        audio.volume = boopSoundVolume
        audio.play()
    }
    let b = document.createElement("p")
    b.classList.add("boop")
    b.innerHTML = "BOOP!"
    b.style.left = e.pageX - 22 + "px"
    b.style.top = e.pageY - 8 + "px"
    let opacity = 100
    b.style.opacity = opacity + "%"
    b.style.rotate = getRandomMin(-75, 75) + "deg"
    let int = setInterval(()=>{
        opacity-=4
        b.style.opacity = opacity + "%"
        if (opacity < 1) {
            clearInterval(int)
            b.remove()
        }
    }, 10)
    document.body.append(b)
})

document.addEventListener("keypress", e=>{
    if (e.key == " ") {
        document.getElementById("menu").showModal()
    }
})
document.addEventListener("keydown", e=>{
    if (e.key == "ArrowRight") {
        clearInterval(imgInt)
        refreshImage()
    }
})
const getRandom = (max) => Math.floor(Math.random()*max)
const getRandomMin = (min, max) => min + Math.floor(Math.random()*(max-min))

let lastrun = 0;
let lastelem = null;
let lastruninf = 0;

var darkMode = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
var refreshDelay = 2000;
var resizer = true;
var boopSoundEffect = true;
var boopSoundVolume = .5

function updateDark() {
    console.log("dark:", darkMode)
    if (darkMode) {
        document.body.classList.add("darkmode")
        document.getElementById("menu").classList.add("darkmode")
    }
    else {
        document.body.classList.remove("darkmode")
        document.getElementById("menu").classList.remove("darkmode")
    }
}
updateDark()

let darkchk = document.getElementById("dark")
let resizechk = document.getElementById("resize")
let boopchk = document.getElementById("boop-enabled")
let boopvlm = document.getElementById("volume-input")
let refreshint = document.getElementById("refresh-input")
darkchk.checked = darkMode
darkchk.addEventListener("click", ()=>{darkMode = darkchk.checked; updateDark()})
resizechk.checked = resizer
resizechk.addEventListener("click", ()=>{resizer = resizechk.checked})
boopchk.checked = boopSoundEffect
boopchk.addEventListener("click", ()=>{boopSoundEffect = boopchk.checked})
boopvlm.value = boopSoundVolume * 100
boopvlm.addEventListener("change", ()=>{boopSoundVolume = boopvlm.value / 100})
refreshint.value = refreshDelay
refreshint.addEventListener("change", ()=>{refreshDelay = refreshint.value})

let anims = {}

//! bad impl, do not follow
function fixShittyAnims(){
    if (Object.keys(anims).length > 0) {
        for (let animId of Object.keys(anims)) {
            try {
                anims[animId].cancel()
            } catch {}
            anims[animId] = null
            delete anims[animId]
        }
    }
    let titleCharacters = document.getElementById("title").children
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
        function runOnce() {
            if (new Date() - lastruninf < 200) return setTimeout(runOnce, 200 - (new Date() - lastruninf))
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
fixShittyAnims()

const img = document.getElementById("image")
//* wait for image to load, then send a new request for a new image
img.addEventListener("load", ()=>{
    setTimeout(refreshImage, refreshDelay)
    img.style.opacity = "100%"
    img.animate([
        {opacity: "0%"},
        {opacity: "100%"}
    ], 100)
    if (!resizer) {
        img.style.width = "100%"
        return;
    }
    img.style.width = img.naturalWidth/img.naturalHeight*img.clientHeight + "px"
})
function refreshImage() {
    img.setAttribute("src", "https://cataas.com/cat?" + getRandom(getRandom(1000000)))
    img.style.opacity = "0%"
    img.animate([
        {opacity: "100%"},
        {opacity: "0%"}
    ], 100)
}

//* Booping
document.documentElement.addEventListener("click", e=>{
    if (boopSoundEffect){
        let audio = new Audio("./boop.mp3")
        audio.playbackRate = 1.5
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
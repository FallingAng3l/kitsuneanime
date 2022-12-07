const playPauseBtn = document.querySelector(".play-pause-btn"),
    video = document.querySelector("video"),
    videoContainer = document.querySelector('.video-container'),
    fullscreenBtn = document.querySelector('.fullscreen-btn'),
    miniplayerBtn = document.querySelector('.mini-player-btn'),
    muteBtn = document.querySelector('.mute-btn'),
    volumeSlider = document.querySelector('.volume-slider'),
    currentTimeElement = document.querySelector('.current-time'),
    totalTimeElement = document.querySelector('.total-time'),
    speedBtn = document.querySelector('.speed-btn'),
    timelineContainer = document.querySelector('.timeline-container');

document.addEventListener('keydown', async (e) => {
    switch (e.key.toLowerCase()) {
        case " ":
        case "k":
            togglePlayPause()
            break
        case "f":
            toggleFullscreen()
            break
        case "i":
            toggleMiniplayer()
            break
        case "m":
            toggleMute()
            break
        case "arrowleft":
        case "j":
            skip(-5)
            break
        case "arrowright":
        case "l":
            skip(5)
            break
    }
})

//play e pause
playPauseBtn.addEventListener('click', togglePlayPause)

video.addEventListener('click', togglePlayPause)

function togglePlayPause() {
    video.paused ? video.play() : video.pause()
}

video.addEventListener('play', () => {
    videoContainer.classList.remove("paused")
})

video.addEventListener('pause', () => {
    videoContainer.classList.add("paused")
})

//telas hihihiha

fullscreenBtn.addEventListener('click', toggleFullscreen);
miniplayerBtn.addEventListener('click', toggleMiniplayer);

function toggleFullscreen() {
    if (document.fullscreenElement == null) {
        videoContainer.requestFullscreen()
    } else {
        document.exitFullscreen()
    }
}

function toggleMiniplayer() {
    if (videoContainer.classList.contains('mini-player')) {
        document.exitPictureInPicture()
    } else {
        video.requestPictureInPicture()
    }
}

document.addEventListener('fullscreenchange', async (e) => {
    videoContainer.classList.toggle('fullscreen', document.fullscreenElement)
})

video.addEventListener('enterpictureinpicture', async () => {
    videoContainer.classList.add('mini-player')
})

video.addEventListener('leavepictureinpicture', async () => {
    videoContainer.classList.remove('mini-player')
})

//volume

muteBtn.addEventListener('click', toggleMute)
volumeSlider.addEventListener('input', e => {
    video.volume = e.target.value
    video.muted = e.target.value === 0
})

function toggleMute() {
    video.muted = !video.muted
}

video.addEventListener('volumechange', async () => {
    volumeSlider.value = video.volume;
    let volumeLevel;
    if (video.muted || video.volume === 0) {
        volumeSlider.value = 0;
        volumeLevel = 'muted'
    } else if (video.volume >= .5) {
        volumeLevel = 'high'
    } else {
        volumeLevel = 'low'
    };

    videoContainer.dataset.volumeLevel = volumeLevel
})

//tempinho huehue

video.addEventListener('loadeddata', () => {
    totalTimeElement.textContent = formatDuration(video.duration)
})

video.addEventListener('timeupdate', () => {
    currentTimeElement.textContent = formatDuration(video.currentTime)
    const percent = video.currentTime / video.duration
    timelineContainer.style.setProperty("--progress-position", percent)
})

const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
    minimumIntegerDigits: 2
})
function formatDuration(time) {
    const seconds = Math.floor(time % 60),
        minutes = Math.floor(time / 60) % 60,
        hours = Math.floor(time / 3600)

    if (hours === 0) {
        return `${minutes}:${leadingZeroFormatter.format(seconds)}`
    } else {
        return `${hours}:${leadingZeroFormatter.format(minutes)}:${leadingZeroFormatter.format(seconds)}`
    }
}

//+5/-5 segundos

function skip(duration) {
    video.currentTime += duration
}

//velocidade de reprodução
speedBtn.addEventListener('click', changeSpeed)

function changeSpeed() {
    let newPlaybackSpeed = video.playbackRate + .25
    if (newPlaybackSpeed > 2) newPlaybackSpeed = .25
    video.playbackRate = newPlaybackSpeed
    speedBtn.textContent = `${newPlaybackSpeed}x`
}

//timeline

timelineContainer.addEventListener('mousemove', handleTimelineUpdate)
timelineContainer.addEventListener('mousedown', toggleScrubbing)
document.addEventListener('mouseup', e => {
    if(isScrubbing) toggleScrubbing(e)
})
document.addEventListener('mousemove', e => {
    if(isScrubbing) handleTimelineUpdate(e)
})

let isScrubbing = false,
    wasPaused;
function toggleScrubbing(e) {
    const rect = timelineContainer.getBoundingClientRect(),
        percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;

    isScrubbing = (e.buttons & 1) === 1
    videoContainer.classList.toggle('scrubbing', isScrubbing)
    if(isScrubbing) {
        wasPaused = video.paused
        video.pause()
    } else {
        video.currentTime = percent * video.duration
        if(!wasPaused) video.play()
    }

    handleTimelineUpdate(e)
}

function handleTimelineUpdate(e) {
    const rect = timelineContainer.getBoundingClientRect(),
        percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width

    timelineContainer.style.setProperty("--preview-position", percent)

    if (isScrubbing) {
        e.preventDefault()
        timelineContainer.style.setProperty("--progress-position", percent)
    }
}
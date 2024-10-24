const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const volume = document.getElementById("volume");
const timeLine = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenBtnIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const mouseMove = document.getElementById("videoControls");

let volumeValue = 0.5;
let controlsTimeout = null;
video.volume = volumeValue;

const formatTime = (seconds) =>
  new Date(seconds * 1000).toISOString().substring(11, 19);

const handlePlayClick = () => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtnIcon.classList = video.paused
    ? "fa-solid fa-play"
    : "fa-solid fa-pause";
};

const handleMute = (event) => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  muteBtnIcon.className = video.muted
    ? "fa-solid fa-volume-high"
    : "fa-solid fa-volume-xmark";
  volume.value = video.muted ? 0 : volumeValue;
};

const handleVolume = (event) => {
  const { value } = event.target;
  if (video.muted) {
    video.muted = false;
    muteBtnIcon.className = "fa-solid fa-volume-xmark";
  }
  volumeValue = value;
  video.volume = volumeValue;
};

const handlePlay = () => {
  playBtnIcon.className = "fa-solid fa-pause";
};
const handlePause = () => {
  playBtnIcon.className = "fa-solid fa-play";
};

const handleLoadedMetaData = () => {
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeLine.max = Math.floor(video.duration);
};

const handleTimeUpdate = () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
  timeLine.value = Math.floor(video.currentTime);
};

const handleVideoTimeline = (event) => {
  video.currentTime = timeLine.value;
};

const handleFullScreen = () => {
  const fullScreen = document.fullscreenElement;
  if (fullScreen) {
    document.exitFullscreen();
    fullScreenBtnIcon.className = "fa-solid fa-expand";
  } else {
    videoContainer.requestFullscreen();
    fullScreenBtnIcon.className = "fa-solid fa-compress";
  }
};

const hideControls = () => {
  videoControls.classList.remove("showing");
};

const handleMouseMove = () => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  videoControls.classList.add("showing");
  controlsTimeout = setTimeout(hideControls, 4000);
};

const handleMouseLeave = () => {
  controlsTimeout = setTimeout(hideControls, 3000);
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
timeLine.addEventListener("click", handleVideoTimeline);
volume.addEventListener("input", handleVolume);
video.addEventListener("pause", handlePause);
video.addEventListener("play", handlePlay);
video.addEventListener("loadedmetadata", handleLoadedMetaData);
video.addEventListener("timeupdate", handleTimeUpdate);
fullScreenBtn.addEventListener("click", handleFullScreen);
video.addEventListener("mousemove", handleMouseMove);
video.addEventListener("mouseleave", handleMouseLeave);

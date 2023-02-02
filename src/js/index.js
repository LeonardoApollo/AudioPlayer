'use strict'

// Player logic
const player = document.querySelector('.player'),
    playBtn = document.querySelector('.play'),
    prevBtn = document.querySelector('.prev'),
    nextBtn = document.querySelector('.next'),
    audio = document.querySelector('.audio'),
    progressContainer = document.querySelector('.progress__container'),
    progressBar = document.querySelector('.progress'),
    songTitle = document.querySelector('.song'),
    coverImg = document.querySelector('.cover__img'),
    srcImg = document.querySelector('.img__src');

const songs = ['Rob Gasser & Miss Lina - Rift [NCS Release]', 'ROY KNOX & CRVN - The Other Side [NCS Release]', 'Lennart Schroot - Fata Morgana [NCS Release]'];

let songIndex = 0;

playBtn.addEventListener('click', e => {
    const isPlaying = player.classList.contains('play');
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
})

nextBtn.addEventListener('click', nextSong);

prevBtn.addEventListener('click', prevSong);

audio.addEventListener('timeupdate', updateProgress);

progressContainer.addEventListener('click', setProgress);

audio.addEventListener('ended', nextSong);

initSong(songs[songIndex]);


function initSong(song) {
    songTitle.innerHTML = song;
    audio.src = `audio/${song}.mp3`;
    coverImg.src = `img/song${songIndex + 1}.jpg`;
}

function playSong() {
    srcImg.src = './icons/pause.svg';
    player.classList.add('play');
    coverImg.classList.add('active');
    audio.play();
    preporation();
}

function pauseSong() {
    srcImg.src = './icons/play.svg';
    player.classList.remove('play');
    coverImg.classList.remove('active');
    audio.pause();
}

function nextSong() {
    songIndex++;
    if (songIndex > songs.length - 1) {
        songIndex = 0;
    }
    initSong(songs[songIndex]);
    playSong();
    preporation();
}

function prevSong() {
    songIndex--;
    if (songIndex < 0) {
        songIndex = songs.length - 1;
    }
    initSong(songs[songIndex]);
    playSong();
    preporation();
}

function updateProgress(e) {
    const {duration, currentTime} = e.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    progressBar.style.width = `${progressPercent}%`;
}

function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration

    audio.currentTime = (clickX / width) * duration;
}

// Animation
const canvas = document.querySelector('#canvas1');
const ctx = canvas.getContext('2d');

let audioSource, analyser;

function preporation() {
    const audioContext = new AudioContext();
    if (!audioSource) { // Проверка на присутсвите источника аудио 
        analyser = audioContext.createAnalyser();
        audioSource = audioContext.createMediaElementSource(audio);
        audioSource.connect(analyser);
        analyser.connect(audioContext.destination);
    }
    analyser.fftSize = 128; // Настройка количества "столбиков" в анимации
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const barWidth = canvas.width/bufferLength;
    let barHeight;
    let x;

    function animate() {
        x = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        analyser.getByteFrequencyData(dataArray);
        drawVisualiser(bufferLength, x, barWidth, barHeight, dataArray);
        requestAnimationFrame(animate);
    }
    animate();
}

function drawVisualiser(bufferLength, x, barWidth, barHeight, dataArray) {
    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2.5; // Настройка высоты анимации
        const red = i * barHeight/10;
        const green = i * 4;
        const blue = barHeight/6;
        ctx.fillStyle = 'rgb(' + red + ',' + green + ',' + blue + ')'; // Настройка цвета
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth;
    }
}
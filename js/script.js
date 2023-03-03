console.log('Итого баллов = 85.\n Часы и календарь +15\n Приветствие +10\n Смена фонового изображения +20\n Виджет погоды +15\n Виджет цитата дня +10\n Аудиоплеер +15');

// 1. time and date

function showTime() {
    const time = document.querySelector('.time');
    const date = new Date();
    const options = { hour: 'numeric', minute: 'numeric', second: 'numeric' };
    const currentTime = date.toLocaleTimeString('ru-RU', options);
    time.textContent = currentTime;

    showDate();

    greet();

    setTimeout(showTime, 1000);
}

function showDate() {
    const date = document.querySelector('.date');
    const showDate = new Date();
    const options = { month: 'long', day: 'numeric' };
    const weekDay = showDate.toLocaleString('en-Br', { weekday: 'long' });
    const currentDate = showDate.toLocaleDateString('en-Br', options);
    date.textContent = `${weekDay}, ${currentDate}`;
}

showTime();

// 2. Greeting

function getTimeOfDay() {
    const date = new Date();
    const hours = date.getHours();

    let dayTime;

    if (hours >= 6 && hours < 12) {
        return dayTime = 'morning';
    } else if (hours >= 12 && hours < 18) {
        return dayTime = 'afternoon';
    } else if (hours >= 18 && hours <= 23) {
        return dayTime = 'evening';
    } else {
        return dayTime = 'night';
    }
}

function greet() {
    const greeting = document.querySelector('.greeting');
    const dayTime = getTimeOfDay();
    greeting.textContent = `Good ${dayTime}, `;
}

let inputName = document.querySelector('.name');

if (inputName) {
    inputName.value = localStorage.getItem('name') || "";

    inputName.addEventListener('input', function () {
        localStorage.setItem('name', this.value);
    });
}

// 3. Background image

function getRandomNum(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let randomNum = getRandomNum(1, 20);

function setBg() {
    const bgNum = String(randomNum);
    const bgNumFormated = bgNum.padStart(2, "0");
    const dayTime = getTimeOfDay();

    const img = new Image();
    img.src = `https://raw.githubusercontent.com/MariaPolina/stage1-tasks/assets/images/${dayTime}/${bgNumFormated}.jpg`;

    img.addEventListener('load', function () {
        document.body.style.backgroundImage = `url(https://raw.githubusercontent.com/MariaPolina/stage1-tasks/assets/images/${dayTime}/${bgNumFormated}.jpg)`;
    })
}

setBg();

function getSlideNext() {
    randomNum = randomNum + 1
    if (randomNum === 21) {
        randomNum = 1;
    }

    setBg();
}

function getSlidePrev() {
    randomNum = randomNum - 1
    if (randomNum === 0) {
        randomNum = 20;
    }

    setBg();
}

const slideNext = document.querySelector('.slide-next');
const slidePrev = document.querySelector('.slide-prev');

slideNext.addEventListener('click', getSlideNext);
slidePrev.addEventListener('click', getSlidePrev);

// 4. Weather widget

const city = document.querySelector('.city');
const weatherError = document.querySelector('.weather-error');

const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');

city.value = localStorage.getItem('city') || "Minsk";

async function getWeather() {
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=en&appid=0d02c2bf00a9e1daea78cee3972dc07c&units=metric`;
        const res = await fetch(url);
        const data = await res.json();

        weatherError.textContent = '';

        weatherIcon.className = 'weather-icon owf';
        weatherIcon.classList.add(`owf-${data.weather[0].id}`);
        temperature.textContent = `${Math.round(data.main.temp)}°C`;
        weatherDescription.textContent = data.weather[0].description;
        wind.textContent = `Wind speed: ${Math.round(data.wind.speed)} m/s`;
        humidity.textContent = `Humidity: ${data.main.humidity}%`;
    } catch {
        weatherError.textContent = 'Incorrect city name';
        weatherIcon.className = 'weather-icon owf';
        temperature.textContent = `-°C`;
        weatherDescription.textContent = 'No data';
        wind.textContent = `Wind speed: - m/s`;
        humidity.textContent = `Humidity: - %`;
    }
}

getWeather()

city.addEventListener('change', function () {

    city.value = this.value;
    localStorage.setItem('city', this.value);

    getWeather()

})

// 5. Quotes widget

const changeQuote = document.querySelector('.change-quote');
const quote = document.querySelector('.quote');
const author = document.querySelector('.author');

async function getQuotes() {
    const quotes = 'json/quots.json';
    const res = await fetch(quotes);
    const data = await res.json();

    const size = data.length - 1;

    let randomNum = getRandomNum(0, size);

    quote.textContent = data[randomNum].text;
    author.textContent = data[randomNum].author;

    changeQuote.addEventListener('click', getQuotes)
}

getQuotes();

// 6. Audioplayer

import playList from './playList.js';

const audio = new Audio();

const playButton = document.querySelector('.play');
const playPrev = document.querySelector('.play-prev');
const playNext = document.querySelector('.play-next');

let isPlay = false;
let playNum = 0;

function playAudio() {
    audio.src = playList[playNum].src;
    audio.currentTime = 0;

    const currentAudioTrack = document.querySelector(`.play-item:nth-child(${playNum + 1})`);

    if (!isPlay) {
        audio.play();
        isPlay = true;
        playButton.classList.add('pause');
        currentAudioTrack.classList.add('item-active');
    } else {
        audio.pause();
        isPlay = false;
        playButton.classList.remove('pause');
        currentAudioTrack.classList.remove('item-active');
    }
}

audio.addEventListener('ended', function () {
    playNext.click();
});

playButton.addEventListener('click', playAudio)

function playNextTrack() {
    const currentAudioTrack = document.querySelector(`.play-item:nth-child(${playNum + 1})`);
    playNum = playNum + 1
    if (playNum === playList.length) {
        playNum = 0;
    }
    isPlay = false;
    playButton.classList.remove('pause');
    currentAudioTrack.classList.remove('item-active');
    playAudio();
}

function playPrevTrack() {
    const currentAudioTrack = document.querySelector(`.play-item:nth-child(${playNum + 1})`);
    playNum = playNum - 1
    if (playNum === -1) {
        playNum = playList.length - 1;
    }
    isPlay = false;
    playButton.classList.remove('pause');
    currentAudioTrack.classList.remove('item-active');
    playAudio();
}

playPrev.addEventListener('click', playPrevTrack)
playNext.addEventListener('click', playNextTrack)


const playListContainer = document.querySelector('.play-list');

for (let i = 0; i < playList.length; i++) {
    const li = document.createElement('li');
    li.classList.add('play-item');
    playListContainer.append(li);
    li.textContent = playList[i].title;
}

// 7. Advanced Audioplayer

// 8. Dual Language

// 9. Background image from API

// 10. Settings

// 11. Additional features - ToDo list
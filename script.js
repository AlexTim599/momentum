 import playList from "./playList.js";

 const time = document.querySelector('.time');
 const currentDate = document.querySelector('.date');
 const greeting = document.querySelector('.greeting')
 const name = document.querySelector('.name');
 const body = document.querySelector('body');
 const slidePrev = document.querySelector('.slidePrev');
 const slideNext = document.querySelector('.slideNext');
 const quote = document.querySelector('.quote');
 const author = document.querySelector('.author');
 const weatherIcon = document.querySelector('.weather-icon');
 const temperature = document.querySelector('.temperature');
 const weatherDescription = document.querySelector('.weather-description');
 const wind = document.querySelector('.wind');
 const humidity = document.querySelector('.humidity');
 const city = document.querySelector('.city');
 const changeQuote = document.querySelector('.change-quote');

 const playListContainer = document.querySelector('.play-list');
 const li = document.createElement('li');

 for (let i = 0; i < playList.length; i++) {
     const li = document.createElement('li');
     li.classList.add('play-item');
     li.textContent = playList[i].title;
     playListContainer.append(li);
 }




 let isPlay = false;
 let playNum = 0;
 const play = document.querySelector('.play');
 const playPrev = document.querySelector('.play-prev');
 const playNext = document.querySelector('.play-next');



 let bgNum = getRandomNum(1, 20);


 setBg();
 getWeather();

 window.addEventListener('beforeunload', setLocalStorage);
 window.addEventListener('load', getLocalStorage);
 window.addEventListener('beforeunload', setLocalStorageWeather);
 window.addEventListener('load', getLocalStorageWeather);


 slideNext.addEventListener('click', getSlideNext);
 slidePrev.addEventListener('click', getSlidePrev);
 city.addEventListener('keyup', function(change) {
     if (change.key === 'Enter') {
         getWeather();

     }
 })

 play.addEventListener('click', playAndPause);
 playNext.addEventListener('click', playNextEvent);
 playPrev.addEventListener('click', playPrevEvent);
 play.addEventListener('click', toggleBtn);
 changeQuote.addEventListener('click', setQuotesText);



 setInterval(() => {
     showTime();
     showDate();
     showTimeOfDay();
 }, 1000);

 function showTime() {
     const date = new Date();
     const currentTime = date.toLocaleTimeString();
     time.textContent = currentTime;
 }

 function showDate() {
     const date = new Date();
     const options = { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' };
     const dateToLocalString = date.toLocaleDateString('en-US', options);
     currentDate.textContent = dateToLocalString;

 }

 function getTimeOfDay() {
     const date = new Date();
     const hours = date.getHours();

     let dayPart = 'evening';

     if (hours >= 0 && hours < 6) {
         dayPart = 'night';
     } else if (hours >= 6 && hours < 12) {
         dayPart = 'morning';
     } else if (hours >= 12 && hours < 18) {
         dayPart = 'afternoon';
     }

     return dayPart;
 }

 function showTimeOfDay() {
     const getCurrentTimeOfDay = getTimeOfDay();
     greeting.textContent = `Good ${getCurrentTimeOfDay}`;
 }


 function inputName() {
     name.textContent = input.value;
 }


 function setLocalStorage() {
     localStorage.setItem('name', name.value);
 }

 function getLocalStorage() {
     if (localStorage.getItem('name')) {
         name.value = localStorage.getItem('name');
     }
 }

 function getRandomNum(min, max) {
     min = Math.ceil(min);
     max = Math.floor(max);
     return Math.floor(Math.random() * (max - min + 1)) + min;

 }

 function setBg() {
     const img = new Image();
     const timeOfDay = getTimeOfDay();
     let bgImage = bgNum;

     if (bgImage.toString().length === 1) {
         bgImage = bgImage.toString().padStart(2, 0);
     }

     bgImage = bgImage.toString();
     const bgUrl = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${bgImage}.jpg`;

     img.src = bgUrl;
     img.onload = () => {
         body.style.backgroundImage = `url(${bgUrl})`;
     }
 }

 function getSlideNext() {
     bgNum++;

     if (bgNum > 20) {
         bgNum = 1;
     }

     setBg();
 }

 function getSlidePrev() {
     bgNum--;
     if (bgNum < 1) {
         bgNum = 20;
     }
     setBg();
 }


 async function getQuotes() {
     const quotes = './data.json';
     const res = await fetch(quotes);
     const data = await res.json();

     return data;

 }



 function setQuotesText() {
     let quotesText = getQuotes();
     quotesText.then((data) => {
         let quteNum = getRandomNum(0, data.length - 1);
         console.log(quteNum);
         quote.textContent = data[quteNum].text;
         author.textContent = data[quteNum].author;

     })

 }
 setQuotesText();


 async function getWeather() {
     let cityValue = city.value || 'Минск';


     const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityValue}&lang=ru&appid=ccb3840e9162e7e7f447771eb6501d19&units=metric`;

     const res = await fetch(url);
     const data = await res.json();
     weatherIcon.className = 'weather-icon owf';
     if (data.cod === '404') {
         weatherDescription.textContent = data.message;
         temperature.textContent = '';
         wind.textContent = '';
         humidity.textContent = '';
         weatherIcon.classList.add();
         return;
     }

     weatherIcon.classList.add(`owf-${data.weather[0].id}`);

     temperature.textContent = `${Math.round(data.main.temp)}°C`;
     wind.textContent = `Wind speed: ${Math.round( data.wind.speed)} m/s`;
     humidity.textContent = `Humidity: ${Math.round(data.main.humidity)}%`;

     weatherDescription.textContent = data.weather[0].description;

 }

 function setLocalStorageWeather() {
     localStorage.setItem('city', cityValue);
 }

 function getLocalStorageWeather() {
     if (localStorage.getItem('city')) {
         city.value = localStorage.getItem('city');
     }
 }

 const audio = new Audio();

 function playAudio() {

     audio.src = playList[playNum].src;
     audio.currentTime = 0;
     audio.play();
 }

 function pauseAudio() {
     audio.pause();

 }

 function playAndPause() {
     if (isPlay === false) {
         playAudio();
         isPlay = true;
     } else {
         isPlay = false;
         pauseAudio();

     }
 }



 function toggleBtn() {
     play.classList.toggle('pause');
 }


 function playNextEvent() {
     if (playNum < 3) {
         playNum++;
     } else {
         playNum = 0;
     }

     playAudio();

 }



 function playPrevEvent() {
     if (playNum === 0) {
         playNum = 3;
     } else {
         playNum--;

     }
     playAudio();

 }
const userNotes = document.getElementById("writing_notes");
const saveNotesBtn = document.getElementById("save_btn");


document.addEventListener("DOMContentLoaded", () => {

    //display time
    startTime();

    //display weather
    getWeather();

    //display news
    getNews();

        //get saved header
        const savedHeading = localStorage.getItem('heading');
        if (savedHeading) {
            document.getElementById('header').textContent = savedHeading;
        }
        const header = document.getElementById('header');
        header.addEventListener("click", () => {
            editHeading(header);
        });

    //get saved link-container
    const container = document.querySelector(".link-container");
    container.innerHTML = localStorage.getItem("links");

    const savedLinks = localStorage.getItem("links");
    if (savedLinks) {
        document.querySelector(".link-container").innerHTML = savedLinks;
        addRemoveListeners(); // <- viktigt!
    }

    //display saved notes
    const getNotes = localStorage.getItem("text");
    localStorage.getItem("text");
    userNotes.value = getNotes;

    userNotes.addEventListener("change", (e) => {
        localStorage.setItem("text", e.target.value)
        });


        //change background and save it

        const randomBtn = document.getElementById("background_randomizer");
        const backgroundImg = document.getElementById("background-img");
        const savedBackground = localStorage.getItem("background");
    
        if (savedBackground) {
            backgroundImg.src = savedBackground;
        } else {
            backgroundImg.src = '/images/1.png';
        }
    
        randomBtn.addEventListener('click', () => {
            let images = [
                '/images/1.png',
                '/images/2.png',
                '/images/3.png',
                '/images/4.png',
                '/images/5.png',
            ];
    
            let randomNum = Math.floor(Math.random() * images.length);
            backgroundImg.src = images[randomNum];
    
            localStorage.setItem("background", backgroundImg.src);
        });

    });

//get date
const date = new Date().toLocaleDateString("sv-SE");
document.getElementById("date").innerHTML = `${date}`;

//get time
function startTime(){
let today = new Date();
let h = today.getHours();
let m = today.getMinutes();
m = checkTime(m);
h = checkTime(h);

document.getElementById("time").innerHTML = h + ":" + m;
setTimeout(startTime, 1000);
}

function checkTime(i) {
    if (i < 10) {i = "0" + i};
    return i;
}


//Edit Heading
function editHeading() {
    const header = document.getElementById("header");

    const input = document.createElement("input");
    input.type = "text";
    input.id = "headerInput";
    input.value = header.textContent;

    header.innerHTML = "";
    header.appendChild(input);
    
    input.focus();

    input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {      
            const newHeading = input.value;
        if (newHeading) {
            localStorage.setItem("heading", newHeading);
            header.textContent = newHeading;
        } else {
            header.textContent = "Click to change this header";
        }
        }
    });
}


// Add Links
function addNewLink(){
    const addLink = document.querySelector("#addLink").value;
    const addTitle = document.querySelector("#addTitle").value;
    const container = document.querySelector(".link-container");

    //skapa diven
    const linkItem = document.createElement("div");
    linkItem.classList.add("linkItem");

    //skapa länken
    const link = document.createElement("a");
    link.href = addLink;
    link.textContent = addTitle;
    link.target = "_blank";

    const saveLinksToLocalStorage = () => {
        localStorage.setItem("links", document.querySelector(".link-container").innerHTML);
    }

    const removeLink = document.createElement("button");
    removeLink.innerHTML = "x";
    removeLink.classList.add("removeLink");

    removeLink.onclick = function(){
        container.removeChild(linkItem);
        saveLinksToLocalStorage();
    };

    linkItem.appendChild(link);
    linkItem.appendChild(removeLink);
    container.appendChild(linkItem);
    saveLinksToLocalStorage();

    document.getElementById("addTitle").value = "";
    document.getElementById("addLink").value = "";
}

function addRemoveListeners() {
    const removeButtons = document.querySelectorAll(".removeLink");
    removeButtons.forEach(button => {
        button.onclick = function() {
            button.parentElement.remove();
            localStorage.setItem("links", document.querySelector(".link-container").innerHTML);
        };
    });
}

//Weather API

// Get geolocation
function getPosition(success, error) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

// Fetch Weather
function fetchWeather(lat, lon) {

    const container = document.getElementById("weather-container");
    container.innerHTML = "";

    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIkey}`)
        .then((response) => {
            if (!response.ok) throw new Error("Network response was not ok");
            return response.json();
        })
        .then((weather) => {
            const cityName = document.createElement("h3");
            cityName.classList.add("location");
            cityName.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${weather.city.name}`;
            container.appendChild(cityName);

            weather.list.forEach((item, index) => {
                if (index % 8 !== 0) return;

                const tempandicon = document.createElement("div");
                tempandicon.classList.add("tempandicon");

                const dateObj = new Date(item.dt_txt);
                const weekday = dateObj.toLocaleDateString('en-EN', { weekday: 'long' });

                const celsius = item.main.temp - 273.15;

                const weatherDiv = document.createElement("div");
                weatherDiv.classList.add("weather-div");

                const date = document.createElement("h3");
                date.textContent = weekday;

                const temp = document.createElement("p");
                temp.textContent = `${Math.floor(celsius)} °C`;

                const iconCode = item.weather[0].icon;
                const weatherIcon = document.createElement("img");
                weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}.png`;

                tempandicon.appendChild(temp);
                tempandicon.appendChild(weatherIcon);

                weatherDiv.appendChild(date);
                weatherDiv.appendChild(tempandicon);

                container.appendChild(weatherDiv);
            });
        })
        .catch((error) => {
            console.error("Error fetching weather:", error);
        });
}

// Get location and fetch weather
function getWeather() {
    getPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchWeather(lat, lon);
        },
        (error) => {
            console.error("Geolocation error:", error);
        }
    );
}


// news API 

function getNews() {
    fetch("https://newsdata.io/api/1/news?apikey=pub_772322fb2a44c7c263d727244d39469d834b6&country=se&language=sv&category=top")
    .then((response) => {
        if (!response.ok) {
            throw new Error("Network response was not ok...");
        }
        return response.json();
    })
    .then((news) => {
        const container = document.getElementById("news-container");
        container.innerHTML = "";

        news.results.forEach((newsItem) => {
            const article = document.createElement("div");
            article.classList.add("news-div");

            const text = document.createElement("div");
            text.classList.add("news-text");

            const title = document.createElement("h3");
            title.textContent = newsItem.title;

            const description = document.createElement("p");

            if (!newsItem.description) {
                description.style.display = "none";
            } else {
                description.textContent = newsItem.description;
                description.style.display = "block";
            }

            const source = document.createElement("h4");
            source.textContent = newsItem.source_name;

            const link = document.createElement("a");
            link.href = newsItem.link;
            link.textContent = "Read more";
            link.target = "_blank";
            link.id = "article_link";

            const newsImg = document.createElement("img");
            newsImg.classList.add("news-image");

            if (newsItem.image_url) {
                newsImg.src = newsItem.image_url;
                newsImg.style.display = "block";
            } else {
                newsImg.style.display = "none";
            }

            text.appendChild(title);
            text.appendChild(description);
            text.appendChild(source);
            text.appendChild(link);

            article.appendChild(text);
            article.appendChild(newsImg);

            container.appendChild(article);
        });

    })
    .catch((error) => {
        console.error("Error fetching news:", error);
    });
}


//Notes to LocalStorage
saveNotesBtn.addEventListener("click", () => {
    localStorage.setItem("text", userNotes.value);
    });
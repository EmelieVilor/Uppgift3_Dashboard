const userNotes = document.getElementById("writing_notes");
const saveNotesBtn = document.getElementById("save_btn");
const getNotes = localStorage.getItem("text");

document.addEventListener("DOMContentLoaded", () => {
    //get saved header
    const savedHeading = localStorage.getItem('heading');
        if (savedHeading) {
            document.getElementById('header').textContent = savedHeading;
        }
        const header = document.getElementById('header');
        header.addEventListener("click", () => {
            editHeading(header);
        });

    //display time
    startTime();


    //display weather
    getWeather();

    //display news
    getNews();

    //display saved notes
    localStorage.getItem("text");
    userNotes.value = getNotes;

    userNotes.addEventListener("change", (e) => {
        localStorage.setItem("text", e.target.value)
        });


        //change background and save it to local storage

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
    const header = document.getElementById('header');
    
    // Create an input field with the current heading as its value
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'headerInput';
    input.value = header.textContent;

    // Replace the h1 with the input field
    header.innerHTML = '';
    header.appendChild(input);


    input.focus();

    input.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            const newHeading = input.value;
            if (newHeading) {
                // Save the new heading to localStorage
                localStorage.setItem('heading', newHeading);
                header.textContent = newHeading;  // Update the h1 text
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

    //skapa en div med länk
    const linkItem = document.createElement("div");
    linkItem.classList.add("linkItem");


    //skapa länken
    const link = document.createElement("a");
    link.href = addLink;
    link.textContent = addTitle;
    link.target = "_blank";

    const removeLink = document.createElement("button");
    removeLink.innerHTML = "x";
    removeLink.classList.add("removeLink");
    removeLink.onclick = function(){
        container.removeChild(linkItem);
    };

    linkItem.appendChild(link);
    linkItem.appendChild(removeLink);
    container.appendChild(linkItem);

    document.getElementById("addTitle").value = "";
    document.getElementById("addLink").value = "";
}


// weather API
function getWeather() {

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIkey}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok...");
                }
                return response.json();
            })
            .then((weather) => {
                const container = document.getElementById("weather-container");
                container.innerHTML = "";

                const cityName = document.createElement("h3");
                cityName.classList.add("location");
                cityName.innerHTML =`<i class="fa-solid fa-location-dot"></i> ${weather.city.name}`;
                container.appendChild(cityName);

                weather.list.forEach((list, index) => {
                    // Show only the first weather data for each day
                    if (index % 8 === 0) {

                        const tempandicon = document.createElement("div");
                        tempandicon.classList.add("tempandicon");

                        const dateObj = new Date(list.dt_txt);
                        const weekday = dateObj.toLocaleDateString('en-EN', { weekday: 'long' });

                        const celsius = list.main.temp - 273.15;

                        const weatherDiv = document.createElement("div");
                        weatherDiv.classList.add("weather-div");

                        const date = document.createElement("h3");
                        date.textContent = weekday;

                        const temp = document.createElement("p");
                        temp.textContent = `${Math.floor(celsius)} °C`;

                        const iconCode = list.weather[0].icon; // Fetch icon code from weather data
                        const weatherIcon = document.createElement("img");
                        weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}.png`;
                        

                        tempandicon.appendChild(temp);
                        tempandicon.appendChild(weatherIcon);

                        weatherDiv.appendChild(date);
                        weatherDiv.appendChild(tempandicon);
                
                        container.appendChild(weatherDiv);
                    }
                });
            })
            .catch((error) => {
                console.error("Error fetching weather: ", error);
            });
        }, (error) => {
            console.error("Geolocation error:", error);
        });
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
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
        container.innerHTML = "";  // Clear any existing news content

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
    console.log(localStorage.getItem("text"));
    
    });
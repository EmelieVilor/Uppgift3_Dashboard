const userNotes = document.getElementById("writing_notes");
const saveNotesBtn = document.getElementById("save_btn");
const getNotes = localStorage.getItem("text");
const backgroundImg = document.getElementById("background_img");

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

    //display news
    // getNews();

    //display saved notes
    localStorage.getItem("text");
    userNotes.value = getNotes;

    userNotes.addEventListener("change", (e) => {
        localStorage.setItem("text", e.target.value)
        });
    });

    //Notes to LocalStorage
    saveNotesBtn.addEventListener("click", () => {
    localStorage.setItem("text", userNotes.value);
    console.log(localStorage.getItem("text"));

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
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
}


//change background
const randomBtn = document.getElementById("background_randomizer");

randomBtn.addEventListener('click', () => {
    let images = ['/images/1.png',
            'images/2.png',
            'images/3.png',
            'images/4.png',
            'images/5.png',];

            let randomNum = Math.floor(Math.random() * images.length);
            backgroundImg.src = images[randomNum];
            localStorage.setItem("background", backgroundImg.src);
});


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

    // Focus the input field for easy typing
    input.focus();

    // When the user presses Enter, save the new heading
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

// function getWeather(){
//     const APIkey = '32048c51a51efb088d2271a2fc836497';



// }


function getWeather(){
    const APIkey = '32048c51a51efb088d2271a2fc836497';

    fetch("https://api.openweathermap.org/data/2.5/forecast?lat=55.6052931&lon=13.0001566&appid=32048c51a51efb088d2271a2fc836497")
    .then((response) => {
        if(!response.ok){
            throw new Error ("Network response was not ok...");
        }
        return response.json();
    })
    .then((weather) =>{
        const container = document.getElementById("weather-container");
        container.innerHTML="";

        weather.forEach((weather) =>{
            const day = document.createElement("div");
            day.classList.add("weather-div");

        })
    })
    
};


// news API 

// function getNews(){
//     // const APIkey = '41eb5c87ff469f988a235f7a124ef426';



    // fetch("https://newsdata.io/api/1/news?apikey=pub_772322fb2a44c7c263d727244d39469d834b6&country=se&language=sv&category=top")
    // .then((response) => {
    //     if (!response.ok){
    //         throw new Error("Network response was not ok...");
    //     }
    //     return response.json();
    // })
    // .then((news) =>{
    //     const container = document.getElementById("news-container");
    //     container.innerHTML = "";

    //     news.results.forEach((news) => {
    //         const article = document.createElement("div");
    //         article.classList.add("news-div");

    //         const text = document.createElement("div");
    //         text.classList.add("news-text");

    //         const title = document.createElement("h3");
    //         title.textContent = news.title;

    //         const description = document.createElement("p");
    //         description.textContent = news.description;

    //         if(news.description === null){
    //             description.style.display="none";
    //         }else{
    //             description.textContent = news.description;
    //             description.style.display = "block";
    //         }

    //         const source = document.createElement("h4");
    //         source.textContent = news.source_name;

    //         const link = document.createElement("a");
    //         link.href = news.link;
    //         link.textContent = "Read more";
    //         link.target = "_blank";
    //         link.id = "article_link";


    //         const newsImg = document.createElement("img");
    //         newsImg.classList.add("news-image");
    //         newsImg.src = news.image_url;

    //         if(news.image_url === null){
    //             newsImg.style.display="none";
    //         }else{
    //             newsImg.src = news.image_url;
    //             newsImg.style.display = "block";
    //         }



    //         text.appendChild(title);
    //         text.appendChild(description);
    //         text.appendChild(source);
    //         text.appendChild(link);

    //         article.appendChild(text);
    //         article.appendChild(newsImg);

    //         container.appendChild(article);

    //     })

    //     .catch((error) => {
    //         console.error("Error fetching news:", error);
    //     });

    // });
let PUBLIC_KEY = "1a42561ede3c3bfd9f9fab8aeeee5d4a";
let PRIVATE_KEY = "c42a824b5adae0d21e2d17ef0bf6f5bc3d3095b4";
const timestamp = new Date().getTime();
const urlpath = "https://gateway.marvel.com/v1/public/";
const hash = CryptoJS.MD5(`${timestamp}${PRIVATE_KEY}${PUBLIC_KEY}`).toString();

const homePage = document.getElementById("home-page");
const favsPage = document.getElementById("favourites-page");
const infoPage = document.getElementById("hero-info-page");
const searchPage = document.getElementById("search-page");

function toggleFavs(){
    homePage.style.display = "none";
    infoPage.style.display = "none";
    searchPage.style.display = "none";
    favsPage.style.display = "block";
}

function toggleHome(){
    searchResults.splice(0,searchResults.length);
    homePage.style.display = "block";
    infoPage.style.display = "none";
    searchPage.style.display = "none";
    favsPage.style.display = "none";
}

function toggleInfoPage(){
    homePage.style.display = "none";
    infoPage.style.display = "block";
    searchPage.style.display = "none";
    favsPage.style.display = "none";
}

function toggleSearchPage(){
    homePage.style.display = "none";
    infoPage.style.display = "none";
    searchPage.style.display = "block";
    favsPage.style.display = "none";
}




// homepage logic
const cardsList = document.getElementById("cardsList");
let charArray = [];

function fetchData() {
    fetch(`${urlpath}characters?events=310&ts=${timestamp}&apikey=${PUBLIC_KEY}&hash=${hash}&limit=100`)
    .then(response => response.json())
    .then(response => {
        charArray = response.data.results;
        console.log(charArray);
        renderData(charArray);
    });
}


function renderData(charArray){
    for(let hero of charArray){
        // console.log(hero);
        if(!hero.thumbnail.path.includes('image_not_available') && !hero.description == "" && cardsList.childElementCount < 24){
            let card = document.createElement('div');
            card.className = "cards-container";
            let content = `
            <div class='cards'>
                <img src = ${hero.thumbnail.path +"." + hero.thumbnail.extension} class="card-image" onclick="fetchChar(${hero.id})">
                <div class="card-name-container">
                    <p class="name">${hero.name.length<=16?hero.name.slice(0,15):hero.name.slice(0,15)+".."}</p>
                    <img src="./fav.png" class="favourites-icon" id="${"fav"+hero.id}" onclick="addTofav(${hero.id})">
                </div>
            </div>
            `
            card.innerHTML = content;
            card.style
            cardsList.appendChild(card);
        }  
    }
}

fetchData();



// ...........................................................................................................................





// search-results page logic
const search = document.getElementById("search-bar");
const searchPageResults = document.getElementById("search-results");
let searchResults =[];

search.addEventListener("search",(event)=>{
    searchHero(event.target.value);
})

// function to show the search results 
function searchHero(val){
    if(val!=""){
        fetch(`${urlpath}characters?nameStartsWith=${val}&ts=${timestamp}&apikey=${PUBLIC_KEY}&hash=${hash}&limit=100`)
        .then(response => response.json())
        .then(response => {
            searchResults = response.data.results;
            // console.log(searchResults); 
            renderSearchResults(searchResults);
            toggleSearchPage();
        });
    }
}

// function to render search results
function renderSearchResults(searchResults){
    searchPageResults.innerHTML ="";
    for(let hero of searchResults){
        if(!hero.thumbnail.path.includes('image_not_available') && !hero.description == ""){
            let card = document.createElement('div');
            card.className = "cards-container";
            let content = `
            <div class='cards'>
                <img src = ${hero.thumbnail.path +"." + hero.thumbnail.extension} class="card-image" onclick="fetchChar(${hero.id})">
                <div class="card-name-container">
                    <p class="name">${hero.name.length<=16?hero.name.slice(0,15):hero.name.slice(0,15)+".."}</p>
                    <img src="./fav.png" class="favourites-icon" id="${"fav"+hero.id}" onclick="addTofav(${hero.id})">
                </div>
            </div>
            `
            
            card.innerHTML = content;
            // card.appendChild(content);
            card.style
            searchPageResults.appendChild(card);
        }  
    }
}



// ...........................................................................................................................





// function to  hero info page
const container = document.getElementById("hero-info-container");


function fetchChar(heroID) {
    container.innerHTML =`
    <img src="./back.png">
    `;
    fetch(`${urlpath}characters/${heroID}?ts=${timestamp}&apikey=${PUBLIC_KEY}&hash=${hash}&limit=50`)
    .then(response => response.json())
    .then(response => {
        console.log(response.data.results);
        heroInfo = response.data.results;
        const storiescount = heroInfo[0].stories.items.length;
        const comicscount = heroInfo[0].comics.items.length;
        const eventscount = heroInfo[0].events.items.length;
        const seriescount = heroInfo[0].series.items.length;
        container.innerHTML =`
        <img src = ${heroInfo[0].thumbnail.path +"." + heroInfo[0].thumbnail.extension} id="hero-img">
        <div id="hero-info-text">
            <p id="hero-name">${heroInfo[0].name}</p>
            <p id="hero-description">${heroInfo[0].description}</p>
            <br>
            <p class="count-info">Total comic appearances: ${heroInfo[0].comics.available}</p>
            ${((storiescount > 2) && (eventscount > 2) && (seriescount > 2) && (comicscount > 2))?`<p class="count-data">${heroInfo[0].comics.items[0].name},\u00A0\u00A0 ${heroInfo[0].comics.items[1].name},\u00A0\u00A0 ${heroInfo[0].comics.items[2].name},.....</p>`:""}
            <p class="count-info">Total story appearances: ${heroInfo[0].stories.available}</p>
            ${((storiescount > 2) && (eventscount > 2) && (seriescount > 2) && (comicscount > 2))?`<p class="count-data">${heroInfo[0].stories.items[0].name},\u00A0\u00A0 ${heroInfo[0].stories.items[1].name},\u00A0\u00A0 ${heroInfo[0].stories.items[2].name},.....</p>`:""}
            <p class="count-info">Total series appearances: ${heroInfo[0].series.available}</p>
            ${((storiescount > 2) && (eventscount > 2) && (seriescount > 2) && (comicscount > 2))?`<p class="count-data">${heroInfo[0].series.items[0].name},\u00A0\u00A0 ${heroInfo[0].series.items[1].name},\u00A0\u00A0 ${heroInfo[0].series.items[2].name},.....</p>`:""}
            <p class="count-info">Total events appearances: ${heroInfo[0].events.available}</p>
            ${((storiescount > 2) && (eventscount > 2) && (seriescount > 2) && (comicscount > 2))?`<p class="count-data">${heroInfo[0].events.items[0].name},\u00A0\u00A0 ${heroInfo[0].events.items[1].name},\u00A0\u00A0 ${heroInfo[0].events.items[2].name},.....</p>`:""}
        </div>
        `
        toggleInfoPage();
    });
}



function handleInfoBackButton(){
    
    if(searchResults.length == 0){
        toggleHome();
    }else{
        toggleSearchPage();
    }
}





// favourites logic
const favs = document.getElementById("favourites")
let favourites = [];


function checkFavsEmpty(){
    if(favourites.length == 0){
        favs.style.height = "70vh";
        favs.style.backgroundImage = `url("./empty.gif")`;
        favs.style.backgroundSize = "cover";
        favs.style.opacity = "0.3";

    }else{
        favs.style.backgroundImage = "none";
        favs.style.opacity = "1";
        favs.style.height = "auto";
    }
    requestAnimationFrame(checkFavsEmpty);
}

checkFavsEmpty();

const addTofav = (heroID) =>{
    for(let hero of favourites){
        if(heroID == hero[0].id){return;}
    }
    fetch(`${urlpath}characters/${heroID}?ts=${timestamp}&apikey=${PUBLIC_KEY}&hash=${hash}&limit=50`)
    .then(response => response.json())
    .then(response => {
        heroInfo = response.data.results;
        favourites.push(heroInfo);
        renderFavourites(favourites);
        console.log(favourites);
        const elem = document.getElementById(`fav${heroID}`);
        elem.style.backgroundColor = "black";
    });

    
}

function renderFavourites(favsArray) {
    favs.innerHTML ="";
    for(let hero of favsArray){
        let card = document.createElement('div');
        card.className = "cards-container";
        let content = `
        <div class='cards'>
            <img src = ${hero[0].thumbnail.path +"." + hero[0].thumbnail.extension} class="card-image">
            <div class="card-name-container">
                <p class="name">${hero[0].name.length<=16?hero[0].name.slice(0,15):hero[0].name.slice(0,15)+".."}</p>
                <img src="./remove.png" class="delete-icon" id="${"del"+hero.id}" onclick="removeFromFavourites(${hero[0].id})">
            </div>
        </div>
        `
        card.innerHTML = content;
        // card.appendChild(content);
        card.style
        favs.appendChild(card);
    }  
}



function removeFromFavourites(heroID){
    let index = 0;
    for(hero in favourites){
        if(favourites[hero][0].id == heroID){
            index = hero;
        }
    }
    favourites.splice(index,1);
    const elem = document.getElementById(`fav${heroID}`);
    elem.style.backgroundColor = "rgb(149, 5, 5)";
    renderFavourites(favourites);
}



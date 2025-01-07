console.log("index.js is loaded");

/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {

    // loop over each item in the data
    for (let i = 0; i < games.length; i++) {
        


        // create a new div element, which will become the game card
        let gameCard = document.createElement('div');

        // add the class game-card to the list
        gameCard.classList.add('game-card');

        // set the inner HTML using a template literal to display some info 
        // about each game
        // TIP: if your images are not displaying, make sure there is space
        // between the end of the src attribute and the end of the tag ("/>")
        gameCard.innerHTML = `
        <h2>${games[i].name}</h2> 
        <img src="${games[i].img}" alt="${games[i].name}" class="game-img" />
        <p>${games[i].description}</p>
        `;

        // append the game to the games-container
        document.getElementById('games-container').appendChild(gameCard);
    }
}

// call the function we just defined using the correct variable
// later, we'll call this function using a different list of games
addGamesToPage(GAMES_JSON);

/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");
const contributionsContainer = document.getElementById("contributions-card");

// use reduce() to count the number of total contributions by summing the backers
const totalContributions = GAMES_JSON.reduce((total, game) => total + game.backers, 0);

// set the inner HTML using a template literal and toLocaleString to get a number with commas
contributionsCard.innerHTML = `${totalContributions.toLocaleString()}`;

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");
const raisedContainer = document.getElementById("raised-card");

// use reduce() to find the total amount raised
const totalRaised = GAMES_JSON.reduce((total, game) => total + game.pledged, 0);

// set inner HTML using template literal
raisedCard.innerHTML = `$${totalRaised.toLocaleString()}`;

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");
const games_Container = document.getElementById("games-card");

// set inner HTML gamesCard
gamesCard.innerHTML = `${GAMES_JSON.length}`;

// add animation event listener to the cards
contributionsCard.addEventListener('click', function() {
    const countUp = new CountUp('num-contributions', totalContributions);
    if (!countUp.error) {
        countUp.start();
    } else {
        console.error(countUp.error);
    }
});

raisedCard.addEventListener('click', function() {
    const countUp = new CountUp('total-raised', totalRaised);
    if (!countUp.error) {
        countUp.start();
    } else {
        console.error(countUp.error);
    }
});

gamesCard.addEventListener('click', function() {
    const countUp = new CountUp('num-games', GAMES_JSON.length);
    if (!countUp.error) {
        countUp.start();
    } else {
        console.error(countUp.error);
    }
});




/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have not yet met their goal
    const unfundedGames = GAMES_JSON.filter(game => game.pledged < game.goal);

    // use the function we previously created to add the unfunded games to the DOM
    addGamesToPage(unfundedGames);

    // highlight the clicked button
    hightLightButton(unfundedBtn);
}

// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have met or exceeded their goal
    const fundedGames = GAMES_JSON.filter(game => game.pledged >= game.goal);

    // use the function we previously created to add unfunded games to the DOM
    addGamesToPage(fundedGames);

    // highlight the clicked button
    hightLightButton(fundedBtn);
}

// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);

    // add all games from the JSON data to the DOM
    addGamesToPage(GAMES_JSON);

    // highlight the clicked button
    hightLightButton(allBtn);
}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener("click", filterUnfundedOnly);
fundedBtn.addEventListener("click", filterFundedOnly);
allBtn.addEventListener("click", showAllGames);

// active filter button

const buttons = [unfundedBtn, fundedBtn, allBtn];

// reset filter button style
function resetButtonStyles(){
    buttons.forEach(button => button.classList.remove('active-filter-btn'));
}

// highlight active filter button
function hightLightButton(button) {
    resetButtonStyles();
    button.classList.add('active-filter-btn');
}






/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
const unfundedGames = GAMES_JSON.filter(game => game.pledged < game.goal);
const countUnfundedGames = unfundedGames.length;

// Calculate the total number of money raised & total number of games
const totalPledged = GAMES_JSON.reduce((sum, game) => sum + game.pledged, 0);
const totalGames = GAMES_JSON.length;

// create a string that explains the number of unfunded games using the ternary operator
const unfundedText = countUnfundedGames === 1 ? 'game remains unfunded ': 'games remain unfunded';
const displayString = `
    A total of $${totalPledged.toLocaleString()} has been raised for 
    ${totalGames} games. Currently ${countUnfundedGames} ${unfundedText}. 
    We need your help to fund these amazing games!
    `;

// create a new DOM element containing the template string and append it to the description container
const infoParagraph = document.createElement('p');
infoParagraph.textContent = displayString;

descriptionContainer.appendChild(infoParagraph);


/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames = GAMES_JSON.sort((item1, item2) => {
    return item2.pledged - item1.pledged;
});

// Use destructuring and the spread operator to grab the first and second games
const [firstGame, secondGame, ...rest] = sortedGames;

// Create a new element to hold the name of the top pledge game, then append it to the correct element
const firstGameName = document.createElement('h2');
firstGameName.innerHTML = `
    ${firstGame.name} - $<span id="first-game-pledged">${firstGame.pledged.toLocaleString()}</span>
    `;
firstGameContainer.appendChild(firstGameName);

// Do the same for the runner up item
const secondGameName = document.createElement('h2');
secondGameName.innerHTML = `
    ${secondGame.name} - $<span id="second-game-pledged">${secondGame.pledged.toLocaleString()}</span>
    `;
secondGameContainer.appendChild(secondGameName);

// Add animation event listeners to the containers
firstGameContainer.addEventListener("click", function() {
    console.log("First game container clicked");
    document.getElementById("first-game-pledged").innerText = "0"; // Reset to 0 before animation
    const countUp = new CountUp("first-game-pledged", firstGame.pledged);
    if (!countUp.error) {
        countUp.start();
    } else {
        console.error(countUp.error);
    }
});

secondGameContainer.addEventListener("click", function() {
    console.log("Second game container clicked");
    document.getElementById("second-game-pledged").innerText = "0"; // Reset to 0 before animation
    const countUp = new CountUp("second-game-pledged", secondGame.pledged);
    if (!countUp.error) {
        countUp.start();
    } else {
        console.error(countUp.error);
    }
});




// Search Bar 
const searchBar = document.getElementById('search-bar');

searchBar.addEventListener('input', function(){
    const searchQuery = searchBar.value.toLowerCase();
    const filteredGames = GAMES_JSON.filter(game => game.name.toLowerCase().includes(searchQuery));

    deleteChildElements(gamesContainer);
    addGamesToPage(filteredGames);
});

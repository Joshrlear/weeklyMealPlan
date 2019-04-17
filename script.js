'use strict'

// Background Image API
const pixabayApi = '12181901-0ae683bad462aef9e23b07d08';
const pixabayUrl = 'https://pixabay.com/api/';

// Edamam Key and ID
const edamamKey = '3ea9d172ac4a9f190c88c7603e386b8f';
const edamamAppId = '97ad01ba';

// Edamam Recipe API
const edamamRecipeUrl = 'https://api.edamam.com/search';

// Edamam Nutrition API
const edamamNutritionUrl = 'https://api.edamam.com/api/nutrition-details';

// Edamam Food API
const edamamFoodUrl = 'https://api.edamam.com/api/food-database/parser';


// Page HTML Database
const HTML = {
    dietOptions: [
        
    ],
    weekMealPlan: `
    <section id="js-weekday-section" class="weekday-section" data-expanded="false">
          <article role="article" class="article">
              <header role="header">
                <h1>Monday</h1>
                <h2>Recipe Name</h2>
                <h3>730kcal</h3>
                <p>Shrimp, rice, grape tomatoes...</p>
                </header>
          <img role="img" src="${edamamapi.image.placeholder}" alt="Recipe image for Monday" id="js-monday" class="weekday-recipe-img">
          </article>
          <article role="article" class="article">
              <header role="header">
                <h1>Tuesday</h1>
                <h2>Recipe Name</h2>
                <h3>730kcal</h3>
                <p>Shrimp, rice, grape tomatoes...</p>
                </header>
            </div>
          <img role="img" src="${edamamapi.image.placeholder}" alt="Recipe image for Tuesday" id="js-tuesday" class="weekday-recipe-img">
          </article>
          <article role="article" class="article">
              <header role="header">
                <h1>Wednesday</h1>
                <h2>Recipe Name</h2>
                <h3>730kcal</h3>
                <p>Shrimp, rice, grape tomatoes...</p>
                </header>
          <img role="img" src="${edamamapi.image.placeholder}" alt="Recipe image for Wednesday" id="js-wednesday" class="weekday-recipe-img">
          </article>
          <article role="article" class="article">
              <header role="header">
                <h1>Thursday</h1>
                <h2>Recipe Name</h2>
                <h3>730kcal</h3>
                <p>Shrimp, rice, grape tomatoes...</p>
                </header>
          <img role="img" src="${edamamapi.image.placeholder}" alt="Recipe image for Thursday" id="js-thursday" class="weekday-recipe-img">
          </article>
          <article role="article" class="article">
              <header role="header">
                <h1>Friday</h1>
                <h2>Recipe Name</h2>
                <h3>730kcal</h3>
                <p>Shrimp, rice, grape tomatoes...</p>
                </header>
          <img role="img" src="${edamamapi.image.placeholder}" alt="Recipe image for Friday" id="js-friday" class="weekday-recipe-img">
          </article>
          <article role="article" class="article">
              <header role="header">
                <h1>Saturday</h1>
                <h2>Recipe Name</h2>
                <h3>730kcal</h3>
                <p>Shrimp, rice, grape tomatoes...</p>
                </header>
          <img role="img" src="${edamamapi.image.placeholder}" alt="Recipe image for Saturday" id="js-saturday" class="weekday-recipe-img">
          </article>
          <article role="article" class="article">
              <header role="header">
                <h1>Sunday</h1>
                <h2>Recipe Name</h2>
                <h3>730kcal</h3>
                <p>Shrimp, rice, grape tomatoes...</p>
                </header>
          <img role="img" src="${edamamapi.image.placeholder}" alt="Recipe image for Sunday" id="js-sunday" class="weekday-recipe-img">
          </article>
          </section>
    `,
}

function displayResults(Responsejson) {
    console.log(Responsejson);
}

function formatQueryParams(params) {
    /*for (let value in params) {
        if (params[value] === 'N/A' || params[value] === undefined || params[value] === null || params[value] === '') {
            delete params[value];
        }
    }*/
    console.log(params);
    const queryItems = Object.keys(params).map(key =>
        `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        return queryItems.join('&');
}

function getRecipes(q, diet, calLimit, exclusions) {

    const query = {
        q: q,
        diet: diet,
        calories: calLimit,
        excluded: exclusions,
        to: 7,
        app_id: edamamAppId,
        app_key: edamamKey
    };

    const params = generateParam(query);
    function generateParam(query) {
        let newKey = {};
        Object.keys(query).forEach((value) => {
            if (query[value]) {
                newKey[value] = query[value];
            }
        });
        return newKey;
    };

    

    const queryString = formatQueryParams(params);
    const url = edamamRecipeUrl + '?' + queryString;

    fetch(url)
    .then(Response => {
        if(Response.ok) {
            return Response.json();
        }
        throw new Error(Response.statusText);
    })
    .then(Responsejson => displayResults(Responsejson))
    .catch(err => {
        $('#js-main').text(`Uh oh, something went wrong: ${err.message}`);
    });
}

// Seperate any exclusions by commas. Removes the following: " ", ",", "and" 
function generateEx(exclude) {
    return exclude.split(/[\W\d]|\band|none|nothing|nope\b/g).filter(empty => empty != '').join(',');
}

// Check for blank values. If blank delete or assign a default value
/*function handleBlank(q, diet, calLimit, exclusions) {
    const query = [q, diet, calLimit, exclusions];
    const filtered = query.filter(empty);
    function empty(value) {
        if (value !== 'N/A' || value !== null || value !== undefined || value !== '') {
            return value;
        }
    }
    console.log(filtered.join());
    return filtered.join();
}*/

// Runs after clicking search button on start page
function handleSearch() {
    $('#js-form').submit(event => {
        event.preventDefault();
        const query = $('#js-search-query').val();
        const diet = $('#js-diet-dropdown').val();
        const calories = $('#js-input').val();
        const exclude = $('#js-textarea').val();
        const q = query ? query : 'healthy';
        const calLimit = calories ? `0-${calories}` : calories;
        const exclusions = generateEx(exclude);
        getRecipes(q, diet, calLimit, exclusions);
    })
}

// Runs on page load
$(function onLoad() {
    console.log('load');
    handleSearch();
})
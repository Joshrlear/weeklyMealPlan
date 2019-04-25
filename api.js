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


function getWeekDay(i) {
        const weekArray = {
            1: 'Monday',
            2: 'Tuesday',
            3: 'Wednesday',
            4: 'Thursday',
            5: 'Friday',
            6: 'Saturday',
            7: 'Sunday',
            8: 'Monday',
            9: 'Tuesday',
            10: 'Wednesday',
            11: 'Thursday',
            12: 'Friday',
            13: 'Saturday'
        };

        const date = new Date();
        const day = date.getDay() + i;
        return weekArray[day];
}

function getRecipeName(Responsejson, i) {
    return Responsejson.hits[i].recipe.label;
}

function getCals(Responsejson, i) {
    const totalCals = Responsejson.hits[i].recipe.calories;
    const servings = Responsejson.hits[i].recipe.yield;
    return Math.round(totalCals / servings);
}

function getServings(Responsejson, i) {
    return Responsejson.hits[i].recipe.yield;
}

function getTimeToMake(Responsejson, i) {
    const time = Responsejson.hits[i].recipe.totalTime;
    return `${time}mins`
}

function getSnippet(Responsejson, i) {
    const ingredients = Responsejson.hits[i].recipe.ingredientLines;
    const snippet = ingredients.join(', ').substring(0, 22);
    return snippet;
}

function getIngredients(Responsejson, i) {
    const ingredientList = []
    const ingredients = Responsejson.hits[i].recipe.ingredientLines;
    for (let x of ingredients) {
        ingredientList.push(`<li>${x}</li>`);
    }
    return ingredientList;
}

function getImage(Responsejson, i) {
    return Responsejson.hits[i].recipe.image;
}

function displayResults(Responsejson) {
    $('#js-main').empty();
    $('#js-main').css({
        position: 'unset',
        top: 'unset',
        left: 'unset',
        transform: 'unset',
        width: '100vw',
        padding: '0px'
    });
    $('#js-main').html(`<ul id="js-container" class="container"></ul>`)
    const num = Responsejson.to;
    console.log(Responsejson);

    for (let i = 0; i < num; i++) {
        const day = getWeekDay(i);
        //console.log(day);
        const recipe = getRecipeName(Responsejson, i);
        //console.log(recipe);
        const snippet = getSnippet(Responsejson, i);
        //console.log(snippet);
        const calories = getCals(Responsejson, i);
        //console.log(calories);
        const servings = getServings(Responsejson, i);
        //console.log(servings);
        const timeToMake = getTimeToMake(Responsejson, i);
        //console.log(timeToMake);
        const ingredients = getIngredients(Responsejson, i);
        //console.log('ingredients');
        const image = getImage(Responsejson, i);
        //console.log(image);
        
        $('#js-container').append(
            `
            <li id="js-box" class="box box1" data-expand="false">
              <section class="header-container">
              <header role="header" id="js-recipe-header" class="recipe-header">
                  <h1>${day}</h1>
                  <h2>${recipe}</h2>
                  <h3>${calories}kcal</h3>
                  <p>${snippet}...</p>
              </header>
              <img role="img" src=${image} alt="Recipe image for Monday" id="js-recipe-img" class="recipe-img">
              </section>
              <section id="js-section" class="section">
                <section class="recipe-info">
                  <header class="info-header">
                    <h1>${day}</h1>
                    <h2>${recipe}</h2>
                    <h3>${calories}kcal per serving | ${servings} Servings</h3>
                    <p><em>Takes approximately: ${timeToMake}</em></p>
                  </header>
                  <article>
                    <h2>Ingredients</h2>
                    <ul id="js-ingredient-list" class="ingredient-list">
                    ${ingredients}
                    </ul>
                  </article>
                </section>
                  </section>
            </li>
            `
        )
    }
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
    .catch(err => { console.log(err);
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